import Navbar from "../components/Navbar";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Footer from "../components/Footer";
import {useLocation} from "react-router-dom";
import TestSVG from "../components/SVG/TestSVG";
import {ADD_ACTIVITY} from "../utils/content";
import {parseDateFromString} from "../utils/functions";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import {addActivity, getCoursesProfessors, getCoursesStudents} from "../utils/apiCalls";
import CloseSVG from "../components/SVG/CloseSVG";
import MenuDrawer from "../components/MenuDrawer";

function AddActivityPage(params) {
    const { logoutFunction } = params;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [chooseInterval, setChooseInterval] = useState(true);
    const [chooseDate, setChooseDate] = useState(false);

    const [courses, setCourses] = useState({});

    const [activityName, setActivityName] = useState('');
    const [activityDescription, setActivityDescription] = useState('');

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [limitDate, setLimitDate] = useState(null);

    const [selectedTimeStart, setSelectedTimeStart] = useState('');
    const [selectedTimeEnd, setSelectedTimeEnd] = useState('');

    const [choiceType, setChoiceType] = useState(true);
    const [uploadType, setUploadType] = useState(false);

    const [requestFRC, setRequestFRC] = useState(false);
    const [requestHUB, setRequestHUB] = useState(false);

    const [noOfQuestions, setNoOfQuestions] = useState(0);
    const [timeLimit, setTimeLimit] = useState(0);

    const { state } = useLocation();

    const username = useSelector(state => state.global.username);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);
    const role = useSelector(state => state.global.role);

    const userName = name?.toUpperCase() + ' ' + surname;

    const weekStart = parseDateFromString(state?.weekData?.week?.start);
    const weekEnd = parseDateFromString(state?.weekData?.week?.end);

    useEffect(() => {
        (async () => {
            if(role === 'student') {
                const response = await getCoursesStudents(username);
                setCourses(response?.responseJSON?.data);
            } else if(role === 'professor') {
                const response = await getCoursesProfessors(username);
                setCourses(response?.responseJSON?.data);
            }
        })();
    }, []);

    useEffect(() => {
        if(drawerOpen) {
            document.getElementById('menu-drawer')?.classList.add('open');
        } else {
            document.getElementById('menu-drawer')?.classList.remove('open');
        }
    }, [drawerOpen]);

    function handleDrawer() {
        setDrawerOpen(!drawerOpen);
    }

    const handleChooseInterval = () => {
        setChooseInterval(!chooseInterval);
        setChooseDate(!chooseDate);
    }

    const handleAnswerType = () => {
        setChoiceType(!choiceType);
        setUploadType(!uploadType);
    }

    const checkValidDate = () => {
        if(chooseInterval) {
            return startDate && endDate && selectedTimeStart && selectedTimeEnd;
        } else {
            return limitDate && selectedTimeEnd;
        }
    }

    const handleSubmit = async () => {
        if(!activityName || !activityDescription || !checkValidDate() || !noOfQuestions || !timeLimit) {
            document.querySelector('#fillAlert').classList.remove('hidden');
            return;
        }

        const activityDetails = {
            courseInfo: {
                course: state?.weekData?.course,
                type: state?.weekData?.type
            },
            week: {
                start: weekStart,
                end: weekEnd
            },
            details: {
                name: activityName,
                description: activityDescription
            },
            type_of_disponibility: {
                interval: chooseInterval,
                date: chooseDate
            },
            disponibility: {
                startDate: startDate,
                endDate: endDate,
                limitDate: limitDate,
                startTime: selectedTimeStart,
                endTime: selectedTimeEnd
            },
            answers: {
                choice: choiceType,
                upload: uploadType
            },
            access: {
                frc: requestFRC,
                hub: requestHUB
            },
            questions: {
                noOfQuestions: noOfQuestions,
                timeLimit: timeLimit
            }
        };

        try {
            const response = await addActivity(activityDetails);

            if(response.status === 200) {
                window.location.href = `/course/${state?.weekData?.type}${state?.weekData?.course}`;
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleDrawer={handleDrawer} handleLogoutToken={logoutFunction}/>
            <MenuDrawer courses={courses} />
            <div className={'min-h-[35.313rem] p-[0.938rem] relative activity-add-container'}>
                <div className={'min-h-[35.313rem] p-4 border-[0.063rem] border-solid border-[#00000020]'}>
                    <div className={'flex gap-2 items-center mb-8'}>
                        <TestSVG/>
                        <span className={'font-light text-xl'}>
                            {ADD_ACTIVITY.TITLE}
                        </span>
                    </div>

                    <details open={true}>
                        <summary>
                            {ADD_ACTIVITY.GENERAL.TITLE}
                        </summary>

                        <div className={'input-container'}>
                            <label htmlFor={'activityName'}
                                   className={'flex align-middle w-[6.25rem]'}
                            >
                                {ADD_ACTIVITY.GENERAL.NAME}
                            </label>
                            <input id={'activityName'} type={'text'}
                                   value={activityName}
                                   onChange={e => setActivityName(e.target.value)}
                                   className={'p-1 border-[0.063rem] border-solid border-[#8F959E] min-w-[31.25rem]'}
                            />
                        </div>

                        <div className={'input-container'}>
                            <span className={'flex align-middle w-[6.25rem]'}>
                                {ADD_ACTIVITY.GENERAL.DESCRIPTION}
                            </span>
                            <textarea className={'p-1 border-[0.063rem] border-solid border-[#8F959E] min-w-[31.25rem]'}
                                      value={activityDescription}
                                      onChange={e => setActivityDescription(e.target.value)}
                            />
                        </div>
                    </details>

                    <details>
                        <summary>
                            {ADD_ACTIVITY.DISPONIBILITY.TITLE}
                        </summary>

                        <div className={'input-container flex flex-col gap-2'}>
                            <div className={'flex flex-col'}>
                                <div className={'flex'}>
                                    <label htmlFor={'chooseInterval'}
                                           className={'pr-2 block w-[10.375rem]'}
                                    >
                                        {ADD_ACTIVITY.CHOOSE.INTERVAL}
                                    </label>
                                    <input type={'checkbox'}
                                           id={'chooseInterval'}
                                           onChange={handleChooseInterval}
                                           checked={chooseInterval}/>
                                </div>

                                <div className={'flex'}>
                                    <label htmlFor={'chooseDate'}
                                           className={'pr-2 block w-[10.375rem]'}
                                    >
                                        {ADD_ACTIVITY.CHOOSE.LIMIT}
                                    </label>
                                    <input type={'checkbox'}
                                           id={'chooseDate'}
                                           onChange={handleChooseInterval}
                                           checked={chooseDate}/>
                                </div>
                            </div>
                            <div
                                className={chooseDate ? 'flex text-gray-500 items-center' : 'flex text-text-primary items-center'}>
                                <label className={'w-[9.25rem] pr-4'}>
                                    {ADD_ACTIVITY.DISPONIBILITY.START_DATE}
                                </label>

                                <DatePicker
                                    className={'p-1 border-[0.063rem] border-solid border-[#8F959E]'}
                                    selected={startDate}
                                    minDate={weekStart}
                                    maxDate={weekEnd}
                                    onChange={(date) => setStartDate(date)}
                                    disabled={chooseDate}
                                />
                            </div>

                            <div
                                className={chooseDate ? 'flex text-gray-500 items-center' : 'flex text-text-primary items-center'}>
                                <label className={'w-[9.25rem] pr-4'}>
                                    {ADD_ACTIVITY.DISPONIBILITY.END_DATE}
                                </label>

                                <DatePicker
                                    className={'p-1 border-[0.063rem] border-solid border-[#8F959E]'}
                                    selected={endDate}
                                    minDate={weekStart}
                                    maxDate={weekEnd}
                                    onChange={(date) => setEndDate(date)}
                                    disabled={chooseDate}
                                />
                            </div>

                            <div
                                className={chooseInterval ? 'flex text-gray-500 items-center' : 'flex text-text-primary items-center'}>
                                <label className={'w-[9.25rem] pr-4'}>
                                    {ADD_ACTIVITY.DISPONIBILITY.LIMIT_DATE}
                                </label>

                                <DatePicker
                                    className={'p-1 border-[0.063rem] border-solid border-[#8F959E]'}
                                    selected={limitDate}
                                    minDate={weekStart}
                                    maxDate={weekEnd}
                                    onChange={(date) => setLimitDate(date)}
                                    disabled={chooseInterval}
                                />
                            </div>

                            <div
                                className={chooseDate ? 'flex text-gray-500 items-center' : 'flex text-text-primary items-center'}>
                                <label className={'w-[9.25rem] pr-4'}>
                                    {ADD_ACTIVITY.DISPONIBILITY.START_TIME}
                                </label>

                                <TimePicker
                                    value={selectedTimeStart}
                                    onChange={time => setSelectedTimeStart(time)}
                                    format={'HH:mm'}
                                    disableClock={true}
                                    disabled={chooseDate}
                                />
                            </div>

                            <div className={'flex text-text-primary items-center'}>
                                <label className={'w-[9.25rem] pr-4'}>
                                    {ADD_ACTIVITY.DISPONIBILITY.END_TIME}
                                </label>

                                <TimePicker
                                    value={selectedTimeEnd}
                                    onChange={time => setSelectedTimeEnd(time)}
                                    format={'HH:mm'}
                                    disableClock={true}
                                />
                            </div>
                        </div>
                    </details>

                    <details>
                        <summary>
                            {ADD_ACTIVITY.ANSWERS.TITLE}
                        </summary>

                        <div className={'input-container flex flex-col gap-2'}>
                            <div className={'flex'}>
                                <label htmlFor={'choiceType'}
                                       className={'pr-2 block w-[10.375rem]'}
                                >
                                    {ADD_ACTIVITY.ANSWERS.CHOICE}
                                </label>
                                <input type={'checkbox'}
                                       id={'choiceType'}
                                       checked={choiceType}
                                       onChange={handleAnswerType}/>
                            </div>

                            <div className={'flex'}>
                                <label htmlFor={'uploadType'}
                                       className={'pr-2 block w-[10.375rem]'}
                                >
                                    {ADD_ACTIVITY.ANSWERS.UPLOAD}
                                </label>
                                <input type={'checkbox'}
                                       id={'uploadType'}
                                       checked={uploadType}
                                       onChange={handleAnswerType}/>
                            </div>
                        </div>
                    </details>

                    <details>
                        <summary>
                            {ADD_ACTIVITY.ACCESS.TITLE}
                        </summary>

                        <div className={'input-container flex flex-col gap-2'}>
                            <div className={'flex'}>
                                <label htmlFor={'requestFRC'}
                                       className={'pr-2 block w-[10.375rem]'}
                                >
                                    {ADD_ACTIVITY.ACCESS.FRC}
                                </label>
                                <input type={'checkbox'}
                                       id={'requestFRC'}
                                       checked={requestFRC}
                                       onChange={() => setRequestFRC(!requestFRC)}/>
                            </div>
                            <div className={'flex'}>
                                <label htmlFor={'requestHUB'}
                                       className={'pr-2 block w-[10.375rem]'}
                                >
                                    {ADD_ACTIVITY.ACCESS.HUBSTAFF}
                                </label>
                                <input type={'checkbox'}
                                       id={'requestHUB'}
                                       checked={requestHUB}
                                       onChange={() => setRequestHUB(!requestHUB)}/>
                            </div>
                        </div>
                    </details>

                    <details>
                        <summary>
                            {ADD_ACTIVITY.QUESTIONS.TITLE}
                        </summary>

                        <div className={'input-container flex flex-col gap-2'}>
                            <div className={'flex'}>
                                <label htmlFor={'noOfQuestions'}
                                       className={'pr-2 block w-[10.375rem]'}
                                >
                                    {ADD_ACTIVITY.QUESTIONS.NUMBER_OF_QUESTIONS}
                                </label>

                                <input type={'number'} id={'noOfQuestions'}
                                       className={'p-1 border-[0.063rem] border-solid border-[#8F959E]'}
                                       value={noOfQuestions}
                                       onChange={e => setNoOfQuestions(e.target.value)}
                                />
                            </div>

                            <div className={'flex'}>
                                <label htmlFor={'timeLimit'}
                                       className={'pr-2 block w-[10.375rem]'}
                                >
                                    {ADD_ACTIVITY.QUESTIONS.TIME_LIMIT}
                                </label>

                                <input type={'number'} id={'timeLimit'}
                                       className={'p-1 border-[0.063rem] border-solid border-[#8F959E]'}
                                       value={timeLimit}
                                       onChange={e => setTimeLimit(e.target.value)}
                                />
                            </div>
                        </div>
                    </details>

                    <div className={'flex justify-center mt-4'}>
                        <button onClick={handleSubmit}
                                className={'bg-primary px-4 py-2 text-text-secondary font-light'}
                        >
                            {ADD_ACTIVITY.BUTTON}
                        </button>
                    </div>

                    <div id={'fillAlert'} className={'hidden absolute right-[42%] bg-[#D20F0FEB] py-4 px-5 laptop:right-[38%]'}>
                        {ADD_ACTIVITY.ALERT}
                        <button className={'absolute top-[5%] right-[2%]'}
                                onClick={() => document.querySelector('#fillAlert').classList.add('hidden')}
                        >
                            <CloseSVG />
                        </button>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default AddActivityPage;