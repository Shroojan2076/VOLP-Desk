import { parseVOLPDateTime } from './date.js';

export function parseAssignments(assignments, crsId, userId) {
    if (!Array.isArray(assignments)) {
        console.warn(`parseAssignments: Expected array but received ${typeof assignments} for course ${crsId}, user ${userId}`);
        return [];
    }

    const data = assignments.map(item => ({
        userId: userId,
        assignmentId: item.ass_id,
        courseId: crsId,
        marks: Number(item.weightage),
        submitted: Boolean(item.issubmitted),
        question: item.question,
        dueDate: parseVOLPDateTime(item.due_date),
        graceDate: parseVOLPDateTime(item.grace_date),
        graded: Boolean(item.graded),
        evaluated: Boolean(item.isevaluated),
        score: item.obtained_marks != null ? Number(item.obtained_marks) : null,
        submissionFile: item.submitted_answer_file_name ?? null,
        submissionPath: item.submitted_answer_file_path ?? null,
    }));

    console.log(`Found ${data.length} assignments.`);
    
    return data;
}

export function parseCourses(courses, userId) {
    if (!Array.isArray(courses)) {
        console.warn(`parseCourses: Expected array but received ${typeof courses} for user ${userId}`);
        return [];
    }

    const data = courses.map(item => ({
        userId: userId,
        courseId: item.crsid,
        courseOfferingLearnerId: item.colid,
        code: item.code,
        name: item.course?.course_name ?? item.code,
        description: item.description,
        professor: item.inst,
        lastSeen: item.lastseen,
        progress: Number(item.progress || 0),
        active: Boolean(item.course_status),
        allowAssessment: Boolean(item.allow_assessment),
        archived: Boolean(item.is_archived)
    }));

    console.log(`Found ${data.length} courses.`);
    
    return data;
}

export function parseUsers(users) {
    if (!Array.isArray(users)) {
        console.warn(`parseUsers: Expected array but received ${typeof users}`);
        return [];
    }

    const data = users.map(item => ({
        id: item.id,
        email: item.email,
        password: item.password_hash,
        firstName: item.first_name ?? null, 
        lastName: item.last_name ?? null,  
        isActive: Boolean(item.is_active),
        createdAt: item.created_at,
        updatedAt: item.updated_at
    }));

    console.log(`Found ${data.length} users.`);

    return data;
}
