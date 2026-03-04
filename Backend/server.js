import express from 'express';
import "dotenv/config";
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js"
import authRoutes from "./routes/auth.js"

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Request Logging for Debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

// 2. Robust CORS Configuration
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174',
    'http://localhost:3000',
    'https://chat-constellation.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log("CORS Blocked Origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    optionsSuccessStatus: 200
}));

// CORS is already handled globally by app.use(cors(...)) above.
// No need for app.options('*') which can cause PathErrors in newer Express versions.

// 3. Security Headers
app.use(helmet({
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
})); 

app.use(express.json());
// app.use(mongoSanitize()); // Removed due to incompatibility with Express 5

// 4. Routes - ORDER MATTERS
app.get("/", (req, res) => res.json({ status: "API is running" })); // Health check
app.use("/api/auth", authRoutes); // Auth first
app.use("/api", chatRoutes); // Then generic api/chat

// 5. Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);
    res.status(err.status || 500).json({
        error: "Internal Server Error",
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
    connectionDB();
})

const connectionDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with DB");
    } catch(err){
        console.log("Failed to connect with DB", err);
    }
}

