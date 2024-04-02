import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getActivityDetials, getQuestions, getSpecificCourse} from "../utils/apiCalls";
import {formatDate, populateTestSlice, verifyDate} from "../utils/functions";
import {COURSE_PAGE, NAVBAR, TEST_PAGE} from "../utils/content";
import {Navigate, useNavigate} from "react-router-dom";

function TestPage(params) {
    const { logoutFunction } = params;

    const [courseData, setCourseData] = useState({});
    const [activity, setActivity] = useState(null);
    const [questions, setQuestions] = useState(null);

    const navigate = useNavigate();

    const idCourse = window.location.href.split('/')[4].slice(0, 2);
    const dispatch = useDispatch();
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

    console.log(activity);
    console.log(questions);

    const handleStartTest = () => {
        if(activity?.access?.frc) {
            navigate('/authenticate');
        } else {
            navigate(`/test/${activityID}/${currentQuestion}`);
        }
    }

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleLogoutToken={logoutFunction}/>

            <div className={'min-h-[35.313rem] p-[0.938rem]'}>
                <div className={'course-border p-5 mb-4'}>
                    <div className={'font-light text-[2.125rem] mb-2'}>
                        {courseData?.subject?.name_subject}, Tip-{idCourse[0].toUpperCase()},
                        Sem-{courseData?.subject?.id_semester}, Zi (2023-2024)
                    </div>
                    <div className={'text-[0.931rem]'}>
                        <a href={'/'}
                           className={'text-primary mr-1 hover:underline hover:decoration-1'}
                        >
                            {COURSE_PAGE.HOME}
                        </a>

                        &nbsp;/&nbsp;

                        <span className={'mx-1 text-primary cursor-pointer hover:underline hover:decoration-1'}>
                            {NAVBAR.MENU_DRAWER.COURSES}
                        </span>

                        &nbsp;/&nbsp;

                        <span className={'mx-1 text-primary cursor-pointer hover:underline hover:decoration-1'}>
                            {TEST_PAGE.BACHELOR}
                        </span>

                        &nbsp;/&nbsp;

                        <span className={'text-primary ml-1 cursor-pointer hover:underline hover:decoration-1'}>
                            {courseData?.subject?.name_subject.split(' ')[0]}-{idCourse[0].toUpperCase()} Sem-{courseData?.subject?.id_semester}
                        </span>

                        &nbsp;/&nbsp;

                        <span className={'text-primary ml-1 cursor-pointer hover:underline hover:decoration-1'}>
                            {activity?.details?.name}
                        </span>
                    </div>
                </div>

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
                        {verifyDate(activity?.disponibility) ? (
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