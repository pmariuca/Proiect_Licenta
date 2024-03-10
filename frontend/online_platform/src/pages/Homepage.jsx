import {useSelector} from 'react-redux';
import {Navigate} from 'react-router-dom';

function Homepage() {
    const loggedIn = useSelector(state => state.global.loggedIn);
    const token = useSelector(state => state.global.token);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);
    console.log(token, name, surname)

    if(!loggedIn) {
        return <Navigate to={'/login'} />;
    }

    return (
        <div className={'page-container'}>
            <h1>Homepage</h1>
        </div>
    )
}

export default Homepage;