import {QUESTION_PAGE} from "../utils/content";

function ChoiceQuestion(params) {
    const {questions, currentQuestion, renderQuestions, formatTimeLeft} = params;

    return (
        <div className={'p-4 w-full bg-question'}>
            <div className={'w-full flex justify-between items-center'}>
                <span>
                    {questions[currentQuestion]?.question?.query}
                </span>

                <div className={'border-2 border-red-700 border-solid p-2'}>
                    {QUESTION_PAGE.TIME_LEFT}{formatTimeLeft()}
                </div>
            </div>

            <div>
                <ul>
                    {renderQuestions}
                </ul>
            </div>
        </div>
    );
};

export default ChoiceQuestion;