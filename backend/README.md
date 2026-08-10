# CareerPath Backend

Express API for CareerPath. It uses MongoDB and seeds the demo accounts automatically when it starts.

## Prerequisites

- Node.js 18 or newer
- A MongoDB Atlas database (or a local MongoDB instance)

## Setup and run

```bash
cd backend
npm install
```

Create `backend/.env` from `.env.example`, then add your MongoDB connection string:

```env
API_PORT=5050
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
```

`CLIENT_ORIGIN` can contain multiple comma-separated frontend origins (for example, your local Vite URL and deployed frontend URL).

Start the development server:

```bash
npm run dev
```

The API is available at `http://localhost:5050`. Check that it is running at `GET /api/health`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the API with file watching. |
| `npm start` | Start the API normally. |
| `npm run seed` | Run the demo data seed script. |

On startup, the API connects to MongoDB and creates missing demo accounts and mentor data. The demo credentials are listed in the project [README](../README.md#demo-accounts).
