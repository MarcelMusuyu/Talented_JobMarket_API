const env = require("dotenv").config()
const {MongoClient} = require('mongodb');

// const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.mucdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const uri=`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cse341cluster.4cfac.mongodb.net/?retryWrites=true&w=majority&appName=CSE341Cluster`


// let client; // Declare client outside the function

// const connectDB = async () => {
//     if (client && client.topology && client.topology.isConnected()) {
//         console.log("Already connected to the database");
//         return client.db(); // Return the database instance if already connected
//     }

//     try {
//         client = new MongoClient(uri); // Create a new client instance
//         await client.connect();
//         console.log("Connected to the database");
//         return client.db(); // Return the database instance
//     } catch (e) {
//         console.error(e);
//         throw e; // Rethrow the error to be handled by the caller
//     }
// };
// // main().catch(console.error);
// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();
 
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// }

// module.exports = connectDB;



const MongoClient = require('mongodb').MongoClient;

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }
  MongoClient.connect(uri)
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error('Db not initialized');
  }
  console.log('DB Connected');
  return _db;
};

module.exports = {
  initDb,
  getDb,
};
