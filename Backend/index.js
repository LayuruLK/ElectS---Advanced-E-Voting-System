const express = require('express');
const app = express();
require('dotenv/config');
const cors = require('cors');
const mongoose = require('mongoose');

// Import the export and import scripts
//const exportData = require('./exportData');
//const importData = require('./importData');


app.use(cors());

//middlewares
app.use(express.json());


//Routers
const usersRoutes = require('./routers/users');


const api = process.env.API_URL

app.use(`${api}/users`, usersRoutes);

// Check for required environment variables
if (!process.env.CONNECTION_STRING || !process.env.PORT) {
    console.error("ERROR: Missing environment variables. Ensure CONNECTION_STRING and PORT are set.");
    process.exit(1);
}

// Database Connection
mongoose
    .connect(process.env.CONNECTION_STRING, { dbName: 'ElectSDatabase' })
    .then(() => {
        console.log('Database Connection is ready...');
    })
    .catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1); // Terminate if the database connection fails
    });

// Define routes for triggering export and import
/* app.get('/export', async (req, res) => {
    try {
        const data = await exportData();
        res.status(200).json({
            message: 'Data exported successfully',
            exportedRecords: data.length, // Include count of exported records
        });
    } catch (error) {
        console.error("Error exporting data:", error);
        res.status(500).json({ message: 'Error exporting data', error: error.message });
    }
});

app.get('/import', async (req, res) => {
    try {
        await importData();
        res.status(200).json({ message: 'Data imported successfully' });
    } catch (error) {
        console.error("Error importing data:", error);
        res.status(500).json({ message: 'Error importing data', error: error.message });
    }
}); */



// Set up the server
const port = process.env.PORT || 3000; // Default to port 3000 if PORT is undefined
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
