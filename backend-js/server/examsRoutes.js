const express = require('express');
const {clientMongo, client} = require('../config');
const serviceAccount = require('../screenshots-d1cba-firebase-adminsdk-n49a5-829e49782c.json');
const serviceAccountFiles = require('../examfiles-7a4d6-firebase-adminsdk-35jsz-f42602ae74.json');
const admin = require('firebase-admin');
const {join, basename, dirname} = require('path');
const {tmpdir} = require('os');
const {createWriteStream, createReadStream, unlinkSync, promises, writeFileSync, unlink} = require('fs');
const archiver = require('archiver');
const PDFDocument = require('pdfkit');
const analyzeContent = require("../vertex");
const Excel = require('exceljs');
const {checkRole} = require("../utils/functions");
const router = express.Router();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET_SCREENSHOTS,
}, 'screenshots');

const bucket = admin.app('screenshots').storage().bucket();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountFiles),
    storageBucket: process.env.FIREBASE_BUCKET_FILES,
}, 'filesBucketDownload');

const bucketFiles = admin.app('filesBucketDownload').storage().bucket();

router.get('/getNoOfSubmits', async(req, res) => {
   try {
       const {activityID} = req.query;

       const examsDatabase = clientMongo.db('Exams');
       const exams = examsDatabase.collection('Exams');

       const exam = await exams.findOne({ activityID: activityID });
       const noOfSubmits = exam ? exam.submits.length : 0;

       return res.status(200).json({'noOfSubmits': noOfSubmits});
   } catch (error) {
       console.log('There has been an error processing the request: ', error);
   }
});

router.get('/getScreenshots', async(req, res) => {
    try {
        const { activityID } = req.query;
        const folderPath = `${activityID}/`;
        const tempFilePath = join(tmpdir(), `${activityID}.zip`);
        const output = createWriteStream(tempFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            res.download(tempFilePath, `${activityID}.zip`, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                } else {
                    console.log('Archive has been downloaded');
                }
            });
        });

        archive.on('error', (err) => {
            console.error('Archiving error:', err);
            res.status(500).json({ error: 'Failed to create archive' });
        });

        archive.pipe(output);

        const [files] = await bucket.getFiles({ prefix: folderPath });
        if (files.length === 0) {
            return res.status(404).json({'message': 'No screenshots found for this activity.'});
        }

        for (const file of files) {
            const relativePath = file.name.replace(folderPath, '');
            const tempLocalFile = join(tmpdir(), relativePath);

            const dirPath = dirname(tempLocalFile);
            if (dirPath !== '.') {
                await promises.mkdir(dirPath, { recursive: true });
            }

            await file.download({ destination: tempLocalFile });
            archive.append(createReadStream(tempLocalFile), { name: relativePath });
        }

        archive.finalize();
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getAllResults', async(req, res) => {
    try {
        const { activityID } = req.query;

        const examsDatabase = clientMongo.db('Exams');
        const exams = examsDatabase.collection('Exams');

        const query = { activityID: activityID };
        const exam = await exams.findOne(query);

        const doc = new PDFDocument();
        const filePath = join(__dirname, `results-${activityID}.pdf`);

        const stream = doc.pipe(createWriteStream(filePath));

        doc.fontSize(12).text(JSON.stringify(exam, null, 2), {
            wrap: true,
            indent: 20
        });

        doc.end();

        stream.on('finish', function () {
            res.download(filePath, `results-${activityID}.pdf`, (err) => {
                if (err) {
                    console.error(err);
                    if (!res.headersSent) {
                        res.status(500).send('Error occurred');
                    }
                } else {
                    unlinkSync(filePath);
                }
            });
        });
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getAllFiles', async(req, res) => {
    try {
        const { activityID } = req.query;

        const [files] = await bucketFiles.getFiles({ prefix: `${activityID}/` });
        if (files.length === 0) {
            return res.status(404).json({'message': 'No files found for this activity.'});
        }

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${activityID}.zip"`);

        archive.on('error', function(err) {
            throw err;
        });

        archive.pipe(res);

        files.forEach(file => {
            const fullPath = file.metadata.name;
            const relativePath = fullPath.slice(activityID.length + 1);
            archive.append(bucketFiles.file(fullPath).createReadStream(), { name: relativePath });
        });

        await archive.finalize();
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getStudentResultsFiles', async(req, res) => {
    try {
        const { activityID, username } = req.query;

        const prefix = `${activityID}/${username}/`;
        const [files] = await bucketFiles.getFiles({
            prefix: prefix,
            delimiter: '/'
        });
        if (files.length === 0) {
            return res.status(404).json({'message': 'No files found for this activity.'});
        }

        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${activityID}-${username}.zip"`);

        archive.on('error', function(err) {
            throw err;
        });

        archive.pipe(res);

        files.forEach(file => {
            const fullPath = file.metadata.name;
            const relativePath = fullPath.substring(prefix.length);
            archive.append(bucketFiles.file(fullPath).createReadStream(), { name: relativePath });
        });

        await archive.finalize();
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getStudentsSubmits', async(req, res) => {
    try {
        const {activityID} = req.query;

        const examsDatabase = clientMongo.db('Exams');
        const exams = examsDatabase.collection('Exams');

        const exam = await exams.findOne({ activityID: activityID });
        let studentsSubmits = [];
        if(exam) {
            for (const submit of exam.submits) {
                studentsSubmits.push(submit.username);
            }
        }

        return res.status(200).json({'studentsSubmits': studentsSubmits});
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getStudentResultsScreenshots', async(req, res) => {
    try {
        const {activityID, username} = req.query;

        const studentFolderPath = `${activityID}/${username}/`; // Folder path includes the student's username
        const tempFilePath = join(tmpdir(), `${username}-${activityID}.zip`);
        const output = createWriteStream(tempFilePath);
        const archive = archiver('zip', { zlib: { level: 9 }});

        output.on('close', () => {
            res.download(tempFilePath, `${username}-${activityID}.zip`, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                } else {
                    console.log('Student archive has been downloaded');
                }
                // Make sure to delete the temporary file after sending the response
                unlink(tempFilePath, (err) => {
                    if (err) console.error('Error deleting temp file:', err);
                });
            });
        });

        archive.on('error', (err) => {
            console.error('Archiving error:', err);
            res.status(500).json({ error: 'Failed to create archive' });
        });

        archive.pipe(output);

        const [files] = await bucket.getFiles({ prefix: studentFolderPath });
        if (files.length === 0) {
            return res.status(404).json({'message': 'No screenshots found for this student.'});
        }

        files.forEach(file => {
            const relativePath = file.name.replace(studentFolderPath, '');
            if (relativePath) { // Check if the file is not just the directory itself
                archive.append(bucket.file(file.name).createReadStream(), { name: relativePath });
            }
        });

        archive.finalize();
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getStudentResultsData', async(req, res) => {
    try {
        const {activityID, username} = req.query;

        const examsDatabase = clientMongo.db('Exams');
        const exams = examsDatabase.collection('Exams');

        const query = { activityID: activityID, 'submits.username': username };
        const projection = { 'submits.$': 1 };
        const exam = await exams.findOne(query, { projection });

        if (exam) {
            const doc = new PDFDocument();
            const filePath = join(__dirname, `results-${activityID}-${username}.pdf`);

            const stream = doc.pipe(createWriteStream(filePath));

            doc.fontSize(12).text(JSON.stringify(exam, null, 2), {
                wrap: true,
                indent: 20
            });

            doc.end();

            stream.on('finish', function () {
                res.download(filePath, `results-${activityID}-${username}.pdf`, (err) => {
                    if (err) {
                        console.error(err);
                        if (!res.headersSent) {
                            res.status(500).send('Error occurred');
                        }
                    } else {
                        unlinkSync(filePath);
                    }
                });
            });
        } else {
            res.status(404).json({ 'message': 'No results found for the provided activityID and username.' });
        }
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.post('/analyzeFraud', async(req, res) => {
    try {
        const { activityID, username, openFiles } = req.body;
        await analyzeContent(activityID, username, openFiles).then(async (response) => {
            console.log('Răspunsul este:', response);

            const examsDatabase = clientMongo.db('Exams');
            const exams = examsDatabase.collection('Exams');

            await exams.updateOne(
                {
                    "activityID": activityID,
                    "submits.username": username
                },
                {
                    $set: {
                        "submits.$.fraudAssessmentAI": response
                    }
                }
            );

            res.status(200).json({ message: 'Data received and added successfully.' });
        })
            .catch((error) => {
                console.error('There has been an error processing the request:', error);
                res.status(404).json({ message: 'There has been an error processing the request.' });
            });
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getAttendance', async(req, res) => {
    try {
        const { activityID } = req.query;

        const database = clientMongo.db('Activities');
        const activities = database.collection('Activities');

        const document = await activities.findOne(
            { activityID: activityID, attendance: { $exists: true } },
            { projection: { attendance: 1 } }
        );

        if (document) {
            res.status(200).json({message: 'Attendance data found.'});
        } else {
            res.status(400).json({ message: 'No attendance data found for the provided activityID.' });
        }
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getAttendancePDF', async(req, res) => {
    try {
        const { activityID } = req.query;

        const database = clientMongo.db('Activities');
        const activities = database.collection('Activities');

        const document = await activities.findOne(
            { activityID: activityID, attendance: { $exists: true } },
            { projection: { attendance: 1 } }
        );

        if (document && document.attendance) {
            const doc = new PDFDocument();
            const filePath = join(__dirname, `attendance-${activityID}.pdf`);
            const stream = doc.pipe(createWriteStream(filePath));

            doc.font('D:\\Learning\\Proiect_Licenta\\DejaVuSans.ttf');

            doc.fontSize(16).text('Prezenta', { underline: true });

            doc.moveDown(2);

            const startX = 50;
            const startY = 100;
            const columnWidth = 300;
            const spaceForPresence = 100;
            const endX = startX + columnWidth + spaceForPresence;

            doc.fontSize(12);
            doc.text('Student', startX + 2, startY + 4, { width: columnWidth, align: 'left' })
                .moveTo(startX + columnWidth, startY)
                .lineTo(startX + columnWidth, startY + 20 * (document.attendance.length + 1))
                .stroke()
                .text('Prezenta', startX + 2 + columnWidth, startY + 4, { width: spaceForPresence, align: 'left' });

            let positionY = startY + 20;

            for (const username of document.attendance) {
                const query = 'SELECT * FROM student WHERE username = $1';
                const result = await client.query(query, [username]);
                const { name, surname } = result?.rows[0];

                const fullName = name + ' ' + surname;

                doc.text(fullName, startX + 2, positionY + 4, { width: columnWidth, align: 'left' });
                doc.text('', startX + columnWidth, positionY, { width: spaceForPresence, align: 'left' });
                positionY += 20;
            }

            doc.moveTo(startX, startY)
                .lineTo(endX, startY)
                .stroke();

            for (let i = 0; i <= document.attendance.length; i++) {
                doc.moveTo(startX, startY + 20 * i)
                    .lineTo(endX, startY + 20 * i)
                    .stroke();
            }

            doc.moveTo(startX, startY)
                .lineTo(startX, positionY)
                .stroke();
            doc.moveTo(endX, startY)
                .lineTo(endX, positionY)
                .stroke();

            doc.moveTo(startX, positionY)
                .lineTo(endX, positionY)
                .stroke();

            doc.end();

            stream.on('finish', function () {
                res.download(filePath, `attendance-${activityID}.pdf`, (err) => {
                    if (err) {
                        console.error('Error downloading the file:', err);
                        if (!res.headersSent) {
                            res.status(500).send('Error occurred during file download');
                        }
                    } else {
                        unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting the file:', unlinkErr);
                            }
                        });
                    }
                });
            });
        } else {
            res.status(404).send('No attendance data found');
        }
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getAttendanceExcel', async(req, res) => {
    try {
        const { activityID } = req.query;

        const database = clientMongo.db('Activities');
        const activities = database.collection('Activities');

        const document = await activities.findOne(
            { activityID: activityID, attendance: { $exists: true } },
            { projection: { attendance: 1 } }
        );

        if (document) {
            const workbook = new Excel.Workbook();
            const sheet = workbook.addWorksheet('Attendance');

            sheet.columns = [
                { header: 'Student', key: 'name', width: 30 },
                { header: 'Prezenta', key: 'presence', width: 20 }
            ];

            for (const username of document.attendance) {
                const query = 'SELECT * FROM student WHERE username = $1';
                const result = await client.query(query, [username]);
                const { name, surname } = result?.rows[0];

                sheet.addRow({ name: name + ' ' + surname, presence: '' });
            }

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="attendance-${activityID}.xlsx"`);

            workbook.xlsx.write(res).then(function () {
                res.status(200).end();
            });
        } else {
            console.log('No attendance found or activity does not exist.');
            res.status(404).send('No attendance found or activity does not exist');
        }
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

module.exports = router;