# Deployment

## Render (backend)

Set the Render service root directory to `backend` and use `npm start`.
Configure these environment variables in Render:

```env
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=a-long-random-secret
CLIENT_ORIGIN=https://your-vercel-project.vercel.app
```

`CLIENT_ORIGIN` supports comma-separated values for preview or custom domains.

## Vercel (frontend)

Set the Vercel project root directory to `frontend`. Add this environment variable, then redeploy:

```env
VITE_API_URL=https://your-render-service.onrender.com
```

Use the Render origin only; do not append `/api`. The frontend automatically requests `/api` on that service.
