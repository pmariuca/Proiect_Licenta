import Navbar from "../components/Navbar";
import {useDispatch, useSelector} from "react-redux";
import Footer from "../components/Footer";
import {QUESTION_PAGE} from "../utils/content";
import {useEffect, useMemo, useState} from "react";
import {testSlice} from "../store/slices/testSlice";
import { useLocation, useNavigationType, useNavigate} from "react-router-dom";
import {getActivityDetials, getSpecificCourse, submitAttendance, submitResultsFile} from "../utils/apiCalls";
import {finishTest} from "../store/thunks/finishTestThunk";
import ActivityTitle from "../components/ActivityTitle";
import { io } from 'socket.io-client';
import ChoiceQuestion from "../components/ChoiceQuestion";
import FileQuestion from "../components/FileQuestion";

let submitPerformed = false;
let showedAlert = false;

function QuestionPage(params) {
    const { logoutFunction } = params || {};
    const socket = io('http://localhost:3001');

    const [courseData, setCourseData] = useState({});
    const [activity, setActivity] = useState(null);
    const [examType, setExamType] = useState('');

    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [files, setFiles] = useState([]);

    const dispatch = useDispatch();
    const location = useLocation();
    const navigationType = useNavigationType();
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
    const copy = useSelector(state => state.test.copy);
    const paste = useSelector(state => state.test.paste);
    const cut = useSelector(state => state.test.cut);
    const exitWindow = useSelector(state => state.test.exitWindow);

    useEffect(() => {
        const handleTestStopped = async () => {
            await submitResults();
        };

        socket.on('testStopped', handleTestStopped);

        return () => {
            socket.off('testStopped', handleTestStopped);
        };
    }, [answers]);

    useEffect(() => {
        (async () => {
            const response = await getActivityDetials(activityID);
            setActivity(response?.responseJSON);
            setExamType(response?.responseJSON?.answers?.choice ? 'Choice' : 'File');

            const response_course = await getSpecificCourse(idCourse);
            setCourseData(response_course?.responseJSON?.data);

            if(currentQuestion === 0) {
                await submitAttendance(username, activityID);
            }
        })();

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [activityID, idCourse]);

    useEffect(() => {
        if(timeLeft === 0 && !submitPerformed) {
            submitPerformed = true;
            submitResults();
        }
    }, [timeLeft]);

    useEffect(() => {
        setSelectedAnswer('');
    }, [currentQuestion]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if(isTestActive && event.ctrlKey && event.key === 'c') {
                event.preventDefault();
                dispatch(testSlice.actions.setCopy());

                if(!showedAlert) {
                    showAlert();
                }
            }

            if(isTestActive && event.ctrlKey && event.key === 'x') {
                event.preventDefault();
                dispatch(testSlice.actions.setCut());

                if(!showedAlert) {
                    showAlert();
                }
            }

            if(isTestActive && event.ctrlKey && event.key === 'v') {
                event.preventDefault();
                dispatch(testSlice.actions.setPaste());

                if(!showedAlert) {
                    showAlert();
                }
            }
        };

        const blockRightClick = (event) => {
            if(isTestActive) {
                event.preventDefault();

                if(!showedAlert) {
                    showAlert();
                }
            }
        };

        const verifyChangedApp = () => {
            if(isTestActive) {
                if (document.visibilityState !== 'visible') {
                    dispatch(testSlice.actions.setExitWindow());

                    if(!showedAlert) {
                        showAlert();
                    }
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('contextmenu', blockRightClick);
        window.addEventListener("visibilitychange", verifyChangedApp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('contextmenu', blockRightClick);
            window.removeEventListener('visibilitychange', verifyChangedApp);
        };
    }, [isTestActive]);

    useEffect(() => {
        if (navigationType === 'POP') {
            dispatch(finishTest({username, activityID, answers: [], fraudAttempts: [copy, paste, cut, exitWindow]}));
            dispatch(testSlice.actions.setTestActive(false));
            navigate(`/test/${activityID}/end`);
        }
    }, [location, navigationType, navigate]);

    const submitResults = async () => {
        await dispatch(finishTest({username, activityID, answers: [...answers, selectedAnswer], fraudAttempts: [copy, paste, cut, exitWindow]}));
        await dispatch(testSlice.actions.setTestActive(false));
        navigate(`/test/${activityID}/end`);
    };

    const formatTimeLeft = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleClick = () => {
        dispatch(testSlice.actions.setAnswers(selectedAnswer));
        dispatch(testSlice.actions.setCurrentQuestion(currentQuestion + 1));

        if(currentQuestion + 1 === noOfQuestions) {
            dispatch(finishTest({ username, activityID, answers: [...answers, selectedAnswer], fraudAttempts: {'copy': copy, 'paste': paste, 'cut': cut, 'exitWindow': exitWindow} }));
            dispatch(testSlice.actions.setTestActive(false));

            navigate(`/test/${activityID}/end`);
        } else {
            dispatch(testSlice.actions.setCurrentQuestion(currentQuestion + 1));
            navigate(`/test/${activityID}/${currentQuestion + 1}`);
        }
    };

    const handleClickFile = async() => {
        if (currentQuestion + 1 === noOfQuestions) {
            const fraudAttempts = { 'copy': copy, 'paste': paste, 'cut': cut, 'exitWindow': exitWindow };

            try {
                await submitResultsFile(username, activityID, files, fraudAttempts);

                dispatch(testSlice.actions.setTestActive(false));
                navigate(`/test/${activityID}/end`);
            } catch (error) {
                console.error('Error during file submission:', error);
            }
        } else {
            dispatch(testSlice.actions.setCurrentQuestion(currentQuestion + 1));
            navigate(`/test/${activityID}/${currentQuestion + 1}`);
        }
    };

    const handleAddedFile = (selectedFile) => {
        setFiles(prevFiles => [...prevFiles, selectedFile]);
    };

    const renderQuestions = useMemo(() => {
        if (examType === 'Choice' && questions[currentQuestion]?.question?.answers) {
            return questions[currentQuestion].question.answers.map((answer, index) => (
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
            ));
        }
        return null;
    }, [questions, currentQuestion, selectedAnswer, examType]);

    const showAlert = () => {
        const alertElement = document.getElementById('fraud-alert');
        alertElement.style.display = 'block';
        alertElement.style.opacity = '1';
        alertElement.style.animation = 'fadeOut 10s ease forwards';
        showedAlert = true;

        alertElement.addEventListener('animationend', () => {
           alertElement.style.display = 'none';
        });
    };

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

                    { examType === 'Choice' &&
                        <ChoiceQuestion questions={questions}
                                        currentQuestion={currentQuestion}
                                        renderQuestions={renderQuestions}
                        />
                    }

                    { examType === 'File' &&
                        <FileQuestion questions={questions}
                                      currentQuestion={currentQuestion}
                                      handleSubmit={handleAddedFile}
                        />
                    }

                    <div className={'absolute flex justify-end bottom-[2.5rem] right-[3.75rem]'}>
                        <button className={'bg-primary px-4 py-2 text-text-secondary font-light'}
                                onClick={examType === 'Choice' ? handleClick : handleClickFile}>
                            {currentQuestion + 1 === noOfQuestions ?
                                QUESTION_PAGE.SUBMIT :
                                QUESTION_PAGE.NEXT
                            }
                        </button>
                    </div>

                    <div id={'fraud-alert'} className={'bg-red-700 absolute p-4 bottom-[2rem] left-[30.5rem] text-text-secondary'}>
                        {QUESTION_PAGE.ALERT}
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default QuestionPage;