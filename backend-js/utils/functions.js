const {existsSync, readdirSync, lstatSync, unlinkSync, rmdirSync} = require("fs");
const {join} = require("path");

function checkRole(username) {
    const signature = username.split('@')[1];
    if(signature.startsWith('stud')) {
        return 'student';
    } else {
        return 'professor';
    }
}

function convertDate(date) {
    const months = {
        "ianuarie": "01",
        "februarie": "02",
        "martie": "03",
        "aprilie": "04",
        "mai": "05",
        "iunie": "06",
        "iulie": "07",
        "august": "08",
        "septembrie": "09",
        "octombrie": "10",
        "noiembrie": "11",
        "decembrie": "12"
    };

    const parts = date.trim().split(' ');
    const day = parts[0].padStart(2, '0');
    const month = months[parts[1].toLowerCase()];

    return `2024-${month}-${day}`;
}

module.exports = {
    checkRole,
    convertDate,
}