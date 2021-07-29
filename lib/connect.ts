'use strict';

import MongoOpsError from "./error";

/**
 * Defines the type of param structure the program should
 * use to look for the connection string params.
 * 
 * - "default": indicates that connection string vars are stored according to the default env vars scheme
 * - "args": indicates that connection string vars are going to be passed as arguments
 * - "custom": indicates that the connection string vars can be found in env vars, but according to a custom naming scheme
 */
type ConnectionParamType = "default" | "args" | "custom";



/**
 * Takes a string detailing where to look for connection string information, and 
 * then builds the string if the information can be collected and parsed. An additional 
 * options param should be passed when invoking a `paramType` other than `"default"`, and 
 * must contain a named prop corresponding to that specific `paramType`.
 *
 */
export function getConnectionStringParams (paramType: ConnectionParamType, options?:{ args?: ConnectionParams, custom?: CustomConnectionParamLocation }) {
    if (paramType === "args") {
        // throw error if no corresponding args object is passed
        if (options === undefined || !options.args) throw new MongoOpsError(`When passing "args" paramType, a corresponding "args" object--containing the arguments--must be passed inside of the options param`);



    } else if (paramType === "custom") {
        // look for connection string params based on custom env var naming scheme
    } else {
        // look for connection string params based on standard env var naming scheme 
        // (this assumes that the server running the program is only communicating with a single database or cluster)
    }
}

/**
 * Defines the shape of an object that contains information
 * for a custom environmental variables naming scheme. The purpose of
 * this is to allow multi-database/cluster access from a single server.
 */
interface CustomConnectionParamLocation {
    PREFIX: UriPrefix,
    AUTH: object,
    HOST_AND_PORT: {
        HOST: string,
        PORT?: string
    },
    DEFAULT_AUTH_DB?: string,
    ADDITIONAL_OPTIONS?: string
}

type UriPrefix = "mongo+srv://" | "mongodb://";

interface AuthCredentials {
    isUriEncoded: boolean,
    userpass?: {
        username: string,
        password: string        
    }
};

/**
 * Contains hostname and optional port props. If port is not 
 * included it will default to 27017.
 */
interface HostAndPort {
    host: string,
    port?: string
};

/**
 * Defines an interface for the constituent elements of 
 * a standard Mongo DB URI Connection String. These elements are 
 * specified here: https://docs.mongodb.com/manual/reference/connection-string/
 */
interface ConnectionParams {
    uriPrefix: UriPrefix,
    credentials: AuthCredentials,
    hostAndPort: HostAndPort,

    defaultAuthDb?: string, // TODO: understand this and create interface
    additionalOptions?: string // TOOD: understand this and create interface
};

// FUNCTION: getConnectionStringConfig
/**
 * TOOD: Define a function that takes a configuration object that tells
 * the program where to look for variables to build a connection string 
 * (current args, default env vars, special env vars, etc). If the inputs are valid, 
 * then the function should build them into an object and return it.
 */

function buildCredentialString(credentials: AuthCredentials) {
    if (credentials.userpass) {
        // check if inputs is URL encoded
        if (credentials.isUriEncoded) {
            // build string and return, no need to encode
            return `${credentials.userpass.username}:${credentials.userpass.password}@`;     
        } else {
            return `${encodeURIComponent(credentials.userpass.username)}:${encodeURIComponent(credentials.userpass.password)}@`;
        }
    } else {
        return ``;
    }
}

function buildHostAndPortString(hostAndPort: HostAndPort) {
    const hANDp: HostAndPort = hostAndPort;
    // ignore port if undefined, otherwise build string fragment
    const port = hANDp.port ? `:${hANDp.port}` : ``;

    // return concatonated host and port
    return hANDp.host + port;
}

/** Builds a valid mongo db connection string */
function buildUriConnectionString(params: ConnectionParams) {
    // build credentials string
    const credentialsString = buildCredentialString(params.credentials);

    // build host and port string
    const hostAndPortString = buildHostAndPortString(params.hostAndPort);

    // build default auth db string
    const authDbString = ``;

    // build additional options string
    const additionalOptionsString = ``;

    // return concatonate pieces with prepend uriPrefix
    return params.uriPrefix + credentialsString + hostAndPortString + authDbString + additionalOptionsString;
}




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
// export async function handleClientConnection() {
//     try {
//         // require the MongoClient constructor

//         const MongoClient = require('mongodb').MongoClient;

//         // look for a MONGO_DB_URL on process.env object
//         // throw an error if none found
//         if (!process.env.MONGO_DB_URL || process.env.MONGO_DB_URL === 'undefined') throw new Error('No connection string found in environment variables');

//         // establish connection
//         const clientConnection = new MongoClient(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

//         return {
//             getConnectionObject() {
//                 return clientConnection;
//             }
//         }
//     } catch (err) {
//         if (err instanceof Error) throw new Error(err.message);

//         throw new Error('An unknown error occurred');
//     }
// };