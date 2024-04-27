import {startOfWeek, endOfWeek, eachWeekOfInterval, format, parse} from 'date-fns';
import { ro } from 'date-fns/locale';
import {globalSlice} from "../store/slices/globalSlice";
import {testSlice} from "../store/slices/testSlice";
import {courseSlice} from "../store/slices/courseSlice";

export function populateGlobalSlice(userData, dispatch) {
    const {username, name, surname, token} = userData;

    const signature = username.split('@')[1];
    let role;
    if(signature.startsWith('stud')) {
        role = 'student';
    } else {
        role = 'professor';
    }

    dispatch(globalSlice.actions.setLoggedIn(true));
    dispatch(globalSlice.actions.setToken(token));
    dispatch(globalSlice.actions.setUsername(username));
    dispatch(globalSlice.actions.setName(name));
    dispatch(globalSlice.actions.setSurname(surname));
    dispatch(globalSlice.actions.setRole(role));
}

export function populateTestSlice(testData, dispatch) {
    const {activity, questions} = testData;
    dispatch(testSlice.actions.setActivity(activity));
    dispatch(testSlice.actions.setQuestions(questions));
    dispatch(testSlice.actions.setCurrentQuestion(0));
    dispatch(testSlice.actions.setAnswers([]));
}

export function populateCourseSlice(data, dispatch) {
    const {courseID, courseData} = data;
    dispatch(courseSlice.actions.setCourseID(courseID));
    dispatch(courseSlice.actions.setCourseData(courseData));
}

export function getWeeks() {
    const semesterStart = new Date(2024, 1, 19);
    const semesterEnd = new Date(2024, 6, 7);

    const weeks = eachWeekOfInterval({
        start: semesterStart,
        end: semesterEnd
    }, {
        weekStartsOn: 1
    });

    const formattedWeeks = weeks.map(week => ({
        start: format(startOfWeek(week, { weekStartsOn: 1 }), 'd MMMM', { locale: ro }),
        end: format(endOfWeek(week, { weekStartsOn: 1 }), 'd MMMM', { locale: ro })
    }));

    return formattedWeeks;
}

export function formatDate(dateString) {
    const days = ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"];
    const months = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];

    let date = new Date(dateString);
    date.setFullYear(2024);

    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];

    return `${dayOfWeek}, ${dayOfMonth} ${month} ${date.getFullYear()}`;
}

export function parseDateFromString(dateString) {
    const months = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];
    const monthIndex = months.findIndex(month => dateString.includes(month));
    const day = dateString.split(' ')[0];

    const date = new Date(2024, monthIndex, day);

    return date;
}
export function verifyDate(disponibility) {
    const currentDateTime = new Date();
    if(!disponibility?.limitDate) {
        const startDateTime = new Date(`${disponibility?.startDate.substring(0, 11)}${disponibility?.startTime}:00.000Z`);
        const endDateTime = new Date(`${disponibility?.endDate.substring(0, 11)}${disponibility?.endTime}:00.000Z`);

        return currentDateTime >= startDateTime && currentDateTime <= endDateTime;
    } else {
        const limitDateTime = new Date(`${disponibility?.limitDate.substring(0, 11)}${disponibility?.endTime}:00.000Z`)

        return currentDateTime <=limitDateTime;
    }
}

export function downloadBlob(blob, filename) {
    const downloadUrl = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
}