import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {useSelector} from "react-redux";
import {QUESTION_PAGE} from "../utils/content";
import {useEffect, useState} from "react";
import {closeMonitorApp, getActivityDetials, getSpecificCourse} from "../utils/apiCalls";
import {useNavigate} from "react-router-dom";
import ActivityTitle from "../components/ActivityTitle";

function ClosedTestPage(params) {
    const { logoutFunction } = params;

    const [courseData, setCourseData] = useState({});
    const [activity, setActivity] = useState(null);

    const navigate = useNavigate();

    const idCourse = window.location.href.split('/')[4].slice(0, 2);

    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);
    const userName = name?.toUpperCase() + ' ' + surname;
    const activityID = useSelector(state => state.test.activity.activityID);

    useEffect(() => {
        (async () => {
            const response = await getActivityDetials(activityID);
            setActivity(response?.responseJSON);

            const response_course = await getSpecificCourse(idCourse);
            setCourseData(response_course?.responseJSON?.data);

            await closeMonitorApp();
        })();
    }, []);

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleLogoutToken={logoutFunction}/>

            <div className={'min-h-[35.313rem] p-[0.938rem]'}>
                <div className={'p-5 mb-4'}>
                    <ActivityTitle activityID={activityID} courseData={courseData} activity={activity} />

                    <div className={'course-border p-5'}>
                        <span className={'text-lg font-light'}>
                            {QUESTION_PAGE.ANSWERS_SAVED}
                        </span>

                        <div className={'flex justify-center mt-8'}>
                            <button className={'bg-primary px-4 py-2 text-text-secondary font-light'}
                                    onClick={() => navigate('/')}
                            >
                                {QUESTION_PAGE.HOMEPAGE}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default ClosedTestPage;