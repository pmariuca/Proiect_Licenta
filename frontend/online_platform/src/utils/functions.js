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