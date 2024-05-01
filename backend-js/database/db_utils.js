const admin = require('firebase-admin');
const {client} = require('../config');
const serviceAccount = require('../licenta-de643-firebase-adminsdk-mcjcm-15715bb87c.json');
const bcrypt = require('bcrypt');

require('dotenv').config({
    path: '../.env'
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET,
});

async function insertStudent(student) {
    try {
        await client.connect();
        const query = 'INSERT INTO student ' +
            '(username, name, surname, contact_email, password, salt, id_group, id_university, id_year) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';

        const values = [student.username, student.name, student.surname, student.contact_email, student.password, student.salt,  student.id_group, student.id_university, student.id_year];

        await client.query(query, values);
        await insertPhoto(student.image_path);
        console.log('The student was inserted successfully!');
    } catch (error) {
        console.error('Error at inserting: ', error);
    } finally {
        await client.end();
    }
}

async function insertProfessor(professor) {
    try {
        await client.connect();
        const query = 'INSERT INTO professor ' +
            '(username, name, surname, password, salt, id_university) ' +
            'VALUES ($1, $2, $3, $4, $5, $6)';

        const values = [professor.username, professor.name, professor.surname, professor.password, professor.salt, professor.id_university];

        await client.query(query, values);
        console.log('The professor was inserted successfully!');
    } catch (error) {
        console.error('Error at inserting: ', error);
    } finally {
        await client.end();
    }
}

function generatePassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return { salt: salt, hash: hash };
}

async function insertPhoto(path) {
    try {
        const bucket = admin.storage().bucket();
        await bucket.upload(path);
        console.log('The photo was uploaded successfully!');
    } catch (error) {
        console.error('Error at inserting: ', error);
    }
}

const pass = generatePassword('JKCwjxATKxrj');
const student = {
    username: 'popescusimona21@stud.ase.ro',
    name: 'Popescu',
    surname: 'Simona Gabriela',
    contact_email: 'popescu_simona@yahoo.com',
    password: pass.hash,
    salt: pass.salt,
    id_group: 1094,
    id_university: 1,
    id_year: 3,
    image_path: 'D:\\Learning\\Proiect_Licenta\\poze\\popescusimona21@stud.ase.ro.jpeg'
};

// insertStudent(student);
