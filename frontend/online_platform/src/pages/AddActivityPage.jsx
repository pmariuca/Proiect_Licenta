import Navbar from "../components/Navbar";
import {useSelector} from "react-redux";
import {useState} from "react";
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

function AddActivityPage(params) {
    const { logoutFunction } = params;

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [chooseInterval, setChooseInterval] = useState(true);
    const [chooseDate, setChooseDate] = useState(false);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [limitDate, setLimitDate] = useState(new Date());

    const [selectedTimeStart, setSelectedTimeStart] = useState('10:00');
    const [selectedTimeEnd, setSelectedTimeEnd] = useState('10:00');

    const { state } = useLocation();
    console.log(state)

    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);

    const userName = name?.toUpperCase() + ' ' + surname;

    const weekStart = parseDateFromString(state?.weekData?.week?.start);
    const weekEnd = parseDateFromString(state?.weekData?.week?.end);

    function handleDrawer() {
        setDrawerOpen(!drawerOpen);
    }

    const handleChooseInterval = () => {
        setChooseInterval(!chooseInterval);
        setChooseDate(!chooseDate);
    }

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleDrawer={handleDrawer} handleLogoutToken={logoutFunction}/>
            <div className={'p-[0.938rem]'}>
                <div className={'p-4 border-[0.063rem] border-solid border-[#00000020]'}>
                    <div className={'flex gap-2 items-center mb-8'}>
                        <TestSVG />
                        <span className={'font-light text-xl'}>
                            {ADD_ACTIVITY.TITLE}
                        </span>
                    </div>

                    <details>
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
                                   className={'p-1 border-[0.063rem] border-solid border-[#8F959E] min-w-[31.25rem]'}
                            />
                        </div>

                        <div className={'input-container'}>
                            <span className={'flex align-middle w-[6.25rem]'}>
                                {ADD_ACTIVITY.GENERAL.DESCRIPTION}
                            </span>
                            <textarea className={'p-1 border-[0.063rem] border-solid border-[#8F959E] min-w-[31.25rem]'} />
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
                                           className={'pr-2 block w-[9.375rem]'}
                                    >
                                        {ADD_ACTIVITY.CHOOSE.INTERVAL}
                                    </label>
                                    <input type={'checkbox'} id={'chooseInterval'} onChange={handleChooseInterval} checked={chooseInterval}/>
                                </div>

                                <div className={'flex'}>
                                    <label htmlFor={'chooseDate'}
                                            className={'pr-2 block w-[9.375rem]'}
                                    >
                                        {ADD_ACTIVITY.CHOOSE.LIMIT}
                                    </label>
                                    <input type={'checkbox'} id={'chooseDate'} onChange={handleChooseInterval} checked={chooseDate}/>
                                </div>
                            </div>
                            <div className={chooseDate ? 'flex text-gray-500 items-center' : 'flex text-text-primary items-center'}>
                                <label className={'w-[9.25rem] pr-4'}>
                                    {ADD_ACTIVITY.DISPONIBILITY.START_DATE}
                                </label>

                                <DatePicker
                                    className={'p-1 border-[0.063rem] border-solid border-[#8F959E]'}
                                    selected={weekStart}
                                    onChange={date => setStartDate(date)}
                                    minDate={weekStart}
                                    maxDate={weekEnd}
                                    disabled={chooseDate}
                                />
                            </div>

                            <div className={chooseDate ? 'flex text-gray-500 items-center' : 'flex text-text-primary items-center'}>
                                <label className={'w-[9.25rem] pr-4'}>
                                    {ADD_ACTIVITY.DISPONIBILITY.END_DATE}
                                </label>

                                <DatePicker
                                    className={'p-1 border-[0.063rem] border-solid border-[#8F959E]'}
                                    selected={weekStart}
                                    onChange={date => setStartDate(date)}
                                    minDate={weekStart}
                                    maxDate={weekEnd}
                                    disabled={chooseDate}
                                />
                            </div>

                            <div className={chooseInterval ? 'flex text-gray-500 items-center' : 'flex text-text-primary items-center'}>
                                <label className={'w-[9.25rem] pr-4'}>
                                    {ADD_ACTIVITY.DISPONIBILITY.LIMIT_DATE}
                                </label>

                                <DatePicker
                                    className={'p-1 border-[0.063rem] border-solid border-[#8F959E]'}
                                    selected={weekStart}
                                    onChange={date => setStartDate(date)}
                                    minDate={weekStart}
                                    maxDate={weekEnd}
                                    disabled={chooseInterval}
                                />
                            </div>

                            <div className={chooseDate ? 'flex text-gray-500 items-center' : 'flex text-text-primary items-center'}>
                                <label className={'w-[9.25rem] pr-4'}>
                                    {ADD_ACTIVITY.DISPONIBILITY.START_TIME}
                                </label>

                                <TimePicker
                                    onChange={time => setSelectedTimeStart(time)}
                                    value={selectedTimeStart}
                                    disableClock={true}
                                    clearIcon={null}
                                    format={'HH:mm'}
                                    disabled={chooseDate}
                                />
                            </div>

                            <div className={'flex text-text-primary items-center'}>
                                <label className={'w-[9.25rem] pr-4'}>
                                    {ADD_ACTIVITY.DISPONIBILITY.END_TIME}
                                </label>

                                <TimePicker
                                    onChange={time => setSelectedTimeEnd(time)}
                                    value={selectedTimeEnd}
                                    disableClock={true}
                                    clearIcon={null}
                                    format={'HH:mm'}
                                />
                            </div>
                        </div>
                    </details>

                    <details>
                        <summary>
                        {ADD_ACTIVITY.ANSWERS.TITLE}
                        </summary>
                    </details>

                    <details>
                        <summary>
                            {ADD_ACTIVITY.ACCESS.TITLE}
                        </summary>
                    </details>

                    <details>
                        <summary>
                            {ADD_ACTIVITY.QUESTIONS.TITLE}
                        </summary>
                    </details>

                    <div className={'flex justify-center mt-4'}>
                        <button className={'bg-primary px-4 py-2 text-text-secondary font-light'}>
                            {ADD_ACTIVITY.BUTTON}
                        </button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default AddActivityPage;