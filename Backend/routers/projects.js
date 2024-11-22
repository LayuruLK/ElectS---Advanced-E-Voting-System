const express = require('express');
const router = express.Router();
const {Project} = require('../models/project');
const { User } = require('../models/user');
const Service = require('../Services/GenericService');
const uploadfile = require('../helpers/uploadfile')
const name = 'Project'

//Get Projects
router.get('/', async(req,res) => {
    Service.getAll(res, Project, name).catch((error) => {
        res.status(500).send(error+ " Server Error")
    })  
})

//Get Project By id
router.get('/pjct/:id', async(req,res) =>{
    Service.getById(req, res, Project, name).catch((error) =>{
        res.status(500).send(error+ " Server Error")
    })
})

//Delete an Project
router.delete('/:id',(req,res)=>{
    Service.deleteById(req,res,Project,name).catch((error) => {
        res.status(500).send(error+" Server Error")
    })
})


//getCount
router.get('/get/count', (req,res) => {
    Service.getCount(res, Project, name).catch((error) => {
        res.status(500).send(error+ " Server Error")
    })  
})

module.exports = router;