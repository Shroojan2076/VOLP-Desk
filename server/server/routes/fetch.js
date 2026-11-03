import express from "express";
import jwt from "jsonwebtoken";
import { fetchCourses, fetchAssignments, fetchUser } from "../../db/fetchFromDatabase.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "volp-default-session-secret-key-prod";

function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Authentication token is required."
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Forbidden: Invalid or expired authentication token."
        });
    }
}

router.get("/courses", authenticateUser, async (req, res) => {
    try {
        const userEmail = req.query.email;

        // IDOR protection: ensure the authenticated user can only view their own courses
        if (userEmail && userEmail.toLowerCase() !== req.user.email.toLowerCase()) {
            return res.status(403).json({
                success: false,
                message: "Access forbidden: you cannot access another student's courses."
            });
        }

        const courses = await fetchCourses(req.user.id);
        res.status(200).json({ 
            success: true, 
            courses 
        });
    } catch (error) {
        console.error("Failed to fetch courses: ", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch courses."
        });
    }
});

router.get("/assignments", authenticateUser, async (req, res) => {
    try {
        const userEmail = req.query.email;
        const userCourseId = req.query.courseId;

        // IDOR protection: ensure the authenticated user can only view their own assignments
        if (userEmail && userEmail.toLowerCase() !== req.user.email.toLowerCase()) {
            return res.status(403).json({
                success: false,
                message: "Access forbidden: you cannot access another student's assignments."
            });
        }

        const assignments = await fetchAssignments(req.user.id, userCourseId);
        res.status(200).json({ 
            success: true, 
            assignments 
        });
    } catch (error) {
        console.error("Failed to fetch assignments: ", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch assignments."
        });
    }
});

export default router;
