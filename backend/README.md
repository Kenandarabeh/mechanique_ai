# 🔧 Mechanic AI - Backend API

Backend Express.js server for Mechanic AI chatbot application.

## 📋 Features

- ✅ **Express.js** with TypeScript
- ✅ **Prisma ORM** with SQLite (dev) / PostgreSQL (prod)
- ✅ **JWT Authentication**
- ✅ **Google Gemini AI** integration
- ✅ **Streaming responses**
- ✅ **Rate limiting**
- ✅ **CORS support**
- ✅ **Error handling**

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm run init
```

This command will:
- Install all npm packages
- Generate Prisma client
- Create database schema

### 2. Configure Environment

The `.env` file is already created with default values. Update if needed:

```bash
nano .env
```

Important variables:
- `DATABASE_URL` - SQLite by default
- `JWT_SECRET` - Change in production!
- `GOOGLE_GENERATIVE_AI_API_KEY` - Your Gemini API key
- `CLERK_SECRET_KEY` - Your Clerk secret key

### 3. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.ts      # Main config
│   │   ├── database.ts   # Prisma setup
│   │   └── gemini.ts     # AI configuration
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── chat.controller.ts
│   │   └── chats.controller.ts
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # JWT verification
│   │   ├── cors.ts       # CORS config
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   ├── routes/           # API routes
│   │   ├── auth.routes.ts
│   │   ├── chat.routes.ts
│   │   └── chats.routes.ts
│   └── server.ts         # Main server file
├── prisma/
│   └── schema.prisma     # Database schema
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## 🔌 API Endpoints

### Authentication

#### Generate JWT Token
```http
POST /api/auth/token
Content-Type: application/json

{
  "userId": "clerk_user_id",
  "email": "user@example.com"
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### Chat

#### Send Message (Streaming)
```http
POST /api/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "سيارتي لا تشتغل" }
  ],
  "chatId": "optional-chat-id"
}
```

Response: Server-Sent Events stream
Header: `X-Chat-Id` (for new chats)

### Chats

#### Get All Chats
```http
GET /api/chats
Authorization: Bearer <token>
```

#### Get Specific Chat
```http
GET /api/chats/:id
Authorization: Bearer <token>
```

#### Delete Chat
```http
DELETE /api/chats/:id
Authorization: Bearer <token>
```

## 🗄️ Database

### SQLite (Development)

Default configuration. Database file: `backend/prisma/dev.db`

**View database:**
```bash
npm run db:studio
```

### PostgreSQL (Production)

Update `.env`:
```env
DATABASE_PROVIDER="postgresql"
DATABASE_URL="postgresql://user:password@host:5432/database"
```

Then:
```bash
npm run db:push
```

## 📜 Available Scripts

```bash
# Initialize project (install + setup database)
npm run init

# Development server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:push        # Push schema to database
npm run db:studio      # Open Prisma Studio
npm run db:migrate     # Create migration
npm run db:generate    # Generate Prisma client
npm run db:reset       # Reset database

# Code quality
npm run lint           # Run ESLint
npm run format         # Format with Prettier
```

## 🔧 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Server port |
| `NODE_ENV` | No | development | Environment |
| `DATABASE_PROVIDER` | Yes | sqlite | Database type |
| `DATABASE_URL` | Yes | file:./dev.db | Database connection |
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `JWT_EXPIRES_IN` | No | 7d | JWT expiration |
| `CLERK_SECRET_KEY` | Yes | - | Clerk authentication |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | - | Gemini AI key |
| `CORS_ORIGINS` | No | localhost:3000 | Allowed origins |

## 🔐 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin protection
- **Rate Limiting** - Prevent abuse
- **JWT** - Secure authentication
- **Input Validation** - Request validation

## 📊 Rate Limits

- **General API**: 100 requests / 15 minutes
- **Chat endpoint**: 10 requests / minute

## 🚀 Deployment

### Deploy to Railway.app

1. Create account on [Railway.app](https://railway.app)
2. Create new project
3. Connect this repository
4. Add environment variables
5. Deploy!

### Deploy to Render.com

1. Create account on [Render.com](https://render.com)
2. Create new Web Service
3. Connect repository
4. Set build command: `cd backend && npm install && npm run build`
5. Set start command: `cd backend && npm start`
6. Add environment variables
7. Deploy!

## 🐛 Troubleshooting

### Database not found
```bash
cd backend
npm run db:push
```

### Port already in use
Change `PORT` in `.env` to another port (e.g., 5001)

### Gemini AI errors
Check your `GOOGLE_GENERATIVE_AI_API_KEY` is valid

### CORS errors
Add your frontend URL to `CORS_ORIGINS` in `.env`

## 📝 License

MIT
