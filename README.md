# Blog Backend API

## Overview

This project is a modular blog backend built with Express, TypeScript, Prisma, and PostgreSQL. It provides a comprehensive RESTful API for authentication, user profiles, blog posts, comments, and admin reporting. It also includes Stripe integration for premium subscriptions.

## Features

- **User Authentication:** Registration, login, JWT-based access and refresh tokens (stored securely in HTTP-only cookies).
- **Role-based Access Control:** Supports `USER` and `ADMIN` roles.
- **User Profiles:** Manage user profiles with avatars and bio.
- **Blog Posts:**
  - Create, read, update, and delete posts.
  - Features pagination, advanced filtering (by tags, search, status, etc.), and view count tracking.
- **Comments System:**
  - Users can comment on posts.
  - Ownership rules (only authors can edit/delete their comments).
  - Admin moderation (approve/reject comments).
- **Subscriptions / Premium:** Stripe integration for recurring payments and premium content handling.

## Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Web Framework:** Express 5
- **ORM:** Prisma 7.x (with `@prisma/adapter-pg`)
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens) & bcrypt for password hashing
- **Payments:** Stripe (via webhook integration)

## Project Structure

```text
src/
├── config/         # Environment variables and configurations
├── lib/            # External libraries setup (e.g., Prisma client, Stripe)
├── middlewares/    # Express middlewares (auth, error handling, validation)
├── modules/        # Modular domain-driven features
│   ├── auth/           # Authentication APIs
│   ├── users/          # User & Profile APIs
│   ├── posts/          # Blog Post APIs
│   ├── comments/       # Comment APIs
│   ├── subscription/   # Stripe Subscription & Webhooks APIs
│   └── premium/        # Premium content features
├── utils/          # Helper utilities and response wrappers
├── app.ts          # Express application setup
└── server.ts       # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database
- Stripe Account (for local webhook testing)

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Configure environment variables. Create a `.env` file based on `.env.example`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/prisma_press"
PORT=8000
APP_URL="http://localhost:3000"
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_ACCESS_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"
```

3. Setup the database and generate the Prisma Client:

```bash
npx prisma generate
npx prisma db push
```

### Running the Application

**Development Mode:**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
npm start
```

**Stripe Webhook Listener (Local Development):**
To forward Stripe events to your local server:

```bash
npm run stripe:webhook
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Authenticate user and get tokens.
- `POST /api/auth/refresh-token` - Refresh access token via cookie.

### Users

- `POST /api/users/register` - Register a new user.
- `GET /api/users/me` - Get logged-in user's profile.
- `PUT /api/users/my-profile` - Update logged-in user's profile.

### Posts

- `GET /api/posts` - List posts (supports search, tags, pagination, etc.).
- `GET /api/posts/:postId` - Get a single post and increment view count.
- `POST /api/posts` - Create a new post.
- `PATCH /api/posts/:postId` - Update a post.
- `DELETE /api/posts/:postId` - Delete a post.
- `GET /api/posts/stats` - (Admin only) Get aggregate post/user stats.
- `GET /api/posts/my-posts` - Get posts created by the logged-in user.

### Comments

- `GET /api/comments/author/:authorId` - List comments by a specific author.
- `GET /api/comments/:commentId` - Get a single comment.
- `POST /api/comments` - Add a comment to a post.
- `PATCH /api/comments/:commentId` - Update an existing comment.
- `DELETE /api/comments/:commentId` - Delete a comment.
- `PATCH /api/comments/:commentId/moderate` - (Admin only) Change comment status.

## Data Models (Summary)

- **User:** Manages authentication details and roles.
- **Profile:** Stores user bio and avatar.
- **Post:** Contains blog content, tags, views, and publication status.
- **Comment:** User responses linked to specific posts.
- **Subscription:** Manages Stripe subscription details and status.

## Error Handling & Responses

The API uses standardized JSON responses for successes and errors.

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

Errors return meaningful HTTP status codes with clear error messages. Global error handlers ensure unhandled errors do not crash the application.
