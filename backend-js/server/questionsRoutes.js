const express = require('express');
const {clientMongo} = require("../config");
const serviceAccount = require('../examfiles-7a4d6-firebase-adminsdk-35jsz-f42602ae74.json');
const admin = require('firebase-admin');
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET_FILES,
}, 'filesBucket');

const bucket = admin.app('filesBucket').storage().bucket();

router.get('/getQuestions', async (req, res) => {
    try {
        const {numberOfQuestions} = req.query;

        const database = clientMongo.db('Questions');
        const questions = database.collection('Questions');

        const result = await questions.aggregate([
            {$sample: {size: Number(numberOfQuestions)}}
        ]).toArray();

        if (result.size === 0) {
            return res.status(404).json({success: false, data: 'There has been an error processing the request'});
        }

        return res.status(200).json({success: true, data: result});
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getQuestionsFile', async (req, res) => {
    try {
        const {numberOfQuestions} = req.query;

        const database = clientMongo.db('FileQuestions');
        const questions = database.collection('FileQuestions');

        const result = await questions.aggregate([
            {$sample: {size: Number(numberOfQuestions)}}
        ]).toArray();

        if (result.size === 0) {
            return res.status(404).json({success: false, data: 'There has been an error processing the request'});
        }

        return res.status(200).json({success: true, data: result});
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.post('/submitAnswers', async (req, res) => {
    try {
        const {username, activityID, answers, fraudAttempts} = req.body;

        const examsDatabase = clientMongo.db('Exams');
        const exams = examsDatabase.collection('Exams');

        const submission = { username, answers, fraudAttempts };
        const updateResult = await exams.updateOne(
            { activityID: activityID },
            { $push: { submits: submission } }
        );

        if(updateResult.modifiedCount === 0) {
            return res.status(404).json({success: false, data: 'There has been an error processing the request'});
        }

        res.status(200).send({ message: 'Answers submitted successfully' });
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.post('/submitResultsFile', upload.array('files'), async (req, res) => {
    try {
        const files = req.files;
        const username = req.body.username;
        const activityID = req.body.activityID;
        const fraudAttempts = JSON.parse(req.body.fraudAttempts);

        const examsDatabase = clientMongo.db('Exams');
        const exams = examsDatabase.collection('Exams');

        await Promise.all(files.map(file => {
            const blob = bucket.file(`${activityID}/${username}/${file.originalname}`);
            const blobStream = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });

            return new Promise((resolve, reject) => {
                blobStream.on('error', reject);
                blobStream.on('finish', resolve);
                blobStream.end(file.buffer);
            });
        }));

        const answers = [];
        const submission = { username, answers, fraudAttempts };
        const updateResult = await exams.updateOne(
            { activityID: activityID },
            { $push: { submits: submission } }
        );

        if(updateResult.modifiedCount === 0) {
            throw new Error('No document was updated. Check if the activityID is correct.');
        }

        res.status(200).json({ success: true, data: 'Files have been uploaded successfully' });
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.post('/stopTest', async (req, res) => {
    try {
        req.io.emit('testStopped', { message: 'Test has been stopped.' });
        res.status(200).send({ message: 'Test stopped.' });
    } catch (error) {
        console.log('Error stopping test: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/monitorData', async (req, res) => {
    try {
        const {username, activityID, OpenedProcesses, OpenedTabs, OpenedFiles } = req.body;
        const monitorApp = {
            'openedProcesses': OpenedProcesses,
            'openedTabs': OpenedTabs,
            'openedFiles': OpenedFiles
        }

        const examsDatabase = clientMongo.db('Exams');
        const exams = examsDatabase.collection('Exams');

        const result = await exams.updateOne(
            {
                "activityID": activityID,
                "submits.username": username
            },
            {
                $set: {
                    "submits.$.monitorApp": monitorApp
                }
            }
        );

        res.status(200).json({ message: 'Data received and added successfully.' });
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

module.exports = router;