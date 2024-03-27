const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');
const { client } = require('../config');
const {checkRole} = require("../utils/functions");

const router = express.Router();

router.post('/login', async (req, res) => {
   try {
       const { username, pass } = req.body;

       const role = checkRole(username);

       let result;
       if(role === 'student') {
           const query = 'SELECT * FROM student WHERE username = $1';
           result = await client.query(query, [username]);
       } else if(role === 'professor'){
           const query = 'SELECT * FROM professor WHERE username = $1';
           result = await client.query(query, [username]);
       }

       if(!result.rows[0]) {
           return res.status(404).json({success: false, data: 'Invalid credentials'});
       }

       const { password, name, surname } = result.rows[0];
       const match = await bcrypt.compare(pass, password);

       if(!match) {
           return res.status(401).json({success: false, data: 'Invalid credentials'});
       }

       const token = jwt.sign({id: username}, process.env.JWT_SECRET_KEY, {
           expiresIn: '5h'
       });

       return res.status(200).json({success: true, data: {'token': token, 'name': name, 'surname': surname}});
   } catch (error) {
       console.log('There has been an error processing the request: ', error);
   }
});

router.get('/checkToken', async (req, res) => {
    try {
        const { token } = req.query;

        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(verified) {
            return res.status(200).json({success: true, data: 'Token is valid'});
        } else {
            return res.status(401).json({success: false, data: 'Token is invalid'});
        }
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            localStorage?.removeItem('token');
        } else {
            console.log('There has been an error processing the request: ', error);
        }
    }
});

router.post('/checkLoggedIn', async (req, res) => {
    try {
        const { token } = req.body;

        if(token) {
            const {id} = jwtDecode(token);

            const role = checkRole(id);

            let result;
            if(role === 'student') {
                const query = 'SELECT * FROM student WHERE username = $1';
                result = await client.query(query, [id]);
            } else if(role === 'professor'){
                const query = 'SELECT * FROM professor WHERE username = $1';
                result = await client.query(query, [id]);
            }

            if(!result.rows[0]) {
                return res.status(404).json({success: false, data: 'Invalid credentials'});
            }

            const { name, surname } = result.rows[0];
            return res.status(200).json({success: true, data: {'username': id, 'name': name, 'surname': surname}});
        }
    } catch (error) {
        console.log('There has been an error processing the request: ', error);
    }
});

module.exports = router;