Backend (Express + JWT)

Setup

```bash
cd backend
npm install
```

Run

```bash
npm run dev
# or
npm start
```

Environment

Create a .env file:

```
JWT_SECRET=replace-with-a-strong-secret
PORT=4000
```

API

- POST /api/auth/login { username }
- GET /api/users/me Authorization: Bearer <token>
- GET /api/tracks



