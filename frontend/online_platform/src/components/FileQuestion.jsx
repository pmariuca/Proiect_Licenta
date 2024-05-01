import {useCallback, useEffect, useRef, useState} from "react";
import {FILE_QUESTION} from "../utils/content";

function FileQuestion(params) {
    const {questions, currentQuestion, handleSubmit} = params;
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const addedSpan = document.getElementById('addedFile');
        addedSpan.style.display = 'none';
    }, [currentQuestion]);

    const handleDragIn = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleDragOut = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
    }, []);

    const handleDragOver = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
            setDragging(true);
        }
    }, []);

    const handleDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            if(file) {
                handleFileUpload(file);
            }
            event.dataTransfer.clearData();
        }
    }, []);

    const handleFileUpload = (file) => {
        const addedSpan = document.getElementById('addedFile');
        addedSpan.style.display = 'block';
        addedSpan.innerText = `Ați adăugat fișierul ${file.name}`;
        handleSubmit(file);
    };

    const handleFileSelectClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className={'mt-4 pl-4'}>
            <div className={'text-justify'}>
                {questions[currentQuestion]?.question}
            </div>

            <div
                className={`drop-zone ${dragging ? 'dragging' : ''}`}
                onClick={handleFileSelectClick}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >

                <span>
                    {FILE_QUESTION.ADD}
                </span>

                <span id={'addedFile'}>
                    Ați adăugat fișierul
                </span>

                <input
                    type="file"
                    style={{display: 'none'}}
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e.target.files)}
                />
            </div>
        </div>
    )
}

export default FileQuestion;