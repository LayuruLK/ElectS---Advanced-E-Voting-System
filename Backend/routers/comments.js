const express = require('express');
const router = express.Router();
const {Comment} = require('../models/comment');
const Service = require('../Services/GenericService')
const name = 'Comment'

//Get comments
router.get('/', async(req,res) => {
    Service.getAll(res, Comment, name).catch((error) => {
        res.status(500).send(error+ " Server Error")
    })  
})

//Get Comment By id
router.get('/:id', async(req,res) =>{
    Service.getById(req, res, Comment, name).catch((error) =>{
        res.status(500).send(error+ " Server Error")
    })
})

//Delete an Comment
router.delete('/:id',(req,res)=>{
    Service.deleteById(req,res,Comment,name).catch((error) => {
        res.status(500).send(error+" Server Error")
    })
})


//getCount
router.get('/get/count', (req,res) => {
    Service.getCount(res, Comment, name).catch((error) => {
        res.status(500).send(error+ " Server Error")
    })  
})

module.exports = router;