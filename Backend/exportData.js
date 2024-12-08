//Export Data From Base Database
const { MongoClient } = require("mongodb");

const sourceURI = "mongodb+srv://user:user@cluster0.vjh2a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const sourceDBName = "test";
const collectionName = "people";

async function exportData() {
  const sourceClient = new MongoClient(sourceURI);
  try {
    await sourceClient.connect();
    const db = sourceClient.db(sourceDBName);
    const collection = db.collection(collectionName);
    const data = await collection.find().toArray();

    //console.log("Exported Data:", data);
    return data;
  } catch (error) {
    console.error("Error exporting data:", error);
  } finally {
    await sourceClient.close();
  }
}

module.exports = exportData;
