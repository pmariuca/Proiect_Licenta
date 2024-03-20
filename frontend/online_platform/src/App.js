import './assets/App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Homepage from "./pages/Homepage";
import {useEffect, useState} from "react";
import {retrieveUserData, verifyToken} from "./utils/apiCalls";
import {useDispatch} from "react-redux";
import {populateGlobalSlice} from "./utils/functions";


function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if(token) {
            setIsLoading(true);
            verifyToken(token).then(response => {
                if(response.status === 200) {
                    setLoggedIn(true);

                retrieveUserData(token).then(response => {
                    if(response.status === 200) {
                        const {username, name, surname} = response.responseJSON.data;

                        const userData = {
                            username,
                            name,
                            surname,
                            token,
                            dispatch
                        };
                        populateGlobalSlice(userData, dispatch);
                    }
                })
                } else {
                    setLoggedIn(false);
                }
            });

            setIsLoading(false);
        }
    }, [loggedIn]);

    if (isLoading) {
        return <div></div>;
    }

    const handleLogoutToken = () => {
        setLoggedIn(false);
    };

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Homepage logoutFunction={handleLogoutToken}/>} />
                <Route path='/login' element={loggedIn ? <Navigate to={'/'}/> : <Login/>} />
            </Routes>
        </Router>
    );
}

export default App;
