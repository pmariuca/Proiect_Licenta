import LogoSVG from '../components/SVG/LogoSVG.jsx';
import LoginForm from '../components/LoginForm';
import {LOGIN_PAGE} from "../utils/content";
import QuestionSVG from "../components/SVG/QuestionSVG";

function Login() {
    return (
        <div className={'login-container'}>
            <div className={'bg-light-grey py-[0.75rem]'}>
                <LogoSVG classes={'mx-auto my-0'}/>
            </div>

            <div className={'p-5 flex flex-wrap justify-center'}>
                <LoginForm classes={'px-4 w-5/12 mt-4'}/>
                <div className={'px-4 w-5/12 my-4'}>
                    <a href={LOGIN_PAGE.CREDENTIALS_LINK}
                       className={'main-text'}>
                        {LOGIN_PAGE.FORGOT_CREDENTIALS}
                    </a>
                    <div className={'text-text-primary main-text mt-4'}>
                        <span>
                            {LOGIN_PAGE.COOKIES}
                            <QuestionSVG fillColor={'#0F6CBF'} classes={'inline mx-2 mb-[0.313rem]'}/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;