import {COURSE_PAGE, NAVBAR, TEST_PAGE} from "../utils/content";
import {useEffect, useState} from "react";
import {getActivityDetials, getSpecificCourse} from "../utils/apiCalls";

function ActivityTitle(params) {
    const { activityID, courseData, activity } = params;

    const idCourse = window.location.href.split('/')[4].slice(0, 2);

    return (
        <div className={'course-border p-5 mb-4'}>
            <div className={'font-light text-[2.125rem] mb-2'}>
                {courseData?.subject?.name_subject}, Tip-{idCourse[0].toUpperCase()},
                Sem-{courseData?.subject?.id_semester}, Zi (2023-2024)
            </div>
            <div className={'text-[0.931rem]'}>
                <a href={'/'}
                   className={'text-primary mr-1 hover:underline hover:decoration-1'}>
                    {COURSE_PAGE.HOME}
                </a>

                &nbsp;/&nbsp;

                <a href={'/'}
                    className={'mx-1 text-primary cursor-pointer hover:underline hover:decoration-1'}>
                    {NAVBAR.MENU_DRAWER.COURSES}
                </a>

                &nbsp;/&nbsp;

                <span className={'mx-1 text-primary cursor-pointer hover:underline hover:decoration-1'}>
                    {TEST_PAGE.BACHELOR}
                </span>

                &nbsp;/&nbsp;

                <a href={`/course/${idCourse}`}
                    className={'text-primary ml-1 cursor-pointer hover:underline hover:decoration-1'}>
                     {courseData?.subject?.name_subject.split(' ')[0]}-{idCourse[0].toUpperCase()} Sem-{courseData?.subject?.id_semester}
                </a>

                &nbsp;/&nbsp;

                <span className={'text-primary ml-1 cursor-pointer hover:underline hover:decoration-1'}>
                    {activity?.details?.name}
                </span>
            </div>
        </div>
    )
}

export default ActivityTitle;