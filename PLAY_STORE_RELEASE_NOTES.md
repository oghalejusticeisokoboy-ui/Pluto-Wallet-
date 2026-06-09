Pluto Wallet — Play Store publishing and CI/CD

This project includes automated CI to build Android artifacts and a sample Fastlane setup to upload to Google Play. IMPORTANT: Do NOT use real funds until you complete compliance, security audits, and production reviews.

Required GitHub Secrets (add these before using the Play upload workflow):

- PLAY_SERVICE_ACCOUNT_JSON — The Google Play service account JSON contents (copy the JSON into the secret value).
- ANDROID_KEYSTORE_B64 — Base64-encoded contents of your Android signing keystore (.jks or .keystore). Example:

  base64 release.keystore | pbcopy
  # then paste into the secret value

- KEYSTORE_PASSWORD — Password for the keystore
- KEY_ALIAS — Key alias inside the keystore
- KEY_PASSWORD — Key password for the alias

How to run the Play upload (once secrets are set):

1. Ensure fastlane is configured (fastlane/Fastfile contains a sample lane).
2. From Actions tab run the "Fastlane Play Store Upload" workflow (or trigger via workflow_dispatch).
3. The workflow will build an AAB and attempt to upload to the track you select (internal/alpha/beta/production).

Notes & safety
- Uploading to production will publish to users if your Play Console settings allow it. Use the internal track for testing.
- Do not store unencrypted secrets in the repo. Use GitHub Secrets as described above.

Next steps (recommended)
- Configure Google Play App Signing or use your keystore carefully.
- Use internal test track and a small set of testers before any wider release.
- Add privacy policy, terms, and contact information in the Play Console.
