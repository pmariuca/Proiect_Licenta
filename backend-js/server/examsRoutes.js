const express = require('express');
const {clientMongo} = require("../config");

const router = express.Router();

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

module.exports = router;