import './assets/App.css';
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import Login from './pages/Login';
import Homepage from "./pages/Homepage";
import {useEffect, useState} from "react";
import {retrieveUserData, verifyToken} from "./utils/apiCalls";
import {useDispatch} from "react-redux";
import {populateGlobalSlice} from "./utils/functions";
import CoursePage from "./pages/CoursePage";
import AddActivityPage from "./pages/AddActivityPage";
import TestPage from "./pages/TestPage";
import Authenticate from "./pages/Authenticate";
import QuestionPage from "./pages/QuestionPage";
import ClosedTestPage from "./pages/ClosedTestPage";
import ResultsPage from "./pages/ResultsPage";


function App() {
    const [loggedIn, setLoggedIn] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if(token) {
            setIsLoading(true);
            verifyToken(token).then(response => {
                if(response?.status === 200) {
                    setLoggedIn(true);

                retrieveUserData(token).then(response => {
                    if(response?.status === 200) {
                        const {username, name, surname} = response?.responseJSON?.data;

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
                <Route path='/course/:id' element={<CoursePage logoutFunction={handleLogoutToken} />}/>
                <Route path='/add-activity' element={<AddActivityPage logoutFunction={handleLogoutToken}/>} />
                <Route path={'/test/:id'} element={<TestPage logoutFunction={handleLogoutToken}/>} />
                <Route path={'/test/results/:id'} element={<ResultsPage logoutFunction={handleLogoutToken}/>}/>
                <Route path={'/test/:id/:currentQuestion'} element={<QuestionPage logoutFunction={handleLogoutToken}/>} />
                <Route path={'/test/:id/end'} element={<ClosedTestPage logoutFunction={handleLogoutToken}/>}/>
                <Route path={'test/:id/authenticate'} element={<Authenticate logoutFunction={handleLogoutToken}/>} />
            </Routes>
        </Router>
    );
}

export default App;
