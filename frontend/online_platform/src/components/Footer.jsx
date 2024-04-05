import {FOOTER} from "../utils/content";
import {useSelector} from "react-redux";

function Footer() {
    const loggedIn = useSelector((state) => state.global.loggedIn);
    const name = useSelector((state) => state.global.name);
    const surname = useSelector((state) => state.global.surname);

    return (
        <div className={'footer-container bg-footer'}>
            <div className={'content-container flex flex-col py-4 text-light-grey'}>
                {loggedIn ? (
                    <span className="text-[0.938rem]">
                        {'Sunteți conectat în calitate de ' + name.toUpperCase() + ' ' + surname + ' '}
                        <span className={'underline decoration-1'}>(Delogare)</span>
                    </span>
                ) : (
                    FOOTER.NOT_LOGGED_IN
                )}
                <a href={'/'} className={'footer-link'}>
                    {loggedIn ? FOOTER.HOME.RO : FOOTER.HOME.ENG}
                </a>
                <span className={'footer-link'}>
                    {loggedIn ? FOOTER.DATA_RETENTION.RO : FOOTER.DATA_RETENTION.ENG}
                </span>
                <span className={'footer-link'}>
                    {loggedIn ? FOOTER.MOBILE_APP.RO : FOOTER.MOBILE_APP.ENG}
                </span>
            </div>
        </div>
    );
}

export default Footer;