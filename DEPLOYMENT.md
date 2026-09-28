# 🚀 MediaHub Deployment Guide (Production Walkthrough)

This guide covers deploying the **MediaHub** full-stack application:
- **Backend API**: Deployed on [Render](https://render.com) or [Railway](https://railway.app).
- **Frontend SPA**: Deployed on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
- **Database & Media Storage**: MongoDB Atlas + Cloudinary.

---

## 📋 Pre-Deployment Checklist

Before you begin, ensure you have:
1. A **GitHub repository** containing this project.
2. A **MongoDB Atlas** cluster with a connection string.
3. A **Cloudinary** account with Cloud Name, API Key, and API Secret.
4. Secure random 64-character strings for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.

---

## 1. ⚙️ Deploying the Backend (Render.com)

### Step 1: Create a New Web Service on Render
1. Sign in to [Render](https://render.com) and click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `mediahub-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node -r dotenv/config src/index.js`)

### Step 2: Configure Backend Environment Variables
In the Render dashboard under **Environment**, add the following environment variables:

| Variable | Value / Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port for the backend service | `8080` (or leave default for Render to assign) |
| `NODE_ENV` | Environment mode | `production` |
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://<user>:<password>@cluster.mongodb.net` |
| `CORS_ORIGIN` | Your production frontend URL (no trailing slash) | `https://your-mediahub.vercel.app` |
| `ACCESS_TOKEN_SECRET` | 64+ char secret string | `Generate with: crypto.randomBytes(32).toString('hex')` |
| `ACCESS_TOKEN_EXPIRY` | Access token lifespan | `1d` |
| `REFRESH_TOKEN_SECRET` | 64+ char secret string | `Generate with: crypto.randomBytes(32).toString('hex')` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifespan | `10d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | Your Cloud Name |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Your API Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Your API Secret |

> 💡 **Important for Cookies & CORS:** In `production`, cookies are configured with `SameSite: None` and `Secure: true` so cross-site cookies between the Vercel frontend and Render backend work seamlessly over HTTPS.

---

## 2. 🎨 Deploying the Frontend (Vercel)

### Step 1: Import Project to Vercel
1. Sign in to [Vercel](https://vercel.com) and click **Add New...** > **Project**.
2. Select your GitHub repository.
3. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`frontend`**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Add Frontend Environment Variables
In the Vercel project configuration, add:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://mediahub-api.onrender.com/api/v1` | URL of your deployed Render backend (with `/api/v1`) |

### Step 3: Verify Single Page App (SPA) Routing
A `frontend/vercel.json` file is already included in your project:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures refreshing any client-side route redirects smoothly to `index.html`.

---

## 3. 🧪 Testing After Deployment

1. **Test Registration & Cloudinary Upload**:
   - Open your deployed Vercel frontend.
   - Click **Sign In** -> **Create an Account**.
   - Upload an avatar photo and fill in your details.
   - Click **Create Account**. Your avatar will be uploaded to Cloudinary, user saved in MongoDB, and you will be automatically logged in.
2. **Test Session Persistence**:
   - Refresh the page to confirm that the `mediahub_access_token` and `refreshToken` cookie preserve your active session.
3. **Test Video Player & History**:
   - Click on any video card to launch the cinema player modal.
   - Confirm playback, comments, and watch history tracking.

---

## 🛠️ Summary of Scripts (Root `package.json`)

To run both services locally in development:
```bash
# Run backend (port 8080)
npm run backend

# Run frontend (port 5173 with proxy to 8080)
npm run frontend

# Build frontend production bundle
npm run build:frontend
```
