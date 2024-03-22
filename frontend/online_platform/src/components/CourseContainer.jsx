import CourseHomepageSVG from "./SVG/CourseHomepageSVG";
import KeySVG from "./SVG/KeySVG";

function CourseContainer(params) {
    const { course } = params;
    console.log(course)
    return (
        <>
            <div className={'p-2'}>
                <div className={'flex justify-between m-[0.313rem]'}>
                    <div className={'flex flex-row align-baseline'}>
                        <div className={'m-auto'}>
                            <CourseHomepageSVG/>
                        </div>
                        <a className={'ml-2 text-primary text-[1.563rem] font-light hover:underline'}>
                            {`${course.name}, Tip-C, Sem-${course.semester}, Zi (2023-2024)`}
                        </a>
                    </div>
                    <KeySVG classes={'text-text-primary'}/>
                </div>

                <div className={'mt-[0.938rem] m-[0.313rem] flex justify-between'}>
                    <div className={'font-normal text-[#1D2125] text-[0.875rem]'}>
                        Formator:
                        <span className={'text-primary cursor-pointer ml-2 hover:underline hover:decoration-1'}>
                            {course.course.professor}
                        </span>
                    </div>
                    <div className={'w-[55%] font-normal text-[#1D2125] text-[0.875rem]'}>
                        {course.university} / {course.specialization} / Anul {course.year}
                    </div>
                </div>
            </div>
            <div className={'p-2 bg-[#00000008]'}>
                <div className={'flex justify-between m-[0.313rem]'}>
                    <div className={'flex flex-row align-baseline'}>
                        <div className={'m-auto'}>
                            <CourseHomepageSVG/>
                        </div>
                        <a className={'ml-2 text-primary text-[1.563rem] font-light hover:underline'}>
                            {`${course.name}, Tip-S, Sem-${course.semester}, Zi (2023-2024)`}
                        </a>
                    </div>
                    <KeySVG classes={'text-text-primary'}/>
                </div>

                <div className={'mt-[0.938rem] m-[0.313rem] flex justify-between'}>
                    <div className={'font-normal text-[#1D2125] text-[0.875rem]'}>
                        Formator:
                        <span className={'text-primary cursor-pointer ml-2 hover:underline hover:decoration-1'}>
                            {course.seminar.professor}
                        </span>
                    </div>
                    <div className={'w-[55%] font-normal text-[#1D2125] text-[0.875rem]'}>
                        {course.university} / {course.specialization} / Anul {course.year}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CourseContainer;