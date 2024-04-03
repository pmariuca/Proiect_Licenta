const express = require('express');
const {clientMongo} = require("../config");

const router = express.Router();

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

router.post('/submitAnswers', async (req, res) => {
    try {
        const {username, activityID, answers} = req.body;

        const examsDatabase = clientMongo.db('Exams');
        const exams = examsDatabase.collection('Exams');

        const submission = { username, answers };
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

module.exports = router;