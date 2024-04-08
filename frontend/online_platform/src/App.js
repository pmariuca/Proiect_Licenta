import './assets/App.css';
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import Login from './pages/Login';
import Homepage from "./pages/Homepage";
import {useEffect, useState} from "react";
import {retrieveUserData, verifyToken} from "./utils/apiCalls";
import {useSelector, useDispatch} from "react-redux";
import {populateGlobalSlice} from "./utils/functions";
import CoursePage from "./pages/CoursePage";
import AddActivityPage from "./pages/AddActivityPage";
import TestPage from "./pages/TestPage";
import Authenticate from "./pages/Authenticate";
import QuestionPage from "./pages/QuestionPage";
import ClosedTestPage from "./pages/ClosedTestPage";


function App() {
    const [loggedIn, setLoggedIn] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const isTestActive = useSelector(state => state.test.isTestActive);
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

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Verifică dacă testul este activ și utilizatorul apasă Ctrl+C
            if(isTestActive && event.ctrlKey && event.key === 'c') {
                event.preventDefault();
                console.log('Blocarea combinației Ctrl+C în timpul testului');
            }

            if(isTestActive && event.ctrlKey && event.key === 'x') {
                event.preventDefault();
                console.log('Blocarea combinației Ctrl+X în timpul testului');
            }

            if(isTestActive && event.ctrlKey && event.key === 'v') {
                event.preventDefault();
                console.log('Blocarea combinației Ctrl+V în timpul testului');
            }

            if(isTestActive && event.metaKey && event.shiftKey && event.key === 's') {
                event.preventDefault();
                console.log('Blocarea combinației Ctrl+Shift în timpul testului');
            }
        };

        const blockRightClick = (event) => {
            if(isTestActive) {
                event.preventDefault();
                console.log('Click dreapta blocat.');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('contextmenu', blockRightClick);

        // verificare alt tab
        window.addEventListener("visibilitychange", function() {
            if(isTestActive) {
                if (document.visibilityState !== 'visible') {
                    console.log("Pagina este în fundal");
                }
            }
        });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('contextmenu', blockRightClick);
        };
    }, [isTestActive]);

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
                <Route path={'/test/:id/:currentQuestion'} element={<QuestionPage logoutFunction={handleLogoutToken}/>} />
                <Route path={'/test/:id/end'} element={<ClosedTestPage logoutFunction={handleLogoutToken}/>}/>
                <Route path={'/authenticate'} element={<Authenticate logoutFunction={handleLogoutToken}/>} />
            </Routes>
        </Router>
    );
}

export default App;
