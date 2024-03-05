import {LOGIN_PAGE} from "../utils/content";

function LoginForm(params) {
    const { classes } = params;

    return (
        <div className={classes}>
            <form>
                <div>
                    <input type={'text'} placeholder={'Username'}
                           className={'input-bar'}/>
                </div>
                <div className={'mt-4'}>
                    <input type={'password'} placeholder={'Password'}
                           className={'input-bar'}/>
                </div>

                <div className={'mt-4'}>
                    <input type={'checkbox'}/>
                    <label className={'text-text-primary main-text pl-[0.188rem]'}>
                        {LOGIN_PAGE.REMEMBER_USERNAME}
                    </label>
                </div>

                <button type={'submit'}
                        className={'mt-4 login-btn'}>
                    {LOGIN_PAGE.LOGIN_BUTTON}
                </button>
            </form>
        </div>
    )
}

export default LoginForm;