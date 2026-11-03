import axios from "axios";
import { config } from "dotenv";

config();

const volpClient = axios.create({
    timeout: 15000, // 15s timeout to prevent hanging connections
    headers: {
        "Accept": "application/json, text/plain, */*",
        "Device": "Web",
        "Organization-Code": "null",
        "Origin": "https://classroom.volp.in",
        "Referer": "https://classroom.volp.in/"
    }
});

export async function login(email, password) {
    const loginResponse = await volpClient.post(
        "https://admin.volp.in/login/process",
        {
            username: email,
            pwd: password,
        },
        {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Router-Path": "/login"
            }
        });
        
    console.log("Login Status: ", loginResponse.status);

    const { token, uid, ut, flag } = loginResponse.data || {};

    if ((!token || !uid || !ut || flag === "NO")) {
        console.log("Invalid college email or password");
        return  { token, uid, ut, status: 401 };
    }

    return  { token, uid, ut, status: 200 };
}

export async function getCourses(auth) {
    const coursesResponse = await volpClient.post(
        "https://learner.volp.in/learnerCourseDashboard/learnerCourseList",
        null,
        {
            headers: {
                "Router-Path": "/learner/my-courses",
                "token": auth.token,
                "uid": auth.uid,
                "ut": auth.ut
            }
        }); 

    console.log("Courses Fetch Status: ", coursesResponse.status);
    const data = coursesResponse.data?.col_list;

    return Array.isArray(data) ? data : [];
}

export async function getAssignments(course, auth) {
    const response = await volpClient.post(
        "https://learner.volp.in/SubjectiveAssignment/getSubjectiveAssignment_new",
        {
            course_offering_learner_id: course.courseOfferingLearnerId,
            courseId: course.courseId,
            type: "content",
        },
        {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Router-Path": "/learner-subjective-assignment",
                "token": auth.token,
                "uid": auth.uid,
                "ut": auth.ut,
            }
        }
    );

    console.log("Assignment Fetch Status: ", response.status);
    const data = response.data?.question_list;

    return Array.isArray(data) ? data : [];
}
