import Navbar from "../components/Navbar";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getActivityDetials, getNoOfSubmits, getScreenshots, getSpecificCourse} from "../utils/apiCalls";
import {formatDate, populateCourseSlice, populateTestSlice} from "../utils/functions";
import ActivityTitle from "../components/ActivityTitle";
import {RESULTS_PAGE} from "../utils/content";
import Footer from "../components/Footer";

function ResultsPage(params) {
    const { logoutFunction } = params || {};

    const dispatch = useDispatch();

    const [courseData, setCourseData] = useState({});
    const [activity, setActivity] = useState(null);
    const [noOfSubmits, setNoOfSubmits] = useState(0);

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

            const response_course = await getSpecificCourse(idCourse);
            setCourseData(response_course?.responseJSON?.data);
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
        if(activityID && activity) {
            (async () => {
                const response = await getNoOfSubmits(activityID);
                setNoOfSubmits(response?.responseJSON?.noOfSubmits);
                console.log(response?.responseJSON?.noOfSubmits)
            })();
        }
    }, [activityID, activity]);

    const handleClickScreenshots = async () => {
        try {
            const response = await getScreenshots(activityID);
            console.log(response);
        } catch(error) {
            console.log(error);
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

                    {noOfSubmits === 0 ? (
                        <div className={'mt-4 text-lg font-light text-center'}>
                            {RESULTS_PAGE.NO_ANSWERS}
                        </div>
                    ) : (
                        <div className={'my-4'}>
                            <span className={'text-lg font-light'}>
                                Există {noOfSubmits} răspunsuri pentru acest test.
                            </span>

                            <div className={'flex justify-around'}>
                                <div className={'my-4 flex flex-col'}>
                                <span className={'text-[0.931rem]'}>
                                    {RESULTS_PAGE.ALL_ANSWERS}
                                </span>

                                    <button className={'w-[10rem] bg-primary px-4 py-2 mt-2 mx-auto text-text-secondary font-light'}>
                                        {RESULTS_PAGE.DOWNLOAD}
                                    </button>
                                </div>

                                <div className={'my-4 flex flex-col'}>
                                <span className={'text-[0.931rem]'}>
                                    {RESULTS_PAGE.ALL_PHOTOS}
                                </span>

                                    <button className={'w-[10rem] bg-primary px-4 py-2 mt-2 mx-auto text-text-secondary font-light'}
                                        onClick={handleClickScreenshots}
                                    >
                                        {RESULTS_PAGE.DOWNLOAD}
                                    </button>
                                </div>

                                <div className={'my-4 flex flex-col'}>
                                <span className={'text-[0.931rem]'}>
                                    {RESULTS_PAGE.DOWNLOAD_STUDENT}
                                </span>

                                    <button className={'w-[10rem] bg-primary px-4 py-2 mt-2 mx-auto text-text-secondary font-light'}>
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
    )
}

export default ResultsPage;