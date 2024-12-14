const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');

const externalURI = "mongodb+srv://user:user@cluster0.vjh2a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const externalDBName = "test"; // The database name
const externalCollectionName = "people"; // The collection name

router.get('/external-people', async (req, res) => {
    const client = new MongoClient(externalURI);
    try {
        await client.connect();
        const db = client.db(externalDBName);
        const collection = db.collection(externalCollectionName);

        // Fetch data from the external collection
        const data = await collection.find().toArray();
        res.status(200).json({ message: 'Data retrieved successfully', data });
    } catch (error) {
        console.error("Error fetching data from external database:", error);
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    } finally {
        await client.close();
    }
});

module.exports = router;