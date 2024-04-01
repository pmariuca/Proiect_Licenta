import {useSelector} from 'react-redux';
import Navbar from '../components/Navbar';
import MenuDrawer from "../components/MenuDrawer";
import {useEffect, useState} from "react";
import {getCoursesProfessors, getCoursesStudents} from "../utils/apiCalls";
import {NAVBAR, PLATFORM_DETAILS} from "../utils/content";
import CourseContainer from "../components/CourseContainer";
import Footer from "../components/Footer";
import {Navigate} from "react-router-dom";

function Homepage(params) {
    const { logoutFunction } = params;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [courses, setCourses] = useState({});

    const loggedIn = useSelector(state => state.global.loggedIn);
    const username = useSelector(state => state.global.username);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);
    const role = useSelector(state => state.global.role);

    const userName = name?.toUpperCase() + ' ' + surname;

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
    }, [role, username]);

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

    if(!loggedIn) {
        return <Navigate to={'/login'} />;
    }

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleDrawer={handleDrawer} handleLogoutToken={logoutFunction}/>
            <MenuDrawer courses={courses}/>
            <div className={'homepage-container'}>
                <div className={'flex gap-5 laptop:flex-col'}>
                    <div className={'courses-container laptop:w-full'}>
                        <h2 className={'mb-[0.563rem] text-[1.688rem] font-light'}>{NAVBAR.MENU_DRAWER.COURSES}</h2>
                        {
                            Object.entries(courses).map(([key, value]) => {
                                return (
                                    <CourseContainer course={value} />
                                )
                            })
                        }
                    </div>

                    <div className={'w-[22.5rem] float-right p-5 border-[0.063rem] border-solid border-[#00000020] laptop:w-full'}>
                        <span className={'text-[1.172rem] font-light break-words'}>{PLATFORM_DETAILS.TITLE}</span>
                        <div className={'mt-8'}>
                            <span className={'font-bold text-[0.9375rem] block mb-4'}>{PLATFORM_DETAILS.ATTENTION.TITLE}</span>
                            <p className={'font-bold text-[0.9375rem] inline bg-clip-padding bg-[#FFFF00]'}>{PLATFORM_DETAILS.ATTENTION.TEXT}</p>
                        </div>

                        <div className={'mt-12'}>
                            <span className={'text-[0.9375rem] font-extrabold inline bg-clip-padding bg-[#FFFF00]'}>{PLATFORM_DETAILS.AUTH.TITLE}</span>
                            <p className={'mt-4 text-[0.9375rem] font-medium'}>
                                <span className={'font-extrabold'}>{PLATFORM_DETAILS.AUTH.PROF.TEXT_BOLD}</span>
                                <span>{PLATFORM_DETAILS.AUTH.PROF.TEXT_NORMAL}</span>
                            </p>
                            <p className={'mt-4 text-[0.9375rem] font-medium'}>
                                <span className={'font-extrabold'}>{PLATFORM_DETAILS.AUTH.STUD.TEXT_BOLD}</span>
                                <span>{PLATFORM_DETAILS.AUTH.STUD.TEXT_NORMAL}</span>
                            </p>
                        </div>

                        <div className={'mt-12'}>
                            <span className={'text-[0.9375rem] font-bold inline bg-clip-padding bg-[#FFFF00]'}>{PLATFORM_DETAILS.ACCOUNTS.TITLE}</span>
                            <div className={'mt-4 text-[0.9375rem]'}>
                                {PLATFORM_DETAILS.ACCOUNTS.TEXT}

                                <ol className={'list-decimal ml-[3.125rem] my-4'}>
                                    <li>
                                        <span className={'font-bold text-primary cursor-pointer'}>
                                            {PLATFORM_DETAILS.ACCOUNTS.LIST.IDM}
                                        </span>
                                    </li>
                                    <li>
                                        <span className={'font-bold text-primary cursor-pointer'}>
                                            {PLATFORM_DETAILS.ACCOUNTS.LIST.IDM}
                                        </span>
                                    </li>
                                    <li>
                                        <span className={'font-bold text-primary cursor-pointer'}>
                                            {PLATFORM_DETAILS.ACCOUNTS.LIST.IDM}
                                        </span>
                                    </li>
                                </ol>

                                <span>{PLATFORM_DETAILS.ACCOUNTS.SERVICES.SERVICES}</span>
                                <span className={'text-primary font-bold cursor-pointer'}>{PLATFORM_DETAILS.ACCOUNTS.SERVICES.POLICY}</span>
                                <span className={'font-bold'}>{PLATFORM_DETAILS.ACCOUNTS.SERVICES.MANUAL_ENROLMENT_BOLD}</span>
                                <span>{PLATFORM_DETAILS.ACCOUNTS.SERVICES.INSTRUCTIONS}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Homepage;