import Navbar from "../components/Navbar";
import {useDispatch, useSelector} from "react-redux";
import Footer from "../components/Footer";
import {QUESTION_PAGE} from "../utils/content";
import {useEffect, useMemo, useState} from "react";
import {testSlice} from "../store/slices/testSlice";
import {useNavigate} from "react-router-dom";
import {getActivityDetials, getSpecificCourse} from "../utils/apiCalls";
import {finishTest} from "../store/thunks/finishTestThunk";
import ActivityTitle from "../components/ActivityTitle";
let submitPerformed = false;
function QuestionPage(params) {
    const { logoutFunction } = params || {};

    const [courseData, setCourseData] = useState({});
    const [activity, setActivity] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const username = useSelector(state => state.global.username);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);
    const userName = name?.toUpperCase() + ' ' + surname;

    const isTestActive = useSelector(state => state.test.isTestActive);
    const activityID = useSelector(state => state.test.activity.activityID);
    const noOfQuestions = Number(useSelector(state => state.test.activity.questions.noOfQuestions));

    const seconds = useSelector(state => state.test.activity.questions.timeLimit) * 60;
    const [timeLeft, setTimeLeft] = useState(seconds);

    const idCourse = window.location.href.split('/')[4].slice(0, 2);

    const questions = useSelector(state => state.test.questions);
    const currentQuestion = useSelector(state => state.test.currentQuestion);
    const answers = useSelector(state => state.test.answers);



    useEffect(() => {
        (async () => {
            const response = await getActivityDetials(activityID);
            setActivity(response?.responseJSON);

            const response_course = await getSpecificCourse(idCourse);
            setCourseData(response_course?.responseJSON?.data);
        })();

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [activityID, answers, dispatch, idCourse, navigate, selectedAnswer, username]);

    useEffect(() => {
        const submitResults = async () => {
            await dispatch(finishTest({username, activityID, answers: [...answers, selectedAnswer]}));
            await dispatch(testSlice.actions.setTestActive(false));
            navigate(`/test/${activityID}/end`);
        };
        if(timeLeft === 0 && !submitPerformed) {
            submitPerformed = true;
            submitResults();
        }
    }, [activityID, answers, dispatch, navigate, selectedAnswer, timeLeft, username]);

    useEffect(() => {
        setSelectedAnswer('');
    }, [currentQuestion]);

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

        const verifyChangedApp = () => {
            if(isTestActive) {
                if (document.visibilityState !== 'visible') {
                    console.log("Pagina este în fundal");
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('contextmenu', blockRightClick);

        // verificare alt tab sau inchidere pagina
        window.addEventListener("visibilitychange", verifyChangedApp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('contextmenu', blockRightClick);
            window.removeEventListener('visibilitychange', verifyChangedApp);
        };
    }, [isTestActive]);

    const formatTimeLeft = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleClick = () => {
        dispatch(testSlice.actions.setAnswer(selectedAnswer));
        dispatch(testSlice.actions.setCurrentQuestion(currentQuestion + 1));

        if(currentQuestion + 1 === noOfQuestions) {
            dispatch(finishTest({ username, activityID, answers: [...answers, selectedAnswer] }));
            dispatch(testSlice.actions.setTestActive(false));

            navigate(`/test/${activityID}/end`);
        } else {
            dispatch(testSlice.actions.setCurrentQuestion(currentQuestion + 1));
            navigate(`/test/${activityID}/${currentQuestion + 1}`);
        }
    }

    const renderQuestions = useMemo(() => {
        return questions[currentQuestion]?.question?.answers.map((answer, index) => {
            return (
                <li key={index}>
                    <input
                        type="radio"
                        name="answer"
                        value={answer}
                        id={answer}
                        checked={selectedAnswer === answer}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                    />
                    <label htmlFor={answer} className="ml-2">
                        {answer}
                    </label>
                </li>
            );
        });
    }, [questions, currentQuestion, selectedAnswer]);

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleLogoutToken={logoutFunction}/>

            <div className={'question-container relative'}>
                <ActivityTitle activityID={activityID} courseData={courseData} activity={activity} />

                <div className={'course-border p-5'}>
                    <div className={'flex justify-between items-end'}>
                        <span className={'text-xl'}>
                            {QUESTION_PAGE.TITLE + ' ' + (currentQuestion + 1)}
                        </span>

                        <div>
                            {QUESTION_PAGE.TIME_LEFT}{formatTimeLeft()}
                        </div>
                    </div>


                    <div className={'mt-4 pl-4'}>
                        <span>
                            {questions[currentQuestion]?.question?.query}
                        </span>

                        <div>
                            <ul>
                                {renderQuestions}
                            </ul>
                        </div>
                    </div>

                    <div className={'absolute flex justify-end bottom-[2.5rem] right-[3.75rem]'}>
                        <button className={'bg-primary px-4 py-2 text-text-secondary font-light'}
                                onClick={handleClick}>
                            {currentQuestion + 1 === noOfQuestions ?
                                QUESTION_PAGE.SUBMIT :
                                QUESTION_PAGE.NEXT
                            }
                        </button>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default QuestionPage;