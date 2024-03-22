import {Navigate, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {getSpecificCourse} from "../utils/apiCalls";
import {useSelector} from "react-redux";
import Navbar from "../components/Navbar";
import MenuDrawer from "../components/MenuDrawer";
import Footer from "../components/Footer";
import {COURSE_PAGE, NAVBAR} from "../utils/content";
import {getWeeks} from "../utils/functions";

function CoursePage(params) {
    const { logoutFunction } = params;
    const [courseData, setCourseData] = useState({});
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [weeks, setWeeks] = useState([]);

    const { pathname } = useLocation();
    const idCourse = pathname.split('/')[2];

    const username = useSelector(state => state.global.username);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);

    const userName = name?.toUpperCase() + ' ' + surname;

    useEffect(() => {
        (async () => {
            const response = await getSpecificCourse(idCourse);
            setCourseData(response?.responseJSON?.data);
        })();

        setWeeks(getWeeks());
    }, []);

    console.log(weeks)

    function handleDrawer() {
        setDrawerOpen(!drawerOpen);
    }

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleDrawer={handleDrawer} handleLogoutToken={logoutFunction}/>
            <div className={'p-[0.938rem]'}>
                <div className={'course-border p-5 mb-4'}>
                    <div className={'font-light text-[2.125rem] mb-2'}>
                        {courseData?.subject?.name_subject}, Tip-{idCourse[0].toUpperCase()}, Sem-{courseData?.subject?.id_semester}, Zi (2023-2024)
                    </div>
                    <div className={'text-[0.931rem]'}>
                        <a href={'/'}
                           className={'text-primary mr-1 hover:underline hover:decoration-1'}
                        >
                            {COURSE_PAGE.HOME}
                        </a>

                        &nbsp;/&nbsp;

                        <span className={'mx-1'}>
                            {NAVBAR.MENU_DRAWER.COURSES}
                        </span>

                        &nbsp;/&nbsp;

                        <span className={'text-primary ml-1 cursor-pointer hover:underline hover:decoration-1'}>
                            {courseData?.subject?.name_subject.split(' ')[0]}-{idCourse[0].toUpperCase()} Sem-{courseData?.subject?.id_semester}
                        </span>
                    </div>
                </div>
                <div className={'course-border'}>

                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default CoursePage;