import {NAVBAR} from "../utils/content";
import {Navigate} from "react-router-dom";
import HomeSVG from "./SVG/HomeSVG";
import TachometerSVG from "./SVG/TachometerSVG";
import FileSVG from "./SVG/FileSVG";
import CalendarSVG from "./SVG/CalendarSVG";
import CourseSVG from "./CourseSVG";

function MenuDrawer(params) {
    const { courses } = params;
    const route = window.location.pathname;

    return (
        <div id={'menu-drawer'}>
            <ul>
                <li className={`menu-drawer-item ${route === '/' ? 'home' : ''}`}
                    key={'home'}
                >
                    <button
                        onClick={() => {
                            return <Navigate to={'/'} />
                        }}
                    >
                        <HomeSVG classes={'text-white mr-2'}/>
                        {NAVBAR.MENU_DRAWER.HOME}
                    </button>
                </li>
                <li className={'menu-drawer-item flex items-center'}
                    key={'dashboard'}
                >
                    <TachometerSVG classes={'mr-2'}/>
                    {NAVBAR.MENU_DRAWER.BOARD}
                </li>
                <li className={'menu-drawer-item flex items-baseline'}
                    key={'calendar'}
                >
                    <CalendarSVG classes={'mr-2'}/>
                    {NAVBAR.MENU_DRAWER.CALENDAR}
                </li>
                <li className={'menu-drawer-item flex items-baseline'}
                    key={'files'}
                >
                    <FileSVG classes={'mr-2'}/>
                    {NAVBAR.MENU_DRAWER.PRIVATE_FILES}
                </li>
                <li className={'menu-drawer-item flex items-center'}
                    key={'courses'}
                >
                    <CourseSVG classes={'mr-2'}/>
                    {NAVBAR.MENU_DRAWER.COURSES}
                </li>
                {
                    Object.entries(courses).map(([key, value], index) => {
                        const name = value.name.split(' ')[0];
                        return (
                            <>
                                <li className={'menu-drawer-item'}
                                    key={`course-${key}`}>
                                    <a href={'/'} className={'flex items-center'}>
                                        <CourseSVG classes={'mr-2'}/>
                                        {`${name}-C Sem${value.semester}`}
                                    </a>
                                </li>
                                <li className={'menu-drawer-item'}
                                    key={`seminar-${key}`}>
                                    <a href={'/'} className={'flex items-center'}>
                                        <CourseSVG classes={'mr-2'}/>
                                        {`${name}-S Sem${value.semester}`}
                                    </a>
                                </li>
                            </>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default MenuDrawer;