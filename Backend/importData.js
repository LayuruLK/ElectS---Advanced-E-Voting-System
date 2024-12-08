const { MongoClient } = require("mongodb");
const exportData = require("./exportData"); // Import the exportData function
require('dotenv/config');

// MongoDB connection details for the target cluster
const targetURI = process.env.CONNECTION_STRING;
const targetDBName = "ElectSDatabase"; // Replace with your target database name
const targetCollectionName = "people"; // Replace with your target collection name

async function importData() {
  const targetClient = new MongoClient(targetURI); // Initialize the MongoDB client
  try {
    // Connect to the target cluster
    await targetClient.connect();
    console.log("Connected to target cluster...");

    // Get the target database and collection
    const db = targetClient.db(targetDBName);
    const collection = db.collection(targetCollectionName);

    // Get the exported data
    const data = await exportData();

    if (data && data.length > 0) {
      // Use upsert logic to avoid duplicates
      const bulkOps = data.map((doc) => ({
        updateOne: {
          filter: { _id: doc._id }, // Match document by _id
          update: { $set: doc },   // Update the document with the new data
          upsert: true,            // Insert the document if it doesn't exist
        },
      }));

      // Perform the bulk write operation
      const result = await collection.bulkWrite(bulkOps);
      console.log(`Data Imported Successfully: ${result.upsertedCount + result.matchedCount} documents processed.`);
      console.log(`${result.upsertedCount} documents were inserted.`);
      console.log(`${result.matchedCount} documents were updated.`);
    } else {
      console.log("No data to import.");
    }
  } catch (error) {
    console.error("Error importing data:", error);
  } finally {
    // Close the database connection
    await targetClient.close();
    console.log("Target cluster connection closed.");
  }
}

module.exports = importData; // Export the function for use in other files

// Optional: Uncomment this to test the importData function directly
importData();
