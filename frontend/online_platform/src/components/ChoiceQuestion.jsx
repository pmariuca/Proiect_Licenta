function ChoiceQuestion(params) {
    const {questions, currentQuestion, renderQuestions} = params;

    return (
        <div className={'mt-4 pl-4'}>
        <span>
            {questions[currentQuestion]?.question?.query}
        </span>

        <div>
            <ul>
                {renderQuestions}
            </ul>
        </div>
    </div>
    );
};

export default ChoiceQuestion;