const express = require('express');
const app = express();
require('dotenv/config');
const mongoose = require('mongoose');


const string = process.env.CONNECTION_STRING

//Database Connection
mongoose.connect(string, {
    dbName: 'ElectSDatabase'
})
.then(()=>{
    console.log('Database Connection is ready...');
})
.catch((err)=>{
    console.log(err);
})

const port = process.env.PORT

//Server
app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})