const express = require('express');
const router = express.Router();
const { Election } = require('../models/election');
const { User } = require('../models/user');
const Service = require('../Services/GenericService');
const { Candidate } = require('../models/candidate');
const name = 'Election';

router.get('/', async (req, res) => {
    Service.getAll(res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

router.get('/:id', async (req, res) => {
    Service.getById(req, res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

router.delete('/:id', (req, res) => {
    Service.deleteById(req, res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

router.get('/get/count', (req, res) => {
    Service.getCount(res, Election, name).catch((error) => {
        res.status(500).send(error + " Server Error");
    });
});

router.post('/', async (req, res) => {
    const { name, where, date, startTime, endTime, description, rules } = req.body;
  
    if (!name || !where || !date || !startTime || !endTime || !description) {
      return res.status(400).json({ success: false, message: "Please fill all the required fields!" });
    } 
    try {
      const electionDate = new Date(date);  
      const electionStartTime = new Date(startTime);  
      const electionEndTime = new Date(endTime);  
      electionStartTime.setFullYear(electionDate.getFullYear(), electionDate.getMonth(), electionDate.getDate());
      electionEndTime.setFullYear(electionDate.getFullYear(), electionDate.getMonth(), electionDate.getDate());
  
      let election = new Election({
        name,
        where,
        date: electionDate,
        startTime: electionStartTime,
        endTime: electionEndTime,
        description,
        rules
      });
  
      election = await election.save();
  
      if (!election) {
        return res.status(400).json({ success: false, message: "Election could not be added!" });
      }
  
      res.status(201).json({ success: true, message: "Successfully added", data: election });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
});
module.exports=router;