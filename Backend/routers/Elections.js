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