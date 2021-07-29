'use strict';

import MongoClient from 'mongodb';
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

        // return args
        return options.args;
    } else if (paramType === "custom") {
        const customParams = (options === undefined || options.custom === undefined) ? new Error(`When passing "custom" paramType, a corresponding "custom" object--containing the custom variable names--must be passed inside of the options param`) : buildCustomParams(options.custom);

        // if error resulted, throw it
        if (customParams instanceof Error) throw customParams;

        // otherwise return the custom params
        return customParams;
    } else {
        const uriPrefix = process.env.PREFIX || new Error('No env variable found for PREFIX');
        const host = process.env.HOST || new Error('No env variable found for HOST');
        const port = process.env.PORT || new Error('No env variable found for PORT');
        const username = process.env.USERNAME || new Error('No env variable found for USERNAME');
        const password = process.env.PASSWORD || new Error('No env variable found for PASSWORD');
        const isUriEncoded = process.env.IS_URI_ENCODED || new Error('No env variable found for IS_URI_ENCODED');

        [uriPrefix, host, port, username, password, isUriEncoded].forEach((item) => {
            if (item instanceof Error) throw item;
        });

        if ((uriPrefix !== 'mongo+srv://') && (uriPrefix !== 'mongodb://')) throw new Error('The value provided for customPrefix property at custom env var location does not match any expected prefixes');
        if ((isUriEncoded !== 'true') && (isUriEncoded !== 'false')) throw new Error('The value provided for isUriEncoded must be either true or false');

        const credentials: AuthCredentials = {
            isUriEncoded: Boolean(isUriEncoded),
            userpass: {
                username,
                password
            }        
        };
    
        const hostAndPort: HostAndPort = {
            host,
            port     
        };

        const params: ConnectionParams = {
            uriPrefix,
            credentials,
            hostAndPort
            // add support for additional db auth and options
        }

        return params;

        // (this assumes that the server running the program is only communicating with a single database or cluster)
    }
}

/** Builds a connection parameters object based on a provided set custom env variable names, assuming all
 * required fields are provided
 */
function buildCustomParams(params: CustomConnectionParamLocation) {
    const uriPrefix = process.env[params.PREFIX];
    if (uriPrefix === undefined) throw new Error('No string value has been defined for the specified env variable key');
    if ((uriPrefix !== 'mongo+srv://') && (uriPrefix !== 'mongodb://')) throw new Error('The value provided for customPrefix property at custom env var location does not match any expected prefixes');
    
    const isUriEncoded = process.env[params.IS_URI_ENCODED];
    if (uriPrefix === undefined) throw new Error('No string value has been defined for the specified env variable key');
    if ((isUriEncoded !== 'true') && (isUriEncoded !== 'false')) throw new Error('The value provided for isUriEncoded must be either true or false');

    const username = process.env[params.USERNAME];
    if (username === undefined) throw new Error('No string value has been defined for the specified env variable key');

    const password = process.env[params.PASSWORD];
    if (password === undefined) throw new Error('No string value has been defined for the specified env variable key');

    const host = process.env[params.HOST];
    if (host === undefined) throw new Error('No string value has been defined for the specified env variable key');

    const port = process.env[params.PORT];
    if (port === undefined) throw new Error('No string value has been defined for the specified env variable key');

    const credentials: AuthCredentials = {
        isUriEncoded: Boolean(isUriEncoded),
        userpass: {
            username,
            password
        }        
    };

    const customHostAndPort: HostAndPort = {
        host,
        port     
    };

    const customParams: ConnectionParams = {
        uriPrefix,
        credentials: credentials,
        hostAndPort: customHostAndPort
        // add support for additional db auth and options
    }
    
    return customParams;
};

/**
 * Defines the shape of an object that contains information
 * for a custom environmental variables naming scheme. The purpose of
 * this is to allow multi-database/cluster access from a single server.
 */
interface CustomConnectionParamLocation {
    PREFIX: string,
    USERNAME: string,
    PASSWORD: string,
    IS_URI_ENCODED: string,
    HOST: string,
    PORT: string,
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

/**
 * Builds a valid credential string. `credentials.isUriEncoded` MUST be included in param. Function will use
 * this to determine whether or not username and password require encoding before credential string concatonation.
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

/** build a valid host and port string */
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


/**
 * Establishes a connection with the database server, and returns 
 * a connection object.
 */
export async function handleClientConnection(paramType: ConnectionParamType, options?:{ args?: ConnectionParams, custom?: CustomConnectionParamLocation }) {
    try {
        // build the correct connection string params
        const connectionParams = getConnectionStringParams(paramType, options);

        const connectionString = buildUriConnectionString(connectionParams);

        // establish connection
        const clientConnection = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

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