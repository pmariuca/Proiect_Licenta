import MenuSVG from "./SVG/MenuSVG";
import {NAVBAR} from "../utils/content";
import NotificationsSVG from "./SVG/NotificationsSVG";
import ProfileSVG from "./SVG/ProfileSVG";
import LogoutSVG from "./SVG/LogoutSVG";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {globalSlice} from "../store/slices/globalSlice";
import {Navigate} from "react-router-dom";

function Navbar(params) {
    const {userName} = params;
    const [ isProfileDropdownOpen, setIsProfileDropdownOpen ] = useState(false);

    const dispatch = useDispatch();

    const handleDropdownClick = () => {
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleLogout = () => {
        dispatch(globalSlice.actions.setLoggedIn(false));
        dispatch(globalSlice.actions.setToken(null));
        dispatch(globalSlice.actions.setName(null));
        dispatch(globalSlice.actions.setSurname(null));

        localStorage.removeItem('token');

        return <Navigate to={'/login'}/>
    };

    useEffect(() => {
        if (isProfileDropdownOpen) {
            document.querySelector('.profile-dropdown').style.display = 'block';
        } else {
            document.querySelector('.profile-dropdown').style.display = 'none';
        }
    }, [isProfileDropdownOpen]);

    return (
        <nav className={'navbar shadow-nav'}>
            <div className={'flex items-center'}>
                <div className={'inline-block mr-4'}>
                    <button className={'bg-[#e9ecef] mr-1 py-2 px-4'}>
                        <MenuSVG color={'#000000'} classes={'m-0'}/>
                    </button>
                </div>

                <div className={'inline mr-4'}>
                    <a href={'/'}
                       className={'text-text-primary text-[1.171875rem]'}
                    >
                        {NAVBAR.TITLE}
                    </a>
                </div>

                <div className={'text-[#00000099] py-2 px-4 flex mr-4'}>
                <span className={'navbar-language text-[0.938rem]'}>
                    {NAVBAR.LANGUAGE}
                </span>
                </div>
            </div>

            <div className={'flex items-center'}>
                <div className={'py-2 pl-4 pr-2 mr-4'}>
                    <NotificationsSVG color={'#00000099'}/>
                </div>

                <div>
                    <button className={'text-primary text-[0.938rem] flex items-center profile-container'}
                            onClick={handleDropdownClick}
                    >
                        <span className={'mr-1'}>
                            {userName}
                        </span>
                        <ProfileSVG classes={'rounded-2xl'}/>
                    </button>
                    <div className={'profile-dropdown'}>
                        <button className={'flex items-center text-[0.938rem] px-6 w-full'}
                                onClick={handleLogout}
                        >
                            <LogoutSVG classes={'mr-2'}/>
                            {NAVBAR.LOGOUT}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;