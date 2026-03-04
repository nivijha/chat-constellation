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

app.use(helmet()); 
app.use(express.json());
app.use(mongoSanitize()); 

// Dynamic CORS for production and local development
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'https://chat-constellation.vercel.app'
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl) 
        // or if origin is in the allowed list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

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

