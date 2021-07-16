'use strict';

/**
 * Defines the type of param structure the program should
 * use to look for the connection string params.
 * 
 * - "default": indicates that connection string vars are stored according to the default env vars scheme
 * - "args": indicates that connection string vars are going to be passed as arguments
 * - "custom": indicates that the connection string vars can be found in env vars, but according to a custom naming scheme
 */
type ConnectionParamType = "default" | "args" | "custom";


// FUNCTION: getConnectionStringConfig
/**
 * TOOD: Define a function that takes a configuration object that tells
 * the program where to look for variables to build a connection string 
 * (current args, default env vars, special env vars, etc). If the inputs are valid, 
 * then the function should build them into an object and return it.
 */




// INTERFACE: MongoConnectionURI
/**
 * TODO: Define interface for a connection string (is this neccessary?)
 */

 // FUNCTION: getConnectionString
/**
 * TODO: define function that takes args pertaining to a connection string 
 * and then attempts to build and return the connection URL.
 * 
 * useful info: https://docs.mongodb.com/manual/reference/connection-string/
 */






// INTERFACE: MongoDbClientConnection
/**
 * TODO: Define type interface for a connection object
 * 
 * Most important element of this is a reliable current status, but should include
 * essential metadata for troubleshooting as well.
*/


// FUNCTION: handleClientConnection
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