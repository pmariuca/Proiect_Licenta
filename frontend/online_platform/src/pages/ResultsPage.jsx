import Navbar from "../components/Navbar";
import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {
    getActivityDetials, getAllFiles,
    getAllResults, getAttendance, getAttendanceExcel, getAttendancePDF,
    getNoOfSubmits,
    getScreenshots,
    getSpecificCourse, getStudentFiles, getStudentResults,
    getStudentsSubmits
} from "../utils/apiCalls";
import {formatDate, populateCourseSlice, populateTestSlice} from "../utils/functions";
import ActivityTitle from "../components/ActivityTitle";
import {RESULTS_PAGE} from "../utils/content";
import Footer from "../components/Footer";
import CloseSVG from "../components/SVG/CloseSVG";

function ResultsPage(params) {
    const { logoutFunction } = params || {};

    const dispatch = useDispatch();

    const [courseData, setCourseData] = useState({});
    const [activity, setActivity] = useState(null);
    const [noOfSubmits, setNoOfSubmits] = useState(0);
    const [submitsStudents, setSubmitsStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [examType, setExamType] = useState('');
    const [attendance, setAttendance] = useState(null);

    const username = useSelector(state => state.global.username);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);
    const userName = name?.toUpperCase() + ' ' + surname;

    const activityID = window.location.href.split('/')[5];
    const idCourse = window.location.href.split('/')[5].slice(0, 2);

    useEffect(() => {
        (async () => {
            const response = await getActivityDetials(activityID);
            setActivity(response?.responseJSON);
            setExamType(response?.responseJSON?.answers?.choice ? 'Choice' : 'File');

            const response_course = await getSpecificCourse(idCourse);
            setCourseData(response_course?.responseJSON?.data);

            const responseSubmits = await getNoOfSubmits(activityID);
            setNoOfSubmits(responseSubmits?.responseJSON?.noOfSubmits);

            const attendance = await getAttendance(activityID);
            if(attendance?.status === 200) {
                setAttendance(true);
            } else {
                setAttendance(false);
            }
        })();
    }, []);

    useEffect(() => {
        if(activity && courseData) {
            (async () => {

                const testData = {
                    activity: activity,
                    questions: []
                };
                populateTestSlice(testData, dispatch);

                const data = {
                    courseID: idCourse,
                    courseData: courseData
                };
                populateCourseSlice(data, dispatch);
            })();
        }
    }, [activity, courseData]);

    useEffect(() => {
        if(noOfSubmits && noOfSubmits > 0) {
            (async () => {
                const response = await getStudentsSubmits(activityID);
                setSubmitsStudents(response?.responseJSON?.studentsSubmits);
            })();
        }
    }, [noOfSubmits]);

    useEffect(() => {
        if(attendance) {
            if(noOfSubmits === 0) {
                document.getElementById('noSubmitsAttendance').style.display = 'flex';
            } else {
                document.getElementById('submitsAttendance').style.display = 'flex';
            }
        }
    }, [attendance])

    const handleClickScreenshots = async () => {
        try {
            await getScreenshots(activityID);
        } catch(error) {
            console.log(error);
        }
    };
    const handleClickSaveAll = async () => {
        try {
           await getAllResults(activityID);

           if(examType === 'File') {
               await getAllFiles(activityID);
           }
        } catch(error) {
            console.log(error);
        }
    };

    const handleClickStudentResults = () => {
        const overlay = document.querySelector('.overlay');
        overlay.classList.add('overlay-active');
    };

    const handleSelectStudent = (username) => {
        setSelectedStudent(username);
    };

    const handleClickGetResultsStud = async () => {
      try {
          const overlay = document.querySelector('.overlay');
          overlay.classList.add('overlay-active');

          await getStudentResults(activityID, selectedStudent, activity?.access?.hub);

          if(examType === 'File') {
              await getStudentFiles(activityID, selectedStudent);
          }
      } catch(error) {
          console.log(error);
      }
    };

    const handleClickAttendance = () => {
        const overlay = document.querySelector('.overlay-attendance');
        overlay.classList.add('overlay-active');
    };

    const handleAttendancePDF = async () => {
        try {
            await getAttendancePDF(activityID);
        } catch(error) {
            console.log(error);
        }
    };

    const handleAttendanceExcel = async () => {
        try {
            await getAttendanceExcel(activityID);
        } catch(error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className={'overlay'}></div>
            <div id={'userModal'}>
                <button className={'absolute top-[2%] right-[2%]'}
                        onClick={() => document.querySelector('.overlay').classList.remove('overlay-active')}
                >
                    <CloseSVG/>
                </button>
                <div className={'text-center font-thin text-lg'}>
                    {RESULTS_PAGE.SELECT_STUDENT}
                </div>

                <hr className={'mt-2'}/>
                <div className={'overflow-auto max-h-[15rem]'}>
                    {submitsStudents?.map((username, index) => (
                        <React.Fragment key={`${username}-${index}`}>
                            <div
                                className={`user-row text-[0.938rem] ${selectedStudent === username ? 'selected' : ''}`}
                                onClick={() => handleSelectStudent(username)}
                            >
                                {username}
                            </div>
                            {index !== submitsStudents.length - 1 && <hr/>}
                        </React.Fragment>
                    ))}
                </div>

                <div className={'absolute bottom-[2%] right-[2%]'}>
                    <button className={'w-[10rem] bg-primary px-4 py-2 mt-4 text-text-secondary font-light'}
                            onClick={handleClickGetResultsStud}
                    >
                        {RESULTS_PAGE.DOWNLOAD}
                    </button>
                </div>
            </div>

            <div className={'overlay-attendance'}></div>
            <div id={'userModalAttendance'}>
                <button className={'absolute top-[2%] right-[2%]'}
                        onClick={() => document.querySelector('.overlay-attendance').classList.remove('overlay-active')}
                >
                    <CloseSVG/>
                </button>
                <div className={'text-center font-thin text-lg'}>
                    {RESULTS_PAGE.ATTENDANCE_TYPE}
                </div>

                <hr className={'mt-2'}/>
                <div className={'flex mt-8'}>
                    <button className={'w-[10rem] bg-primary px-4 py-2 mt-2 mx-auto text-text-secondary font-light'}
                            onClick={handleAttendancePDF}
                    >
                        {RESULTS_PAGE.ATTENDANCE_PDF}
                    </button>

                    <button className={'w-[10rem] bg-primary px-4 py-2 mt-2 mx-auto text-text-secondary font-light'}
                            onClick={handleAttendanceExcel}
                    >
                        {RESULTS_PAGE.ATTENDANCE_EXCEL}
                    </button>
                </div>
            </div>

            <div className={'page-container'}>
                <Navbar userName={userName} handleLogoutToken={logoutFunction}/>

                <div className={'min-h-[35.313rem] p-[0.938rem]'}>
                    <ActivityTitle activityID={activityID} courseData={courseData} activity={activity}/>

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

                        {noOfSubmits === 0 ? (
                            <div className={'mt-4 text-lg font-light text-center'}>
                                {RESULTS_PAGE.NO_ANSWERS}

                                <div id={'noSubmitsAttendance'} className={'my-4 flex flex-col hidden'}>
                                        <span className={'text-[0.931rem]'}>
                                            {RESULTS_PAGE.ATTENDANCE}
                                        </span>

                                    <button
                                        className={'w-[10rem] bg-primary px-4 py-2 mt-2 mx-auto text-text-secondary font-light'}
                                        onClick={handleClickAttendance}
                                    >
                                        {RESULTS_PAGE.DOWNLOAD}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={'my-4'}>
                                <span className={'text-lg font-light'}>
                                    Există {noOfSubmits} răspunsuri pentru acest test.
                                </span>

                                <div className={'flex justify-around'}>
                                    <div id={'submitsAttendance'} className={'my-4 flex flex-col hidden'}>
                                        <span className={'text-[0.931rem]'}>
                                            {RESULTS_PAGE.ATTENDANCE}
                                        </span>

                                        <button
                                            className={'w-[10rem] bg-primary px-4 py-2 mt-2 mx-auto text-text-secondary font-light'}
                                            onClick={handleClickAttendance}
                                        >
                                            {RESULTS_PAGE.DOWNLOAD}
                                        </button>
                                    </div>

                                    <div className={'my-4 flex flex-col'}>
                                        <span className={'text-[0.931rem]'}>
                                            {RESULTS_PAGE.ALL_ANSWERS}
                                        </span>

                                        <button
                                            className={'w-[10rem] bg-primary px-4 py-2 mt-2 mx-auto text-text-secondary font-light'}
                                            onClick={handleClickSaveAll}
                                        >
                                            {RESULTS_PAGE.DOWNLOAD}
                                        </button>
                                    </div>

                                    <div className={'my-4 flex flex-col'}>
                                        <span className={'text-[0.931rem]'}>
                                            {RESULTS_PAGE.ALL_PHOTOS}
                                        </span>

                                        <button
                                            className={'w-[10rem] bg-primary px-4 py-2 mt-2 mx-auto text-text-secondary font-light'}
                                            onClick={handleClickScreenshots}
                                            disabled={!(activity?.access?.hub)}
                                        >
                                            {RESULTS_PAGE.DOWNLOAD}
                                        </button>
                                    </div>

                                    <div className={'my-4 flex flex-col'}>
                                        <span className={'text-[0.931rem]'}>
                                            {RESULTS_PAGE.DOWNLOAD_STUDENT}
                                        </span>

                                        <button
                                            className={'w-[10rem] bg-primary px-4 py-2 mt-2 mx-auto text-text-secondary font-light'}
                                            onClick={handleClickStudentResults}
                                        >
                                            {RESULTS_PAGE.DOWNLOAD}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <Footer/>
            </div>
        </>
    )
}

export default ResultsPage;