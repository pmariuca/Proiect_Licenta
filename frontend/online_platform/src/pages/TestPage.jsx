import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getActivityDetials, getQuestions} from "../utils/apiCalls";

function TestPage(params) {
    const { logoutFunction } = params;

    const [activity, setActivity] = useState(null);
    const [questions, setQuestions] = useState(null);

    const activityID = window.location.href.split('/')[4];

    const username = useSelector(state => state.global.username);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);
    const role = useSelector(state => state.global.role);

    const userName = name?.toUpperCase() + ' ' + surname;

    useEffect(() => {
        (async () => {
            const response = await getActivityDetials(activityID);
            setActivity(response?.responseJSON);
        })();
    }, []);

    useEffect(() => {
        if(activity) {
            (async () => {
                const response = await getQuestions(activity?.questions?.noOfQuestions);
                setQuestions(response?.responseJSON?.data);
            })();
        }
    }, [activity]);

    console.log(activity);
    console.log(questions);

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleLogoutToken={logoutFunction}/>
            <Footer/>
        </div>
    )
}

export default TestPage;