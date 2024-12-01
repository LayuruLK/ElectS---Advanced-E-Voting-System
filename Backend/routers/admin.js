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
router.get('/admin', async(req,res)=>{
    try{
        const users = await Service.getAll(res,Admin,'Admin');
        res.status(200).json(admin);
       
    }
    catch(error){
        res.status(500).send(error + 'Server Error');
    }
});

//Get User By ID
router.get('/user/:id',async(req,res)=> {
    try{
        const user = await Service.getById(req,Admin,'Admin');
        res.status(200).json(admin);
    }
    catch(error) {
        res.status(500).setDefaultEncoding(error + 'Server Error');
    }
});

//Add a New Admin
router.post('/admin',async(req,res)=> {
    try{
        const { name,email,password,phone } = req.body;

        if(!name || !email || !password || !phone) {
            return res.status(400).json({ error: 'Name, Email, Password, and Phone are Required'});

        }

        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ error: 'Invalid Phone Number Format' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const adminData = {
            admin_id :id,
            name,
            email,
            password:hashedPassword,
            phone,

        }

        const admin = await Service.add({ body:adminData }, Admin, 'Admin');
        res.status(201).json({
            message: 'Admin Created Successfully',
            data: admin,
        });
    }
    catch(error){
        if(email = email){
            return res.status(400).json({ error: 'Email Already Exists'});
        }
        res.status(500).send(error + 'Server Error');
    }
});

//Delete a User
router.delete('admin/:id',async(req,res)=>{
    try {
        const result = await Service.deleteById(req,Admin,'Admin');
        res.status(200).json({message:'Admin Deleted Successfully',result});
    } catch (error) {
        res.status(500).send(error + 'Server Error');
    }
});

module.exports = router;

