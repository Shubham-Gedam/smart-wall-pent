# Auth Service

A small Node.js auth microservice for user registration, login, and JWT-based authentication.

## Scripts

- `npm start` - starts the server
- `npm run dev` - starts with nodemon

## Environment

Create a `.env` file with:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/paint_visualizer_auth
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
```
