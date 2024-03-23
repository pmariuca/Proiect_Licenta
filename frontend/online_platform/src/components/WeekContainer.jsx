import {useEffect, useState} from "react";
import {getActivities, getCourses} from "../utils/apiCalls";

function WeekContainer(params) {
    const { index, week, course, type } = params;

    const [activities, setActivities] = useState([]);

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

    console.log(activities);
    return (
        <li className={'mt-4 pb-8 week-container'}>
            <h3 className={'text-[1.525rem] text-primary font-light cursor-pointer hover:underline hover:decoration-1'}>
                {week?.start} - {week?.end}
            </h3>
            <div className={'m-4'}>

            </div>
        </li>
    )
}

export default WeekContainer;