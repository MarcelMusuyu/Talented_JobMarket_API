// utilities.js
const dbConnect = require('../database/');
const mongoose = require('mongoose');

const Util = {};
Util.getModel = async function (dbName, schema, modelName) {
    const connection = await dbConnect(dbName);
    // Check if the model is already defined for this connection
    if (!connection.models[modelName]) {
        return connection.model(modelName, schema, modelName);
    }
    return connection.models[modelName];
};

module.exports = Util;