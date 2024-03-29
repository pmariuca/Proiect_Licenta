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