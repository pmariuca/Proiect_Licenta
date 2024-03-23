import { startOfWeek, endOfWeek, eachWeekOfInterval, format } from 'date-fns';
import { ro } from 'date-fns/locale';
import {globalSlice} from "../store/slices/globalSlice";

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
    console.log(dateString)
    const days = ["duminică", "luni", "marți", "miercuri", "joi", "vineri", "sâmbătă"];
    const months = ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"];

    let date = new Date(dateString);
    date.setFullYear(2024);

    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];

    return `${dayOfWeek}, ${dayOfMonth} ${month} ${date.getFullYear()}`;
}