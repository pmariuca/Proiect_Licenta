const express = require('express');
const moment = require('moment-timezone');
const {convertDate} = require("../utils/functions");
const {clientMongo} = require("../config");

const router = express.Router();

router.get('/getWeekActivities', async (req, res) => {
    try {
        const { weekStart, weekEnd, course, type } = req.query;
        const start = convertDate(weekStart);
        const end = convertDate(weekEnd);

        const database = clientMongo.db('Courses');
        const weeks = database.collection('Weeks');

        const pipeline = [
            { $match: { 'course_id': course, 'course_type': 'Tip-' + type } },
            { $unwind: '$weeks' },
            { $match: {
                'weeks.start': { $lte: start },
                'weeks.end': { $gte: end }
            } },
            { $replaceRoot: { newRoot: '$weeks' } },
            { $unwind: '$activities' },
            { $replaceRoot: { newRoot: '$activities' } }
        ];

        const activities = await weeks.aggregate(pipeline).toArray();
        if(activities.length === 0) {
            return res.status(201).json([]);
        }

        return res.status(200).json(activities);
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.post('/addActivity', async (req, res) => {
    try {
        const { activityDetails } = req.body;

        const database = clientMongo.db('Activities');
        const activities = database.collection('Activities');

        let id;
        if(activityDetails.type_of_disponibility.interval === true) {
            id = activityDetails.courseInfo.type.toLowerCase() + activityDetails.courseInfo.course + moment(activityDetails.disponibility.startDate).tz('Europe/Bucharest').format('YYYY-MM-DD');
        } else {
            id = activityDetails.courseInfo.type.toLowerCase() + activityDetails.courseInfo.course + moment(activityDetails.disponibility.limitDate).tz('Europe/Bucharest').format('YYYY-MM-DD');
        }

        activityDetails.activityID = id;

        await activities.insertOne(activityDetails);

        const courseId = activityDetails.courseInfo.course;
        const courseType = activityDetails.courseInfo.type;

        const weekStart = moment(activityDetails.week.start).tz('Europe/Bucharest').format('YYYY-MM-DD');
        const weekEnd = moment(activityDetails.week.end).tz('Europe/Bucharest').format('YYYY-MM-DD');

        const courseActivity = {
            activityID: id,
            activity_title: activityDetails.details.name,
            activity_description: activityDetails.details.description
        };
        if(activityDetails.type_of_disponibility.interval === true) {
            courseActivity.open = {
                date: moment(activityDetails.disponibility.startDate).tz('Europe/Bucharest').format('YYYY-MM-DD'),
                hour: activityDetails.disponibility.startTime
            };
            courseActivity.close = {
                date: moment(activityDetails.disponibility.endDate).tz('Europe/Bucharest').format('YYYY-MM-DD'),
                hour: activityDetails.disponibility.endTime
            }
        } else {
            courseActivity.limit = {
                date: moment(activityDetails.disponibility.limitDate).tz('Europe/Bucharest').format('YYYY-MM-DD'),
                hour: activityDetails.disponibility.endTime
            };
        }

        const weeksDatabase = clientMongo.db('Courses');
        const weeks = weeksDatabase.collection('Weeks');

        await weeks.updateOne(
            {
                'course_id': courseId,
                'course_type': 'Tip-' + courseType,
                'weeks.start': { $lte: weekStart },
                'weeks.end': { $gte: weekEnd }
            },
            {
                $push: { 'weeks.$.activities': courseActivity }
            }
        );

        const examsDatabase = clientMongo.db('Exams');
        const exams = examsDatabase.collection('Exams');

        await exams.insertOne({
            'activityID': id,
            'submits': []
        });

        return res.status(200).json({ message: 'Activity added successfully' });

    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/getActivityDetails', async (req, res) => {
    try {
        const { activityID } = req.query;

        const database = clientMongo.db('Activities');
        const activities = database.collection('Activities');

        const activity = await activities.findOne({ activityID });

        return res.status(200).json(activity);
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

router.get('/checkSubmissions', async (req, res) => {
   try {
       const { username, activityID } = req.query;

       const database = clientMongo.db('Exams');
       const exams = database.collection('Exams');

       const submissionExists = await exams.findOne(
           { activityID: activityID, "submits.username": username }
       );

       if (submissionExists) {
           res.status(200).send({ message: 'Submission found for this user.' });
       } else {
           res.status(403).send({ message: 'No submission found for this user.' });
       }
   } catch (error) {
       console.log('There has been an error processing the request: ', error);
   }
});

module.exports = router;
