const express = require('express');
const {clientMongo} = require('../config');
const serviceAccount = require('../screenshots-d1cba-firebase-adminsdk-n49a5-829e49782c.json');
const serviceAccountFiles = require('../examfiles-7a4d6-firebase-adminsdk-35jsz-f42602ae74.json');
const admin = require('firebase-admin');
const {join, basename, dirname} = require('path');
const {tmpdir} = require('os');
const {createWriteStream, createReadStream, unlinkSync, promises, writeFileSync, unlink} = require('fs');
const archiver = require('archiver');
const PDFDocument = require('pdfkit');
const analyzeContent = require("../vertex");
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
        await analyzeContent(activityID, username, openFiles).then((response) => {
            console.log('Răspunsul este:', response);
        })
            .catch((error) => {
                console.error('A apărut o eroare:', error);
            });
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

module.exports = router;