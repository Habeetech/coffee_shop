# ☕ Coffee Shop

A full-stack coffee shop ordering platform implemented as a pnpm monorepo.

This repository includes a React/Vite frontend, an Express.js backend API, and a shared utility package.

## 📁 Repository Structure

```
coffee_shop/
├── apps/
│   ├── backend/              # Express API server
│   ├── frontend/             # React Vite application
├── packages/
│   └── utils/                # Shared utility package
├── pnpm-workspace.yaml       # Monorepo workspace config
└── package.json              # Root scripts and workspace config
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- pnpm (`npm install -g pnpm`)
- MongoDB Atlas or local MongoDB
- Stripe account (for payments)
- ImageKit account (for image uploads)

### Install dependencies
```bash
pnpm install
```

### Run locally
```bash
pnpm dev
```

This launches both apps in development mode.

### Run apps individually
```bash
pnpm --filter backend dev
pnpm --filter frontend dev
```

## 📦 Apps

### `apps/backend`
- Express.js REST API
- MongoDB with Mongoose
- JWT authentication
- Stripe payment integration
- Socket.IO real-time notifications
- Email utilities

### `apps/frontend`
- React 19 with Vite
- Zustand state management
- React Router v7
- Stripe frontend integration
- Socket.IO client
- Responsive UI for browsing, ordering, and tracking

### `packages/utils`
- Shared monorepo package
- Utility helpers used across apps

## 🌐 Useful Links
- [Backend README](apps/backend/README.md)
- [Frontend README](apps/frontend/README.md)
- [Shared Utils README](packages/utils/README.md)

## 🧪 Testing
Run backend tests:
```bash
pnpm --filter backend test
```

## 💡 Notes
- Backend defaults to `http://localhost:3000`
- Frontend defaults to `http://localhost:5173`
- Environment variables are configured per app

## 🤝 Contributing
1. Create a branch from `main`
2. Add your feature or fix
3. Run tests and verify locally
4. Open a pull request with a clear summary

---

**Enjoy building with Coffee Shop!**
