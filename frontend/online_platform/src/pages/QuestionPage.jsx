import Navbar from "../components/Navbar";
import {useDispatch, useSelector} from "react-redux";
import Footer from "../components/Footer";
import {QUESTION_PAGE} from "../utils/content";
import {useEffect, useState} from "react";
import {testSlice} from "../store/slices/testSlice";
import {useNavigate} from "react-router-dom";
import {submitAnswers} from "../utils/apiCalls";
import {finishTest} from "../store/thunks/finishTestThunk";

function QuestionPage(params) {
    const { logoutFunction } = params;

    const [selectedAnswer, setSelectedAnswer] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const username = useSelector(state => state.global.username);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);

    const activityID = useSelector(state => state.test.activity.activityID);
    const noOfQuestions = Number(useSelector(state => state.test.activity.questions.noOfQuestions));

    const seconds = useSelector(state => state.test.activity.questions.timeLimit) * 60;
    const [timeLeft, setTimeLeft] = useState(seconds);

    const questions = useSelector(state => state.test.questions);
    const currentQuestion = useSelector(state => state.test.currentQuestion);
    const answers = useSelector(state => state.test.answers);

    const userName = name?.toUpperCase() + ' ' + surname;

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((time) => {
                if (time <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return time - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        setSelectedAnswer('');
    }, [currentQuestion]);

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
            navigate('/');
        } else {
            dispatch(testSlice.actions.setCurrentQuestion(currentQuestion + 1));
            navigate(`/test/${activityID}/${currentQuestion + 1}`);
        }
    }

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleLogoutToken={logoutFunction}/>

            <div className={'question-container relative'}>
                <div className={'course-border min-h-[33.313rem] p-5'}>
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
                                {
                                    questions[currentQuestion]?.question?.answers.map((answer, index) => {
                                        return (
                                            <li key={index}>
                                                <input type={'radio'} name={'answer'}
                                                       value={answer}
                                                       checked={selectedAnswer === answer}
                                                       onChange={(e) => setSelectedAnswer(e.target.value)}
                                                />
                                                <label className={'ml-2'}>
                                                    {answer}
                                                </label>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>

                    <div className={'absolute flex justify-end bottom-[2.5rem] right-[3.75rem]'}>
                        <button className={'bg-primary px-4 py-2 text-text-secondary font-light'}
                            onClick={handleClick}>
                            {currentQuestion+1 === noOfQuestions ?
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