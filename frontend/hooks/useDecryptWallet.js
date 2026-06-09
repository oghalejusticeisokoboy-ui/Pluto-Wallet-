import { useState, useCallback } from 'react';
import { scrypt } from 'scrypt-js';

// Hook: useDecryptWallet
// Usage:
// const { decrypt, plaintext, status, error } = useDecryptWallet();
// await decrypt(payloadBase64, saltBase64, pin);
// plaintext will contain the decrypted private key (string) on success.

function base64ToUint8Array(b64) {
  const binary = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function concatUint8(a, b) {
  const c = new Uint8Array(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

// Derive key with scrypt (N=16384, r=8, p=1) to match the server script
function deriveKeyFromPin(pin, saltBase64) {
  const passwordBytes = new TextEncoder().encode(pin);
  const salt = base64ToUint8Array(saltBase64);
  const N = 16384;
  const r = 8;
  const p = 1;
  const dkLen = 32;
  return new Promise((resolve, reject) => {
    scrypt(passwordBytes, salt, N, r, p, dkLen, (error, progress, key) => {
      if (error) return reject(error);
      if (key) return resolve(new Uint8Array(key));
    });
  });
}

async function importAesKey(rawKeyUint8) {
  return crypto.subtle.importKey(
    'raw',
    rawKeyUint8.buffer,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

// Decrypt payload formatted as base64(iv(12) + authTag(16) + ciphertext)
async function decryptPayloadWithDerivedKey(payloadBase64, derivedKeyUint8) {
  const buf = base64ToUint8Array(payloadBase64);
  if (buf.length < 12 + 16 + 1) throw new Error('Encrypted payload too short');
  const iv = buf.slice(0, 12);
  const tag = buf.slice(12, 28);
  const ciphertext = buf.slice(28);
  const data = concatUint8(ciphertext, tag); // WebCrypto expects ciphertext+tag

  const cryptoKey = await importAesKey(derivedKeyUint8);

  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv, tagLength: 128 },
    cryptoKey,
    data
  );

  return new TextDecoder().decode(new Uint8Array(plainBuffer));
}

export default function useDecryptWallet() {
  const [status, setStatus] = useState('idle'); // idle | deriving | decrypting | done | error
  const [plaintext, setPlaintext] = useState(null);
  const [error, setError] = useState(null);

  const decrypt = useCallback(async (payloadBase64, saltBase64, pin) => {
    setStatus('deriving');
    setError(null);
    setPlaintext(null);
    try {
      const derived = await deriveKeyFromPin(pin, saltBase64);
      setStatus('decrypting');
      const plain = await decryptPayloadWithDerivedKey(payloadBase64, derived);
      setPlaintext(plain);
      setStatus('done');
      return { success: true, plaintext: plain };
    } catch (err) {
      console.error('useDecryptWallet error:', err);
      setError(err.message || String(err));
      setStatus('error');
      return { success: false, error: err };
    }
  }, []);

  return { decrypt, plaintext, status, error };
}
