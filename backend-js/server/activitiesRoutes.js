const express = require('express');
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
            { $match: { "course_id": course, "course_type": type } },
            { $unwind: "$weeks" },
            { $match: { "weeks.start": { $lte: start }, "weeks.end": { $gte: end } } },
            { $replaceRoot: { newRoot: "$weeks" } },
            { $unwind: "$activities" },
            { $replaceRoot: { newRoot: "$activities" } }
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

module.exports = router;
