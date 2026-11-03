import express from "express";
import rateLimit from "express-rate-limit";
import reSyncRouter from "./routes/resync.js";
import authRouter from "./routes/auth.js";
import fetchRouter from "./routes/fetch.js";
import NotifyRouter from "./routes/notify.js";
import pool from "../db/database.js";
import { config } from "dotenv";
import cors from "cors";

config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Health check endpoint (exempt from rate limiting)
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "online",
        host: req.get("host") || "localhost",
        timestamp: new Date().toISOString()
    });
});

// Strict rate limit on authentication endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25, // limit each IP to 25 auth requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again after 15 minutes."
    }
});

// General rate limiter on student coursework endpoints
const fetchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 150, // limit each IP to 150 fetch requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please slow down."
    }
});

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/fetch", fetchLimiter, fetchRouter);
app.use("/api/resync", reSyncRouter);
app.use("/api/notify", NotifyRouter);

const server = app.listen(port, () => {
    console.log(`Server is running at port ${port}.`);
    console.log(`Web app available at http://localhost:${port}.`);
});

// Graceful process shutdown on Render restart or termination signals
const gracefulShutdown = (signal) => {
    console.log(`[Lifecycle] Received ${signal}. Draining connections...`);
    server.close(async () => {
        try {
            await pool.end();
            console.log('[Lifecycle] PostgreSQL pool ended cleanly. Exiting.');
            process.exit(0);
        } catch (err) {
            console.error('[Lifecycle] Error closing pool:', err.message);
            process.exit(1);
        }
    });

    setTimeout(() => {
        console.error('[Lifecycle] Shutdown timed out after 10s. Forcing exit.');
        process.exit(1);
    }, 10000).unref();
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
