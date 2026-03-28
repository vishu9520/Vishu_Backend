import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))
app.use(cookieParser());

app.use((err, req, res, next) => {
  console.log("ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    errors: err.errors || []
  });
});

//routes import
import userRouter from './routes/user.routes.js'


//routes decalration
app.use("/api/v1/users",userRouter)

// https://localhost:8080/api/v1/users/register
export{ app }