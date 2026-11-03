import express from "express";
import jwt from "jsonwebtoken";
import { login } from "../../api/api.js";
import { saveUser } from "../../db/saveToDatabase.js";
import { fetchCourses, fetchAssignments, fetchUser } from "../../db/fetchFromDatabase.js";
import { singleUserSync } from "../../sync/sync.js";
import pool from "../../db/database.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "volp-default-session-secret-key-prod";

export function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "30d" }
    );
}

router.post("/register", async (req, res) => {
    try {
        const user = req.body.user;

        if (!user?.email || !user?.password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const existingUsers = await fetchUser(user.email);

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User already registered. Please login."
            });
        }

        const auth = await login(user.email, user.password);

        if (auth.status === 200) {
            const saveduser = await saveUser(user);
            user.id = saveduser.id;

            // Synchronize coursework; if initial sync fails, roll back the newly saved user record
            try {
                await singleUserSync(user, auth);
            } catch (syncErr) {
                console.error("Initial coursework sync failed during registration. Rolling back user record:", syncErr.message);
                await pool.query("DELETE FROM users WHERE id = $1", [saveduser.id]);
                return res.status(502).json({
                    success: false,
                    message: `Registration aborted: failed to synchronize coursework from VOLP (${syncErr.message}). Please try again.`
                });
            }

            const userCourses = await fetchCourses(saveduser.id);
            const userAssignments = await fetchAssignments(saveduser.id);
            const token = generateToken(saveduser);

            return res.status(201).json({
                success: true,
                message: "User registered successfully.",
                user: {
                    id: saveduser.id,
                    email: saveduser.email,
                    firstName: saveduser.first_name,
                    lastName: saveduser.last_name,
                    token
                },
                courses: userCourses,
                assignments: userAssignments
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Failed to register user, invalid credentials."
            });
        }
    } catch (err) {
        console.error("Register error: ", err);
        return res.status(400).json({
            success: false,
            message: "Internal server error during registration."
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = req.body.user;

        if (!user.email || !user.password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const existingUsers = await fetchUser(user.email);

        if (existingUsers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please register."
            });
        }

        const dbUser = existingUsers[0];

        if (dbUser.password_hash === user.password) {
            const userCourses = await fetchCourses(dbUser.id);
            const userAssignments = await fetchAssignments(dbUser.id);
            const token = generateToken(dbUser);

            return res.status(200).json({
                success: true,
                message: "Login successful.",
                user: {
                    id: dbUser.id,
                    email: dbUser.email,
                    firstName: dbUser.first_name,
                    lastName: dbUser.last_name,
                    token
                },
                courses: userCourses,
                assignments: userAssignments
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid password."
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during login."
        });
    }
});

export default router;
