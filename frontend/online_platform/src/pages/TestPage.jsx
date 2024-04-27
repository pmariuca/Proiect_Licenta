import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {checkSubmission, getActivityDetials, getQuestions, getSpecificCourse, startMonitor} from "../utils/apiCalls";
import {formatDate, populateTestSlice, verifyDate} from "../utils/functions";
import {TEST_PAGE} from "../utils/content";
import {useNavigate} from "react-router-dom";
import ActivityTitle from "../components/ActivityTitle";
import {testSlice} from "../store/slices/testSlice";

function TestPage(params) {
    const { logoutFunction } = params;

    const [isSubmitted, setIsSubmitted] = useState(false);

    const [courseData, setCourseData] = useState({});
    const [activity, setActivity] = useState(null);
    const [questions, setQuestions] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const idCourse = window.location.href.split('/')[4].slice(0, 2);
    const activityID = window.location.href.split('/')[4];

    const username = useSelector(state => state.global.username);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);
    const role = useSelector(state => state.global.role);
    const currentQuestion = useSelector(state => state.test.currentQuestion);

    const userName = name?.toUpperCase() + ' ' + surname;

    useEffect(() => {
        (async () => {
            const response = await getActivityDetials(activityID);
            setActivity(response?.responseJSON);

            const response_course = await getSpecificCourse(idCourse);
            setCourseData(response_course?.responseJSON?.data);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (username !== null) {
                const hasSubmitted = await checkSubmission(username, activityID);
                setIsSubmitted(hasSubmitted);
            }
        })();
    }, [username]);

    useEffect(() => {
        if(activity) {
            (async () => {
                const response = await getQuestions(activity?.questions?.noOfQuestions);
                setQuestions(response?.responseJSON?.data);

                const testData = {
                    activity: activity,
                    questions: response?.responseJSON?.data
                };

                populateTestSlice(testData, dispatch);
            })();
        }
    }, [activity]);

    const handleStartTest = () => {
        dispatch(testSlice.actions.setTestActive(true));
        if(activity?.access?.frc) {
            navigate(`/test/${activityID}/authenticate`);
        } else {
            navigate(`/test/${activityID}/${currentQuestion}`);
            if(activity?.access?.hub) {
                (async () => {
                    const response = await startMonitor(username, activity?.questions?.timeLimit, activity?.details?.name, activityID);
                })();
            }
        }
    };

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleLogoutToken={logoutFunction}/>

            <div className={'min-h-[35.313rem] p-[0.938rem]'}>
                <ActivityTitle activityID={activityID} courseData={courseData} activity={activity} />

                <div className={'course-border p-5 mb-4'}>
                    <span className={'text-2xl font-light'}>
                        {activity?.details?.name}
                    </span>

                    {activity?.type_of_disponibility?.interval ? (
                        <>
                            <div className={'text-[0.931rem] mt-3'}>
                                <strong>Deschis:</strong> {formatDate(activity?.disponibility?.startDate)}, {activity?.disponibility?.startTime}
                            </div>
                            <div className={'text-[0.931rem]'}>
                                <strong>Închis:</strong> {formatDate(activity?.disponibility?.endDate)}, {activity?.disponibility?.endTime}
                            </div>
                        </>
                    ) : (
                        <div className={'text-[0.931rem] mt-3'}>
                            <strong>Limită:</strong> {formatDate(activity?.disponibility?.limitDate)}, {activity?.disponibility?.endTime}
                        </div>
                    )}

                    <hr className={'mt-4'}/>

                    <div className={'my-4 text-lg font-light text-center'}>
                        {activity?.details?.description}
                    </div>

                    {activity?.access?.frc &&
                        <div className={'text-[0.931rem] mt-3 font-light'}>
                            {TEST_PAGE.FACE_RECOGNITION}
                        </div>
                    }

                    {activity?.access?.hub &&
                        <div className={'text-[0.931rem] font-light'}>
                            {TEST_PAGE.HUBSTAFF}
                        </div>
                    }

                    <div className={'text-[0.931rem] font-light'}>
                        {TEST_PAGE.START_MSG}
                    </div>
                    <div className={'flex justify-center'}>
                        {verifyDate(activity?.disponibility) && isSubmitted === false ? (
                            <button className={'bg-primary px-4 py-2 text-text-secondary font-light mt-8'}
                                    onClick={handleStartTest}
                            >
                                {TEST_PAGE.START_BUTTON}
                            </button>
                        ) : (
                            <span className={'mt-8 font-light text-lg'}>
                                {TEST_PAGE.TEST_UNAVAILABLE}
                            </span>
                        )}
                    </div>
                </div>

            </div>

            <Footer/>
        </div>
    )
}

export default TestPage;