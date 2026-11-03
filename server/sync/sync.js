import { login, getCourses, getAssignments } from "../api/api.js";
import { fetchAllUsers } from "../db/fetchFromDatabase.js";
import { saveAssignment, saveCourse, recordAuthFailure, resetAuthFailure } from "../db/saveToDatabase.js";
import { parseAssignments, parseCourses, parseUsers } from "../services/parser.js";
import { config } from "dotenv";

config();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function allUsersSync() {
    console.log("Starting synchronization...");

    const rawUsers = await fetchAllUsers();
    const users = parseUsers(rawUsers);

    for (const user of users) {
        try {
            await singleUserSync(user);
        } catch (err) {
            console.error(`Sync failed for ${user.email}:`, err.message);
        }
        // Inter-user delay to prevent bursting upstream VOLP WAF
        await delay(500 + Math.floor(Math.random() * 500));
    }
    console.log("Synchronization complete.");
}

export async function singleUserSync(user, existingAuth = null) {
    console.log(`Syncing User: ${user.firstName} ${user.lastName}`);

    const auth = existingAuth || await login(user.email, user.password);
    if (!auth || auth.status !== 200) {
        if (user.id) {
            await recordAuthFailure(user.id, `VOLP authentication failed with status ${auth?.status || 'network_error'}`);
        }
        throw new Error(`VOLP authentication failed for ${user.email}`);
    }

    if (user.id) {
        await resetAuthFailure(user.id);
    }

    await courseSync(auth, user.id);
    console.log(`${user.firstName} ${user.lastName} synchronization complete.`);
}

export async function courseSync(auth, userId) {
    let rawCourses = [];
    try {
        rawCourses = await getCourses(auth);
    } catch (err) {
        console.error(`Failed to fetch course list for user_id ${userId}:`, err.message);
        return;
    }

    const courses = parseCourses(rawCourses, userId);

    for (const course of courses) {
        try {
            console.log(`Syncing course: ${course.name}`);
            await saveCourse(course);

            // Gentle delay between courses to prevent rate limiting
            await delay(300 + Math.floor(Math.random() * 300));
            await assignmentSync(course, auth, userId);
        } catch (err) {
            console.error(`Skipping course ${course.name} due to error:`, err.message);
        }
    }
}

export async function assignmentSync(course, auth, userId) {
    let rawAssignments = [];
    try {
        rawAssignments = await getAssignments(course, auth);
    } catch (err) {
        console.error(`Failed to fetch assignments for course ${course.name}:`, err.message);
        return;
    }

    const assignments = parseAssignments(rawAssignments, course.courseId, userId);

    for (const assignment of assignments) {
        try {
            await saveAssignment(assignment);
        } catch (err) {
            console.error(`Failed to save assignment ${assignment.assignmentId}:`, err.message);
        }
    }
}
