import {FOOTER} from "../utils/content";
import {useSelector} from "react-redux";

function Footer() {
    // const loggedIn = useSelector((state) => state.global.loggedIn);
    // const name = useSelector((state) => state.global.name);
    // const surname = useSelector((state) => state.global.surname);

    return (
        <div className={'bg-footer'}>
            <div className={'content-container flex flex-col py-4 text-light-grey'}>
                <span className={'text-[0.938rem]'}>{FOOTER.NOT_LOGGED_IN}</span>
                <a href={'/'} className={'footer-link'}>{FOOTER.HOME.ENG}</a>
                <span className={'footer-link'}>{FOOTER.DATA_RETENTION.ENG}</span>
                <span className={'footer-link'}>{FOOTER.MOBILE_APP.ENG}</span>
            </div>
        </div>
    );
}

export default Footer;