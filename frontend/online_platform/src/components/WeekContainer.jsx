import {useEffect, useState} from "react";
import {getActivities} from "../utils/apiCalls";
import TestSVG from "./SVG/TestSVG";
import {formatDate, parseDateFromString} from "../utils/functions";
import {useSelector} from "react-redux";
import {COURSE_PAGE} from "../utils/content";
import {useNavigate} from "react-router-dom";

function WeekContainer(params) {
    const { week, course, type } = params;

    const [activities, setActivities] = useState([]);

    const role = useSelector(state => state.global.role);
    const navigate = useNavigate();

    const weekData = {
        week,
        course,
        type
    };

    useEffect(() => {
        (async () => {
            const response = await getActivities(weekData);
            if(response.status === 200) {
                setActivities(response.responseJSON);
            }
        })();
    }, []);

    const addActivity = () => {
        navigate('/add-activity', { state: { weekData } });
    }

    return (
        <li className={'mt-4 pb-4 week-container'}>
            <div className={role === 'professor' ? 'flex justify-between' : undefined}>
                <h3 className={'text-[1.525rem] text-primary font-light cursor-pointer hover:underline hover:decoration-1'}>
                    {week?.start} - {week?.end}
                </h3>

                {role === 'professor' && (
                    <button className={'week-text'}
                            onClick={addActivity}
                    >
                        {COURSE_PAGE.ADD_ACTIVITY}
                    </button>
                )}

            </div>

            <div className={'m-4'}>
                {activities.map((activity, index) => {
                    return (
                        <div key={index} className={activities.length > 1 && index !== activities.length-1 ? `pb-4 border-b-[0.063rem] border-solid border-[#00000020] ` : 'pt-4'}>
                            <a href={`/test/${activity?.activityID}`}
                                className={'activity-container items-end pb-2'}>
                                <TestSVG />
                                <span className={'week-text'}>{activity?.activity_title}</span>
                            </a>
                            {activity?.open && activity?.close ? (
                                <>
                                    <div className={'text-[0.931rem]'}>
                                        <strong>Deschis:</strong> {formatDate(activity?.open?.date)}, {activity?.open?.hour}
                                    </div>
                                    <div className={'text-[0.931rem]'}>
                                        <strong>Închis:</strong> {formatDate(activity?.close?.date)}, {activity?.close?.hour}
                                    </div>
                                </>
                            ) : (
                                <div className={'text-[0.931rem]'}>
                                    <strong>Limită:</strong> {formatDate(activity?.limit?.date)}, {activity?.limit?.hour}
                                </div>
                                )}
                        </div>
                    )
                })}
            </div>
        </li>
    )
}

export default WeekContainer;