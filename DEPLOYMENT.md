# 🚀 MediaHub — Full Deployment Guide

Deploy **MediaHub** as a production full-stack app:

| Layer | Service | Free Tier? |
|---|---|---|
| **Backend API** | [Render.com](https://render.com) | ✅ Yes |
| **Frontend SPA** | [Vercel.com](https://vercel.com) | ✅ Yes |
| **Database** | [MongoDB Atlas](https://cloud.mongodb.com) | ✅ Yes (512 MB) |
| **Media Storage** | [Cloudinary](https://cloudinary.com) | ✅ Yes (25 GB) |

---

## 🗂️ Table of Contents
1. [Step 0 — Set Up External Services](#step-0--set-up-external-services)
2. [Step 1 — Deploy the Backend on Render](#step-1--deploy-the-backend-on-render)
3. [Step 2 — Deploy the Frontend on Vercel](#step-2--deploy-the-frontend-on-vercel)
4. [Step 3 — Connect Frontend to Backend](#step-3--connect-frontend--backend)
5. [Step 4 — Test in Production](#step-4--test-in-production)
6. [Troubleshooting](#-troubleshooting)
7. [Local Dev Quick Start](#-local-dev-quick-start)

---

## Step 0 — Set Up External Services

### MongoDB Atlas (Database)

1. Go to https://cloud.mongodb.com → **Sign Up / Log In**
2. Click **Build a Cluster** → choose **M0 Free Tier** → pick any region → **Create**
3. Create a **Database User**:
   - Go to **Database Access** → **Add New Database User**
   - Username: `mediahub` | Password: (strong password, save it)
   - Role: **Atlas admin** → **Add User**
4. Allow Network Access:
   - Go to **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
5. Get your **Connection String**:
   - Click **Connect** → **Drivers** → copy the URI
   - Replace `<password>` with your DB user's password
   - Example: `mongodb+srv://mediahub:MyPass123@cluster0.abc123.mongodb.net/mediahub?retryWrites=true&w=majority`

---

### Cloudinary (Image/Video Storage)

1. Go to https://cloudinary.com → **Sign Up for Free**
2. After login, go to your **Dashboard**
3. Copy these three values — you will need them:
   - **Cloud Name** (e.g., `dxyz12abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefGHIJKL-_mnopqr`)

---

### Generate Secure JWT Secrets

Run this in any terminal (Node.js required) to generate two strong secrets:

```bash
node -e "const c=require('crypto'); console.log('ACCESS:', c.randomBytes(32).toString('hex')); console.log('REFRESH:', c.randomBytes(32).toString('hex'))"
```

Save both outputs — you will use them for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`.

---

## Step 1 — Deploy the Backend on Render

1. Go to https://render.com → **Sign Up** (use GitHub) → **New +** → **Web Service**
2. Click **Connect a Repository** → Select `vishu9520/Vishu_Backend`
3. Fill in the settings:

   | Setting | Value |
   |---|---|
   | **Name** | `mediahub-api` |
   | **Root Directory** | `backend` |
   | **Environment** | `Node` |
   | **Branch** | `main` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | `Free` |

4. Scroll to **Environment Variables** and add every row below:

   | Key | Value |
   |---|---|
   | `PORT` | `8080` |
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | *(your Atlas URI from Step 0)* |
   | `CORS_ORIGIN` | *(leave blank for now — fill after Vercel deploy)* |
   | `ACCESS_TOKEN_SECRET` | *(64-char hex from Step 0)* |
   | `ACCESS_TOKEN_EXPIRY` | `1d` |
   | `REFRESH_TOKEN_SECRET` | *(64-char hex from Step 0)* |
   | `REFRESH_TOKEN_EXPIRY` | `10d` |
   | `CLOUDINARY_CLOUD_NAME` | *(your Cloudinary cloud name)* |
   | `CLOUDINARY_API_KEY` | *(your Cloudinary API key)* |
   | `CLOUDINARY_API_SECRET` | *(your Cloudinary API secret)* |

5. Click **Create Web Service**. Wait ~3 minutes for the first deploy.

6. **Verify**: Open `https://mediahub-api.onrender.com/api/v1/health` — you should see:
   ```json
   { "status": "ok", "service": "MediaHub API" }
   ```

> **Copy your Render URL** — you will need it in Step 2 and Step 3.
> Example: `https://mediahub-api.onrender.com`

---

## Step 2 — Deploy the Frontend on Vercel

1. Go to https://vercel.com → **Sign Up** (use GitHub) → **Add New... → Project**
2. Select `vishu9520/Vishu_Backend` from your GitHub repos
3. Configure the project:

   | Setting | Value |
   |---|---|
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `frontend` ← **important, click Edit** |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. Expand **Environment Variables** and add:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://mediahub-api.onrender.com/api/v1` |

5. Click **Deploy**. Wait ~2 minutes.

6. **Verify**: Vercel will give you a URL like `https://vishu-backend.vercel.app`. Open it — MediaHub should load!

---

## Step 3 — Connect Frontend to Backend

After getting your Vercel URL, go back to **Render**:

1. Open your `mediahub-api` web service → **Environment**
2. Update `CORS_ORIGIN`:
   - Key: `CORS_ORIGIN`
   - Value: `https://your-project.vercel.app` *(exact Vercel URL, no trailing slash)*
3. Click **Save Changes** — Render will auto-redeploy in ~1 minute.

---

## Step 4 — Test in Production

Open your Vercel URL and test these flows:

| Test | What to check |
|---|---|
| **Register** | Sign In → Create Account → upload avatar → submit |
| **Login** | Sign in with the account you just created |
| **Session persist** | Refresh the page — should stay logged in |
| **Video player** | Click any video card → modal opens → video plays |
| **Watch history** | Sidebar → History → should show viewed videos |
| **Avatar upload** | Settings → Update Avatar |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Login returns CORS error | Make sure `CORS_ORIGIN` in Render matches your exact Vercel URL |
| Backend returns 500 on register | Check Render logs — usually MongoDB URI is wrong |
| Cookies not saved (refresh logs out) | Backend must be HTTPS (Render free tier is HTTPS by default) |
| Vercel shows blank page | Make sure Root Directory is set to `frontend` in Vercel settings |
| Render free tier sleeps | Render free tier sleeps after 15 min inactivity — first request takes ~30s |

---

## Local Dev Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/vishu9520/Vishu_Backend.git
cd Vishu_Backend

# 2. Setup backend
cd backend
cp .env.sample .env
# Edit .env and fill in your real values
npm install
npm run dev        # Runs on http://localhost:8080

# 3. Setup frontend (new terminal)
cd frontend
cp .env.sample .env
# Leave VITE_API_URL blank (Vite proxy handles it)
npm install
npm run dev        # Runs on http://localhost:5173
```

---

## Project Structure

```
Vishu_Backend/
├── backend/               <- Node.js + Express + MongoDB
│   ├── src/
│   │   ├── app.js         <- Express app, CORS, middleware
│   │   ├── index.js       <- MongoDB connect + server start
│   │   ├── controllers/   <- Business logic (register, login...)
│   │   ├── models/        <- Mongoose schemas
│   │   ├── routes/        <- API route definitions
│   │   ├── middlewares/   <- Auth guard, Multer upload
│   │   └── utils/         <- Cloudinary, ApiError, ApiResponse
│   └── package.json
│
├── frontend/              <- React + Vite SPA
│   ├── src/
│   │   ├── App.jsx        <- Root layout + routing
│   │   ├── components/    <- Navbar, Sidebar, VideoCard, Player...
│   │   ├── services/api.js<- Axios + auto-refresh interceptor
│   │   └── data/          <- Mock video data
│   ├── vercel.json        <- SPA rewrites (required for Vercel)
│   └── vite.config.js     <- Dev proxy to backend:8080
│
├── render.yaml            <- Render Blueprint (auto-config)
└── DEPLOYMENT.md          <- This file
```
