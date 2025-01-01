const express = require('express');
const router = express.Router();
const { Admin } = require('../models/admin');
const { User } = require('../models/user');
const { Candidate } = require('../models/candidate');
const { PoliticalParty } = require('../models/party');
const Service = require('../Services/GenericService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const name = 'Admin';

//Get All Admins
router.get('/', async(req,res)=> {
    try{
        const admins = await Admin.find();
        if (!admins || admins.length === 0) {
            return res.status(404).json({ error: 'No Admins Found'});
        }

        res.status(200).json({ message: 'Admins Retrieved Successfully', data:admins});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error'});
    }
});

//Get Admin By ID
router.get('/admin/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin Not Found' });
        }
        res.status(200).json({ message: 'Admin Retrieved Successfully', data: admin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

//Add a New Admin


//Delete a Admin


module.exports = router;

