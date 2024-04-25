import {useSelector} from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ActivityTitle from "../components/ActivityTitle";
import {useEffect, useRef, useState} from "react";
import {checkIdentity, getActivityDetials, getSpecificCourse, startMonitor} from "../utils/apiCalls";
import {TEST_PAGE} from "../utils/content";
import {useNavigate} from "react-router-dom";

let timesChecked = 0;

function Authenticate(params) {
    const { logoutFunction } = params;

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [checkedGDPR, setCheckedGDPR] = useState(false);
    const [image, setImage] = useState(null);
    const [videoStream, setVideoStream] = useState(null);

    const [courseData, setCourseData] = useState({});
    const [activity, setActivity] = useState(null);

    const username = useSelector(state => state.global.username);
    const name = useSelector(state => state.global.name);
    const surname = useSelector(state => state.global.surname);
    const userName = name?.toUpperCase() + ' ' + surname;

    const currentQuestion = useSelector(state => state.test.currentQuestion);

    const idCourse = window.location.href.split('/')[4].slice(0, 2);
    const activityID = window.location.href.split('/')[4];

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const response = await getActivityDetials(activityID);
            setActivity(response?.responseJSON);

            const response_course = await getSpecificCourse(idCourse);
            setCourseData(response_course?.responseJSON?.data);
        })();

        async function getVideo() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setVideoStream(stream);

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing the camera", err);
            }
        }

        getVideo();

        return () => {
            if (videoStream) {
                console.log('stop unmount')
                videoStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const captureImage = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
                setImage(blob);
            }, 'image/jpeg');
        }
    };


    const handleCheckButton = () => {
        if(!checkedGDPR) {
            document.getElementById('gdpr-alert').classList.remove('hidden');
        } else {
            captureImage();

            if(image !== null) {
                (async () => {
                    const response = await checkIdentity(username, image);

                    if(response?.responseJSON?.verified === true) {
                        if (videoStream) {
                            console.log('stop buton')
                            videoStream.getTracks().forEach(track => track.stop());
                        }

                        navigate(`/test/${activityID}/${currentQuestion}`);
                        if(activity?.access?.hub) {
                            await (async () => {
                                const response = await startMonitor(username, activity?.questions?.timeLimit, activity?.details?.name, activityID);
                            })();
                        }
                    } else {
                        timesChecked++;
                        if(timesChecked === 1 && Number(response?.responseJSON?.distance) <= 0.45) {
                            document.getElementById('again-alert').classList.remove('hidden');
                        } else {
                            document.getElementById('check-button').disabled = true;
                        }
                    }
                })();
            }
        }
    };

    return (
        <div className={'page-container'}>
            <Navbar userName={userName} handleLogoutToken={logoutFunction}/>

            <div className={'min-h-[35.313rem] p-[0.938rem]'}>
                <ActivityTitle activityID={activityID} courseData={courseData} activity={activity} />

                <div className={'course-border p-5 mb-4'}>
                    <div className={'flex'}>
                        <input id={'gdpr'} type={'checkbox'}
                               className={'mr-2'}
                               onChange={(event) => setCheckedGDPR(event.target.checked)}
                        />
                        <label htmlFor={'gdpr'} className={'text-[0.931rem] mt-3 font-light text-justify'}>
                            {TEST_PAGE.GDPR}
                        </label>
                    </div>

                    <div id={'gdpr-alert'} className={'alert-container mt-2 hidden'}>
                        {TEST_PAGE.GDPR_ALERT}
                    </div>
                    <div id={'again-alert'} className={'alert-container mt-2 hidden'}>
                        {TEST_PAGE.TRY_AGAIN}
                    </div>

                    <div className={'flex justify-center my-8 h-[28.75rem]'}>
                        <video ref={videoRef} autoPlay playsInline width="720" height="460"></video>
                    </div>

                    <canvas ref={canvasRef} width="720" height="460" style={{display: 'none'}}></canvas>

                    <div className={'flex justify-center items-start'}>
                        <button id={'check-button'}
                            className={'bg-primary px-4 py-2 text-text-secondary font-light'}
                            onClick={handleCheckButton}
                        >
                            {TEST_PAGE.CHECK_BUTTON}
                        </button>
                    </div>

                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default Authenticate;