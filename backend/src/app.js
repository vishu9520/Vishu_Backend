import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"

const app = express()

// CORS configuration supporting credentials
const envOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : []

const allowedOrigins = [
    ...envOrigins,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173"
].filter(Boolean)

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(null, true) // dev friendly fallback
    },
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// Health check (used by Render to verify the service is up)
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "MediaHub API", timestamp: new Date().toISOString() })
})

// Routes declaration
app.use("/api/v1/users", userRouter)

// Global Error Handler Middleware (MUST be declared after routes)
app.use((err, req, res, next) => {
    console.error("ERROR HANDLER:", err)

    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"

    return res.status(statusCode).json({
        statusCode,
        data: null,
        success: false,
        message,
        errors: err.errors || []
    })
})

export { app }