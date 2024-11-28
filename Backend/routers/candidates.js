const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User} = require('../models/user');
const {Candidate} = require('../models/candidate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('../helpers/upload');
const Service = require('../Services/GenericService')
const name = 'Candidate'

//Get candidates
router.get('/', async(req,res) => {
    const result = await Candidate.find().populate('user')
    if(result) {
        res.status(200).json({ success: true, data: result, message: `All ${name} fetched successfully`})           
    } else {
        res.status(404).send(name+ "not found!")
    }
})

//Get Candidate By id
router.get('/profile/:id', async(req,res) => {
    const id = req.params.id;

    const candidate = await Candidate.findOne({user:id});

    const result = await Candidate.findById(candidate._id).populate('user')
    if(result) {
        res.status(200).json({data:result})           
    } else {
        res.status(404).send(name+ "not found!")
    }
})

//Delete an Candidate
router.delete('/:id',(req,res)=>{
    Service.deleteById(req,res,Candidate,name).catch((error) => {
        res.status(500).send(error+" Server Error")
    })
})


//getCount
router.get('/get/count', (req,res) => {
    Service.getCount(res, Candidate, name).catch((error) => {
        res.status(500).send(error+ " Server Error")
    })  
})