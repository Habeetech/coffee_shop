# ☕ Coffee Shop Backend API

Express.js backend for the Coffee Shop application.

This API powers product management, orders, checkout, authentication, notifications, and real-time updates.

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- pnpm package manager
- MongoDB Atlas or local MongoDB
- Stripe API keys
- ImageKit API keys
- Gmail credentials for email notifications (optional)

### Install dependencies
```bash
cd apps/backend
pnpm install
```

### Environment
Create `apps/backend/.env` with the values below:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/coffee_shop
MONGODB_TEST_URI=mongodb://localhost:27017/coffee_shop_test

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ImageKit
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Email
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_specific_password

# Frontend URLs
FRONTEND_URLS=http://localhost:5173

# App settings
NODE_ENV=development
PORT=3000
```

### Start server
```bash
pnpm dev
```

The backend listens on `http://localhost:3000` by default.

## 📦 Project Structure

```
apps/backend/
├── src/
│   ├── app.js
│   ├── router.js
│   ├── db/seed.js
│   ├── middleware/
│   ├── modules/
│   ├── utils/
│   ├── seeders/
│   └── tests/
├── package.json
└── .env
```

## 🔧 Scripts

```bash
pnpm dev          # start local backend
pnpm start        # production start
pnpm test         # run Jest tests
pnpm seed         # seed sample data
```

## 🔐 Auth and Authorization

### JWT authentication
- Access tokens are issued on login/register
- Refresh tokens are stored in httpOnly cookies
- Protected routes require `Authorization: Bearer <token>`

### User roles
- `user` — standard customer
- `manager` — manage products, orders, drink options
- `admin` — full system access

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`

### Users
- `GET /api/user/mine`
- `PUT /api/user/mine`
- `DELETE /api/user/mine`
- `PUT /api/user/mine/changepassword`
- `GET /api/user/favorites`
- `PATCH /api/user/favorites/:id`
- `DELETE /api/user/clear-favorites`

### Products
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Orders
- `POST /api/orders`
- `GET /api/orders/mine`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id`
- `DELETE /api/orders/:id`

### Drink Options
- `GET /api/options`
- `POST /api/options`
- `PUT /api/options`
- `DELETE /api/options/:groupName`
- `DELETE /api/options/:groupName/:itemId`

### Payments
- `POST /api/payment-intent/create`
- `PATCH /api/payment-intent/update`

### Notifications
- `GET /api/notifications`
- `PATCH /api/notifications/:id`
- `DELETE /api/notifications/:id`

### Other
- `POST /api/contact-support`
- `POST /api/survey-form`
- `POST /api/upload/profile-image`

## 📤 Seed data

Load sample data with:
```bash
pnpm seed
```

## 🧪 Testing

Run tests in backend:
```bash
pnpm test
```

## 🔌 Real-time features

Socket.IO is configured in `src/utils/socket.js` and initialized in `server.js` for live order updates and user notifications.

## 📚 Notes

- The backend is a workspace package and relies on shared utilities in `packages/utils`
- Make sure `FRONTEND_URLS` allows your local frontend origin
- Use Stripe test keys until production deployment
