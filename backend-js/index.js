const express = require('express');
const cors = require('cors');
const { client, clientMongo } = require('./config');
const authRoutes = require('./server/authRoutes');
const coursesRoutes = require('./server/coursesRoutes');
const activitiesRoutes = require('./server/activitiesRoutes');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

client.connect();
clientMongo.connect();

app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);
app.use('/activities', activitiesRoutes);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

process.on('exit', () => {
    client.end();
    clientMongo.close();
    console.log('Client PostgreSQL disconnected on app exit');
});