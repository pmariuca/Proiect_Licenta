const admin = require('firebase-admin');
const serviceAccount = require('../licenta-de643-firebase-adminsdk-mcjcm-15715bb87c.json');
const { Client } = require('pg');
const bcrypt = require('bcrypt');

require('dotenv').config({
    path: '../.env'
});

const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

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

const pass = generatePassword('bFS9gdWa6n6M');
const student = {
    username: 'miciialaalessandro22@stud.ase.ro',
    name: 'Mîcîială',
    surname: 'Alessandro',
    contact_email: 'alexmiciiala@yahoo.com',
    password: pass.hash,
    salt: pass.salt,
    id_group: 1095,
    id_university: 1,
    id_year: 3,
    image_path: 'D:\\Learning\\Proiect_Licenta\\poze\\miciialaalessandro22@stud.ase.ro.jpeg'
};

insertStudent(student);
