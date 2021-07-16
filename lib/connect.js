'use strict';

/**
 * TODO: write a function closure that establishes a 
 * connection with the database server, and returns 
 * a connection object.
 */



async function handleClientConnection() {
    try {
        // require the MongoClient constructor
        const MongoClient = require('mongodb').MongoClient;

        // look for a MONGO_DB_URL on process.env object
        // throw an error if none found
        if (!process.env.MONGO_DB_URL || process.env.MONGO_DB_URL === 'undefined') throw new Error('No connection string found in environment variables');

        // establish connection
        const clientConnection = new MongoClient(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

        return {
            getConnectionObject() {
                return clientConnection;
            }
        }
    } catch (err) {
        if (err instanceof Error) throw new Error(err.message);

        throw new Error('An unknown error occurred');
    }
};

module.exports = { handleClientConnection };