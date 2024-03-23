const express = require('express');
const { client } = require('../config');

const router = express.Router();

router.get('/getCourses', async (req, res) => {
    try {
        const {username} = req.query;

        if (username) {
            const query = 'SELECT id_year, id_university, id_group FROM student WHERE username = $1';
            const result = await client.query(query, [username]);

            if(!result.rows) {
                return res.status(404).json({success: false, data: 'There has been an error processing the request'});
            }

            if(result.rows.length > 0) {
                const { id_year, id_university, id_group } = result.rows[0];

                if(id_year && id_university && id_group) {
                    const finalResult = {};
                    const query = 'SELECT * FROM subject WHERE id_year = $1 AND id_university = $2';
                    const result = await client.query(query, [id_year, id_university]);

                    if(!result.rows) {
                        return res.status(404).json({success: false, data: 'There has been an error processing the request'});
                    }

                    for (const row of result.rows) {
                        const queryCourses = 'SELECT * FROM course WHERE id_subject = $1 AND id_group = $2';
                        const resultCourses = await client.query(queryCourses, [row.id_subject, id_group]);

                        const queryProfessor = 'SELECT * FROM professor WHERE username = $1';
                        const resultProfessorCourse = await client.query(queryProfessor, [resultCourses.rows[0].username]);
                        resultCourses.rows[0].professor = resultProfessorCourse.rows[0].name + ' ' + resultProfessorCourse.rows[0].surname;

                        const querySeminare = 'SELECT * FROM seminar WHERE id_subject = $1 AND id_group = $2';
                        const resultSeminare = await client.query(querySeminare, [row.id_subject, id_group]);
                        const resultProfessorSeminar = await client.query(queryProfessor, [resultSeminare.rows[0].username]);
                        resultSeminare.rows[0].professor = resultProfessorSeminar.rows[0].name + ' ' + resultProfessorSeminar.rows[0].surname;

                        const queryUniversity = 'SELECT * FROM university WHERE id_university = $1';
                        const resultUniversity = await client.query(queryUniversity, [row.id_university]);

                        finalResult[row.id_subject] = {
                            name: row.name_subject,
                            year: row.id_year,
                            university: resultUniversity.rows[0].main_university,
                            specialization: resultUniversity.rows[0].name,
                            semester: row.id_semester,
                            course: resultCourses.rows[0],
                            seminar: resultSeminare.rows[0]
                        };

                    }

                    return res.status(200).json({success: true, data: finalResult});
                }
            }
        }
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getSpecificCourse', async (req, res) => {
    try {
        const {id} = req.query;
        const type = id.slice(0, 1);
        const idCourse = id.slice(1);

        let result;
        if (type === 'c') {
            const query = 'SELECT * FROM course WHERE id_course = $1';
            result = await client.query(query, [idCourse]);
        } else if(type === 's') {
            const query = 'SELECT * FROM seminar WHERE id_seminar = $1';
            result = await client.query(query, [idCourse]);
        }

        if(!result.rows) {
            return res.status(404).json({success: false, data: 'There has been an error processing the request'});
        }

        const {id_subject} = result.rows[0];
        const querySubject = 'SELECT * FROM subject WHERE id_subject = $1';
        const resultSubject = await client.query(querySubject, [id_subject]);

        const completeCourse = {
            subject: resultSubject.rows[0],
            course: result.rows[0]
        };

        return res.status(200).json({success: true, data: completeCourse});
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

module.exports = router;