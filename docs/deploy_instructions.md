Pluto Wallet — Vercel + Render deployment instructions

This document describes how to deploy the frontend to Vercel and the backend to Render, and what environment variables to configure.

Overview
- Frontend: Next.js app in /frontend — deploy to Vercel (recommended: pluto-wallet-frontend)
- Backend: Node service in /backend — deploy to Render (recommended: pluto-wallet-backend)
- CI: GitHub Actions workflow builds both frontend and backend on PRs and pushes to main

Files added in branch deploy/vercel-render
- frontend/vercel.json
- render.yaml
- .github/workflows/deploy.yml

Environment variables (set these in the provider dashboards)

Backend (Render) - required:
- MONGODB_URI — MongoDB connection string with write privileges
- JWT_SECRET — JWT secret for your backend
- WALLET_ENCRYPTION_KEY — server key used for encrypt/decrypt (32 bytes, base64 or hex)
- INFURA_API_KEY or ALCHEMY_API_KEY — (optional) if used for blockchain RPC
- PORT — (optional) default 5000

Frontend (Vercel) - required:
- NEXT_PUBLIC_API_URL — https://<your-backend-render-url>
- (any other NEXT_PUBLIC_* variables used by your app)

Steps — Vercel (Frontend)
1. Go to https://vercel.com and sign in.
2. Click "New Project" -> Import Git Repository -> choose this repo (oghalejusticeisokoboy-ui/Pluto-Wallet-).
3. Set the project name to "pluto-wallet-frontend" (or choose your own).
4. In Project Settings -> Environment Variables, add NEXT_PUBLIC_API_URL with your Render service URL (set after backend is deployed).
5. Deploy the project. Vercel will detect Next.js and run the build.

Steps — Render (Backend)
1. Go to https://render.com and sign in.
2. Click "New" -> "Web Service" -> Connect your GitHub repo and select this repository.
3. Choose branch `main` and set the environment to "Node".
4. For build command, you can use: cd backend && npm install && npm run build
5. For start command: cd backend && npm run start
6. Add the environment variables listed above in the Render dashboard (MONGODB_URI, JWT_SECRET, WALLET_ENCRYPTION_KEY, etc.).
7. Create the service. Render will build and expose a Public URL (e.g., https://pluto-wallet-backend.onrender.com).

Post-deploy steps
- Copy the Render service URL and set it as NEXT_PUBLIC_API_URL in Vercel environment variables.
- Trigger a redeploy of the frontend so it picks up the API URL.

Notes & Security
- Do not commit secrets to the repo. Use provider environment variables or a secret manager.
- Ensure WALLET_ENCRYPTION_KEY is a 32-byte value represented safely (base64 or hex). Keep it secret.
- Use TLS for all endpoints. Do not expose private keys in logs or client-side code.

If you want automatic deployments via GitHub Actions to call Vercel/Render APIs, I can add action steps that POST to those provider APIs — you will need to add provider tokens as GitHub secrets (VERCEL_TOKEN, RENDER_API_KEY). Ask me to add that if you want.
