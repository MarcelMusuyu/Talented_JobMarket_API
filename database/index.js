// database/index.js
const mongoose = require('mongoose');

const dbConnections = {};

async function connectToDatabase(dbName) {
    if (dbConnections[dbName]) {
        console.log(`[dbConnect] Returning existing connection for: ${dbName}`);
        return dbConnections[dbName];
    }

    try {
        const connectionUri = `${process.env.MONGODB_URI}/${dbName}`;
        console.log(`[dbConnect] Attempting to create connection to: ${connectionUri}`);

        const connection = await mongoose.createConnection(connectionUri);

        // Wait for the connection to be fully established (state 1: connected)
        await new Promise((resolve, reject) => {
            connection.on('connected', resolve);
            connection.on('error', reject);
        });

        console.log(`[dbConnect] Connection to ${dbName} established and ready (state: ${connection.readyState}).`);
     

        dbConnections[dbName] = connection;
         const collections = await connection.db.listCollections().toArray();
        console.log(`Collections in database '${dbName}':`);
        collections.forEach(collection => console.log(`- ${collection.name}`));
        return connection;
    } catch (err) {
        console.error(`[dbConnect] Error connecting to database ${dbName}:`, err);
        throw err;
    }
}

module.exports = connectToDatabase;