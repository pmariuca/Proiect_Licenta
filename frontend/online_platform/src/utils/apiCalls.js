import {Navigate} from "react-router-dom";

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
            localStorage.setItem('token', responseJSON.data);
        }

        return {responseJSON, status: response.status};
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
}