const express = require('express');
const cors = require('cors');
const { client } = require('./config');
const authRoutes = require('./server/authRoutes');
const coursesRoutes = require('./server/coursesRoutes');

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

client.connect();

app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

process.on('exit', () => {
    client.end();
    console.log('Client PostgreSQL disconnected on app exit');
});