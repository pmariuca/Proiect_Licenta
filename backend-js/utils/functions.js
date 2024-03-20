function checkRole(username) {
    const signature = username.split('@')[1];
    if(signature.startsWith('stud')) {
        return 'student';
    } else {
        return 'professor';
    }
}

module.exports = {
    checkRole
}