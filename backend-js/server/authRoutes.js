const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { client } = require('../config');

const router = express.Router();

router.post('/login', async (req, res) => {
   try {
       const { username, pass } = req.body;

       const query = 'SELECT * FROM student WHERE username = $1';
       const result = await client.query(query, [username]);

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

module.exports = router;