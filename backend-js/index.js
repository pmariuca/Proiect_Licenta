const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { client, clientMongo } = require('./config');
const authRoutes = require('./server/authRoutes');
const coursesRoutes = require('./server/coursesRoutes');
const activitiesRoutes = require('./server/activitiesRoutes');
const questionsRoutes = require('./server/questionsRoutes');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8080']
}));
app.use((req, res, next) => {
    req.io = io;
    next();
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:8080'],
        methods: ["GET", "POST"]
    }
});

client.connect();
clientMongo.connect();

app.use('/auth', authRoutes);
app.use('/courses', coursesRoutes);
app.use('/activities', activitiesRoutes);
app.use ('/questions', questionsRoutes);

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3001, () => {
    console.log('Server is running on port 3001 with Socket.IO');
});

process.on('exit', () => {
    client.end();
    clientMongo.close();
    console.log('Client PostgreSQL disconnected on app exit');
});

module.exports = io;