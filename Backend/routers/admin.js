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

//Get All Users
router.get('/users', async(req,res)=>{
    try{
        const users = await Service.getAll(res,User,'User');
        res.status(200).json(users);
       
    }
    catch(error){
        res.status(500).send(error + 'Server Error');
    }
});

//Get User By ID
router.get('/user/:id',async(req,res)=> {
    try{
        const user = await Service.getById(req,User,'User');
        res.status(200).json(user);
    }
    catch(error) {
        res.status(500).setDefaultEncoding(error + 'Server Error');
    }
});

module.exports = router;

