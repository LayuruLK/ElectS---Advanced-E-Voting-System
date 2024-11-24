const mongoose = require('mongoose')

//Get All
async function getAll (res, Model, name) {
    const result = await Model.find()
    if(result) {
        res.status(200).json({ success: true, data: result, message: `All ${name} fetched successfully`})           
    } else {
        res.status(404).send(name+ "not found!")
    }
}

//Get By ID
async function getById(req,res,Model,name) {
    const id = req.params.id
    try {
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID")
        }
        const result = await Model.findById(id)
        if(result) {
            res.status(200).json(result)
        } else {
            res.status(404).send(name+ " not found")
        }
    } catch(error) {
        console.error('Internal Error: ', error)
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


//Delete By Id
async function deleteById(req,res,Model,name) {
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID")
    }
    try {
        const result = await Model.findByIdAndDelete(id)
        if(result) {
            res.status(200).json(result)
        } else {
            res.status(404).send(name+" not found!")
            }
    } catch(error) {
        console.error('Internal Error: ', error)
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getCount(res,Model,name) {
    const result = await Model.countDocuments()
    if(result) {
        res.status(200).json(result)
    } else {
        res.status(404).send(name+" not found!")
        }
}

module.exports = {
    getAll,
    getById,
    deleteById,
    getCount
}