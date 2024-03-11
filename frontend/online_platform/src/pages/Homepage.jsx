import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';
import Navbar from '../components/Navbar';

function Homepage() {
    const loggedIn = useSelector(state => state.global.loggedIn);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);

    const userName = name?.toUpperCase() + ' ' + surname;

    if(!loggedIn) {
        return <Navigate to={'/login'} />;
    }

    return (
        <div className={'page-container'}>
            <Navbar userName={userName}/>
        </div>
    )
}

export default Homepage;