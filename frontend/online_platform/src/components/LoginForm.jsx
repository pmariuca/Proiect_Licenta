import { LOGIN_PAGE } from '../utils/content';
import { logUser } from '../utils/apiCalls';
import {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {globalSlice} from '../store/slices/globalSlice';
import Cookies from 'js-cookie';
import {Navigate} from 'react-router-dom';

function LoginForm(params) {
    const { classes, onError } = params;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [redirect, setRedirect] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        const userEmail = Cookies.get('username');
        if (userEmail) {
            setRemember(true);
            setUsername(userEmail);
        }
    }, []);

    const handleRememberChange = () => {
        setRemember(!remember);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();

        if(username === '' || password === '') {
            onError({success: false, message: LOGIN_PAGE.EMPTY_FIELDS});
            return;
        } else {
            try {
                const userData = {
                    username: username,
                    password: password
                };

                const {responseJSON: {data: {token, name, surname}}, status} = await logUser(userData);

                if(status === 404 || status === 401) {
                    onError({success: false, message: LOGIN_PAGE.EMPTY_FIELDS});
                    return;
                }

                if(status === 200) {
                    dispatch(globalSlice.actions.setLoggedIn(true));
                    dispatch(globalSlice.actions.setToken(token));
                    dispatch(globalSlice.actions.setName(name));
                    dispatch(globalSlice.actions.setSurname(surname));

                    if (remember) {
                        Cookies.set('username', username);
                    } else {
                        Cookies.remove('username');
                    }
                }
                setRedirect('/');
            } catch (error) {
                console.log(error);
                onError({success: false, message: LOGIN_PAGE.EMPTY_FIELDS});
            }
        }
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className={classes}>
            <form>
                <div>
                    <input type={'text'}
                           placeholder={'Username'}
                           className={'input-bar focus:outline-none'}
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className={'mt-4'}>
                    <input type={'password'}
                           placeholder={'Password'}
                           className={'input-bar focus:outline-none'}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className={'mt-4'}>
                    <input type={'checkbox'}
                           checked={remember}
                           onChange={handleRememberChange}
                    />
                    <label className={'text-text-primary main-text pl-[0.188rem]'}>
                        {LOGIN_PAGE.REMEMBER_USERNAME}
                    </label>
                </div>

                <button type={'submit'}
                        className={'mt-4 login-btn'}
                        onClick={handleSubmit}
                >
                    {LOGIN_PAGE.LOGIN_BUTTON}
                </button>
            </form>
        </div>
    )
}

export default LoginForm;