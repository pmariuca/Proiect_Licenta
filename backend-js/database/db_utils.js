const { Client } = require('pg');
const bcrypt = require('bcrypt');
const fs = require('fs');
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

async function insertStudent(student) {
    try {
        await client.connect();
        const query = 'INSERT INTO student ' +
            '(username, name, surname, contact_email, password, salt, image_data, id_group, id_university, id_year) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';

        const values = [student.username, student.name, student.surname, student.contact_email, student.password, student.salt, student.image_data, student.id_group, student.id_university, student.id_year];

        await client.query(query, values);
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

function generateBytea(path) {
    const image = fs.readFileSync(path);
    return Buffer.from(image);
}