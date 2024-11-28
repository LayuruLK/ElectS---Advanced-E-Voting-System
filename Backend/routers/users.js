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

//Update user details
router.put('/:id', upload.single('profilePhoto'), async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const profilePhotoUrl = req.file ? req.file.path : userExist.profilePhoto;

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            nic: req.body.nic,
            passwordHash: newPassword,
            email: req.body.email,
            phone: req.body.phone,
            addressline1: req.body.addressline1,
            addressline2: req.body.addressline2,
            city: req.body.city,
            district: req.body.district,
            province: req.body.province,
            isCandidate: req.body.isCandidate,
            profilePhoto: profilePhotoUrl
        },
        { new: true}
    )

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

module.exports = router;