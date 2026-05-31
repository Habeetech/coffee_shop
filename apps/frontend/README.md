# ☕ Coffee Shop Frontend

React/Vite frontend for the Coffee Shop ordering experience.

Browse products, build orders, checkout with Stripe, and track orders in real time.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- pnpm package manager
- Backend API running locally or deployed

### Install dependencies
```bash
cd apps/frontend
pnpm install
```

### Environment
Create `apps/frontend/.env.local` with:

```env
VITE_API_URL=http://localhost:3000
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
VITE_IMAGEKIT_PUBLIC_KEY=your_public_key
```

### Start development server
```bash
pnpm dev
```

The frontend runs on `http://localhost:5173` by default.

## 📁 Project Structure

```
apps/frontend/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── api/api.js
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── guards/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── service/
│   ├── store/
│   ├── styles/
│   ├── utils/
│   └── validators/
├── package.json
└── vite.config.js
```

## 🧩 Features

- User registration and login
- Guest checkout support
- Product browsing with filtering and search
- Custom drink options and add-ons
- Shopping cart with quantity management
- Stripe payment processing
- Order history and order tracking
- Real-time notifications with Socket.IO
- Profile management and favorites

## 🛠️ Scripts

```bash
pnpm dev      # start frontend
pnpm build    # production build
pnpm preview  # preview production build
pnpm lint     # run ESLint
```

## 🔌 Environment Variables

| Variable | Purpose |
|---------|---------|
| `VITE_API_URL` | Backend API endpoint |
| `VITE_IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |
| `VITE_IMAGEKIT_PUBLIC_KEY` | ImageKit public key |

## 📦 Key Frontend Modules

- `src/api/api.js` — API request layer
- `src/components/` — reusable UI components
- `src/guards/` — route protection logic
- `src/hooks/` — custom hooks for API, checkout, and UI behavior
- `src/store/` — Zustand state stores
- `src/context/SocketContext.jsx` — Socket.IO connection provider

## 🛡️ Route Guards

- `GuestGuard` for unauthenticated routes
- `ProtectedGuard` for authenticated routes
- `RoleGuard` for role-based access control

## 🚀 Deployment

Build the app with:
```bash
pnpm build
```

Preview the build locally:
```bash
pnpm preview
```

For production, deploy with Vercel or another static hosting provider.

## 💡 Notes

- The frontend expects the backend API at `VITE_API_URL`
- Ensure the backend is running before testing checkout
- Use Stripe test keys during development
