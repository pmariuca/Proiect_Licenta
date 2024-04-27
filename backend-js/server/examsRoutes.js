const express = require('express');
const {clientMongo} = require('../config');
const serviceAccount = require('../screenshots-d1cba-firebase-adminsdk-n49a5-829e49782c.json');
const admin = require('firebase-admin');
const {join, basename, dirname} = require('path');
const {tmpdir} = require('os');
const {createWriteStream, createReadStream, unlinkSync, promises} = require('fs');
const archiver = require('archiver');


const router = express.Router();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET_SCREENSHOTS,
});

router.get('/getNoOfSubmits', async(req, res) => {
   try {
       const {activityID} = req.query;

       const examsDatabase = clientMongo.db('Exams');
       const exams = examsDatabase.collection('Exams');

       const noOfSubmits = await exams.countDocuments({ activityID: activityID, 'submits.0': { $exists: true }});

       return res.status(200).json({'noOfSubmits': noOfSubmits});
   } catch (error) {
       console.log('There has been an error processing the request: ', error);
   }
});

router.get('/getScreenshots', async(req, res) => {
    try {
        const { activityID } = req.query;
        const bucket = admin.storage().bucket();
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
            return res.status(404).json('No screenshots found for this activity.');
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

module.exports = router;