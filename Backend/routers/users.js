const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const {Candidate} = require('../models/candidate');
const Service = require('../Services/GenericService');
const upload = require('../helpers/upload');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const name = 'User'

//Get users
router.get('/', async(req,res) => {
    Service.getAll(res, User, name).catch((error) => {
        res.status(500).send(error+ " Server Error")
    })  
})

//Get User By id
router.get('/profile/:id', async(req,res) =>{
    Service.getById(req, res, User, name).catch((error) =>{
        res.status(500).send(error+ " Server Error")
    })
})

//Delete an User
router.delete('/:id',(req,res)=>{
    Service.deleteById(req,res,User,name).catch((error) => {
        res.status(500).send(error+" Server Error")
    })
})


//getCount
router.get('/get/count', (req,res) => {
    Service.getCount(res, User, name).catch((error) => {
        res.status(500).send(error+ " Server Error")
    })  
})