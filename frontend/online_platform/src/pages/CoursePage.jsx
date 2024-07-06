import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {getCoursesProfessors, getCoursesStudents, getSpecificCourse} from "../utils/apiCalls";
import {useDispatch, useSelector} from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {COURSE_PAGE, NAVBAR} from "../utils/content";
import {getWeeks, populateCourseSlice} from "../utils/functions";
import PdfSVG from "../components/SVG/PdfSVG";
import ChatSVG from "../components/SVG/ChatSVG";
import WeekContainer from "../components/WeekContainer";
import MenuDrawer from "../components/MenuDrawer";
import {courseSlice} from "../store/slices/courseSlice";

function CoursePage(params) {
    const { logoutFunction } = params;
    const [courseData, setCourseData] = useState({});
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [weeks, setWeeks] = useState([]);

    const [courses, setCourses] = useState({});

    const { pathname } = useLocation();
    const idCourse = pathname.split('/')[2].toLowerCase();

    const username = useSelector(state => state.global.username);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);
    const role = useSelector(state => state.global.role);

    const userName = name?.toUpperCase() + ' ' + surname;

    useEffect(() => {
        (async () => {
            const response = await getSpecificCourse(idCourse);
            setCourseData(response?.responseJSON?.data);
        })();

        setWeeks(getWeeks());

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

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleDrawer={handleDrawer} handleLogoutToken={logoutFunction}/>
            <MenuDrawer courses={courses} />
            <div className={'courses-weeks-container p-[0.938rem]'}>
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
                <div className={'course-border p-5'}>
                    <ul className={'m-4'}>
                        <li className={'mt-4 pl-4 pb-8 week-container'}>
                            <div className={'activity-container'}>
                                <PdfSVG/>
                                <span className={'week-text'}>{COURSE_PAGE.DISCIPLINE}</span>
                            </div>
                            <div className={'week-activity-spaced activity-container'}>
                                <ChatSVG />
                                <span className={'week-text'}>{COURSE_PAGE.ANNOUNCEMENTS}</span>
                            </div>
                        </li>
                        {weeks?.map((week, index) => {
                            return (
                                <WeekContainer key={index} index={index} week={week} course={idCourse.slice(1)} type={idCourse[0].toUpperCase()} />
                            )
                        })}
                    </ul>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default CoursePage;