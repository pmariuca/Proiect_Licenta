import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import MenuDrawer from "../components/MenuDrawer";
import {useEffect, useState} from "react";
import {getCourses} from "../utils/apiCalls";
import LogoSVG from "../components/SVG/LogoSVG";

function Homepage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [courses, setCourses] = useState({});

    const loggedIn = useSelector(state => state.global.loggedIn);
    const username = useSelector(state => state.global.username);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);

    const userName = name?.toUpperCase() + ' ' + surname;

    useEffect(() => {
        (async () => {
            const response = await getCourses(username);
            setCourses(response.responseJSON.data);
        })();
    }, []);

    useEffect(() => {
        if(drawerOpen) {
            document.getElementById('menu-drawer')?.classList.add('open');
        } else {
            document.getElementById('menu-drawer')?.classList.remove('open');
        }
    }, [drawerOpen]);

    if(!loggedIn) {
        return <Navigate to={'/login'} />;
    }

    function handleDrawer() {
        setDrawerOpen(!drawerOpen);
    }

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleDrawer={handleDrawer}/>
            <MenuDrawer courses={courses}/>
            <div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default Homepage;