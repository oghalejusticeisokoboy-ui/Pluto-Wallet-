# Pluto Wallet Backend

Node.js/Express backend API for the Pluto Wallet application.

## Setup

```bash
cd backend
npm install
cp ../.env.example .env
# Edit .env with your configuration
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Wallet
- `POST /api/wallet/create` - Create new wallet
- `GET /api/wallet/list` - Get all wallets
- `GET /api/wallet/:walletId` - Get wallet details

### Transactions
- `POST /api/transactions/send` - Send transaction
- `GET /api/transactions/history` - Get transaction history

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Features

- User authentication with JWT
- Multi-wallet support
- Transaction management
- Blockchain integration (Ethereum, Polygon, Bitcoin)
- Rate limiting for security
