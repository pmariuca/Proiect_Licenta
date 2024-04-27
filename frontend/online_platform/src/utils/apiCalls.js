import {useSelector} from "react-redux";
import {testSlice} from "../store/slices/testSlice";

export async function logUser(userData) {
    try {
        const { username, password } = userData;
        const response = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, pass: password}),
        });

        const responseJSON = await response.json();

        if(responseJSON.success) {
            localStorage.setItem('token', responseJSON.data.token);
        }

        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function verifyToken(token) {
    try {
        const url = new URL('http://localhost:3001/auth/checkToken');
        url.searchParams.append('token', token);
        const response = await fetch(url);

        return {status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function retrieveUserData(token) {
    try {
        const response = await fetch('http://localhost:3001/auth/checkLoggedIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token}),
        });

        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function getCoursesStudents(username) {
    try {
        const url = new URL('http://localhost:3001/courses/getCoursesStudents');
        url.searchParams.append('username', username);
        const response = await fetch(url);

        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function getCoursesProfessors(username) {
    try {
        const url = new URL('http://localhost:3001/courses/getCoursesProfessors');
        url.searchParams.append('username', username);
        const response = await fetch(url);

        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function getSpecificCourse(id) {
    try {
        const url = new URL('http://localhost:3001/courses/getSpecificCourse');
        url.searchParams.append('id', id);
        const response = await fetch(url);

        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function getActivities(weekData) {
    try {
        const { week, course, type } = weekData;

        const url = new URL('http://localhost:3001/activities/getWeekActivities');
        url.searchParams.append('weekStart', week.start);
        url.searchParams.append('weekEnd', week.end);
        url.searchParams.append('course', course);
        url.searchParams.append('type', type);

        const response = await fetch(url);
        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function addActivity(activityDetails) {
    try {
        const response = await fetch('http://localhost:3001/activities/addActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({activityDetails}),
        });

        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function getActivityDetials(activityID) {
    try {
        const url = new URL('http://localhost:3001/activities/getActivityDetails');
        url.searchParams.append('activityID', activityID);

        const response = await fetch(url);
        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function getQuestions(numberOfQuestions) {
    try {
        const url = new URL('http://localhost:3001/questions/getQuestions');
        url.searchParams.append('numberOfQuestions', numberOfQuestions);

        const response = await fetch(url);
        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function submitAnswers(username, activityID, answers, fraudAttempts) {
    try {
        const response = await fetch('http://localhost:3001/questions/submitAnswers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, activityID, answers, fraudAttempts}),
        });

        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function checkSubmission(username, activityID) {
    try {
        const url = new URL('http://localhost:3001/activities/checkSubmission');
        url.searchParams.append('username', username);
        url.searchParams.append('activityID', activityID);

        const response = await fetch(url);

        if(response.status === 200) {
            return false;
        } else if(response.status === 302) {
            return true;
        }
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function checkIdentity(username, image) {
    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('image', image, 'image.jpeg');

        const response = await fetch('http://127.0.0.1:5000/authenticate/verifyIdentity', {
            method: 'POST',
            body: formData
        });

        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function startMonitor(username, time, activity, activityID) {
    try {
        const response = await fetch('http://localhost:8080/startMonitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, time, activity, activityID}),
        });

        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function closeMonitorApp() {
    try {
        const response = await fetch('http://localhost:8080/stopMonitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify('Stop the app.'),
        });

        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function getNoOfSubmits(activityID) {
    try {
        const url = new URL('http://localhost:3001/exams/getNoOfSubmits');
        url.searchParams.append('activityID', activityID);

        const response = await fetch(url);
        const responseJSON = await response.json();
        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}

export async function getScreenshots(activityID) {
    try {
        const url = new URL('http://localhost:3001/exams/getScreenshots');
        url.searchParams.append('activityID', activityID);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/zip')) {
            const blob = await response.blob();

            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${activityID}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);

            return { status: 200 }
        } else {
            const responseJSON = await response.json();
            return { responseJSON, status: response.status };
        }
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}