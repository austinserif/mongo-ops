'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.handleClientConnection = exports.buildUriConnectionString = exports.buildHostAndPortString = exports.buildCredentialString = exports.getConnectionStringParams = void 0;
var mongodb_1 = require("mongodb");
var error_1 = require("./error");
var dotenv = require("dotenv");
dotenv.config();
/**
 * Takes a string detailing where to look for connection string information, and
 * then builds the string if the information can be collected and parsed. An additional
 * options param should be passed when invoking a `paramType` other than `"default"`, and
 * must contain a named prop corresponding to that specific `paramType`.
 *
 */
function getConnectionStringParams(paramType, options) {
    if (paramType === "args") {
        // throw error if no corresponding args object is passed
        if (options === undefined || !options.args)
            throw new error_1["default"]("When passing \"args\" paramType, a corresponding \"args\" object--containing the arguments--must be passed inside of the options param");
        // return args
        return options.args;
    }
    else if (paramType === "custom") {
        var customParams = (options === undefined || options.custom === undefined) ? new Error("When passing \"custom\" paramType, a corresponding \"custom\" object--containing the custom variable names--must be passed inside of the options param") : buildCustomParams(options.custom);
        // if error resulted, throw it
        if (customParams instanceof Error)
            throw customParams;
        // otherwise return the custom params
        return customParams;
    }
    else {
        if (process.env.PREFIX === undefined)
            throw new Error('No string value has been defined for the specified env variable key');
        var uriPrefix = process.env.PREFIX;
        if (process.env.HOST === undefined)
            throw new Error('No string value has been defined for the specified env variable key');
        var host = process.env.HOST;
        if (process.env.PORT === undefined)
            throw new Error('No string value has been defined for the specified env variable key');
        var port = process.env.PORT;
        if (process.env.USERNAME === undefined)
            throw new Error('No string value has been defined for the specified env variable key');
        var username = process.env.USERNAME;
        if (process.env.PASSWORD === undefined)
            throw new Error('No string value has been defined for the specified env variable key');
        var password = process.env.PASSWORD;
        if (process.env.IS_URI_ENCODED === undefined)
            throw new Error('No string value has been defined for the specified env variable key');
        var isUriEncoded = process.env.IS_URI_ENCODED;
        if ((uriPrefix !== 'mongo+srv://') && (uriPrefix !== 'mongodb://'))
            throw new Error('The value provided for customPrefix property at custom env var location does not match any expected prefixes');
        if ((isUriEncoded !== 'true') && (isUriEncoded !== 'false'))
            throw new Error('The value provided for isUriEncoded must be either true or false');
        var credentials = {
            isUriEncoded: Boolean(isUriEncoded),
            userpass: {
                username: username,
                password: password
            }
        };
        var hostAndPort = {
            host: host,
            port: port
        };
        var params = {
            uriPrefix: uriPrefix,
            credentials: credentials,
            hostAndPort: hostAndPort
            // add support for additional db auth and options
        };
        return params;
        // (this assumes that the server running the program is only communicating with a single database or cluster)
    }
}
exports.getConnectionStringParams = getConnectionStringParams;
/** Builds a connection parameters object based on a provided set custom env variable names, assuming all
 * required fields are provided
 */
function buildCustomParams(params) {
    var uriPrefix = process.env[params.PREFIX];
    if (uriPrefix === undefined)
        throw new Error('No string value has been defined for the specified env variable key');
    if ((uriPrefix !== 'mongo+srv://') && (uriPrefix !== 'mongodb://'))
        throw new Error('The value provided for customPrefix property at custom env var location does not match any expected prefixes');
    var isUriEncoded = process.env[params.IS_URI_ENCODED];
    if (uriPrefix === undefined)
        throw new Error('No string value has been defined for the specified env variable key');
    if ((isUriEncoded !== 'true') && (isUriEncoded !== 'false'))
        throw new Error('The value provided for isUriEncoded must be either true or false');
    var username = process.env[params.USERNAME];
    if (username === undefined)
        throw new Error('No string value has been defined for the specified env variable key');
    var password = process.env[params.PASSWORD];
    if (password === undefined)
        throw new Error('No string value has been defined for the specified env variable key');
    var host = process.env[params.HOST];
    if (host === undefined)
        throw new Error('No string value has been defined for the specified env variable key');
    var port = process.env[params.PORT];
    if (port === undefined)
        throw new Error('No string value has been defined for the specified env variable key');
    var credentials = {
        isUriEncoded: Boolean(isUriEncoded),
        userpass: {
            username: username,
            password: password
        }
    };
    var customHostAndPort = {
        host: host,
        port: port
    };
    var customParams = {
        uriPrefix: uriPrefix,
        credentials: credentials,
        hostAndPort: customHostAndPort
        // add support for additional db auth and options
    };
    return customParams;
}
;
;
;
;
/**
 * Builds a valid credential string. `credentials.isUriEncoded` MUST be included in param. Function will use
 * this to determine whether or not username and password require encoding before credential string concatonation.
 */
function buildCredentialString(credentials) {
    if (credentials.userpass) {
        // check if inputs is URL encoded
        if (credentials.isUriEncoded) {
            // build string and return, no need to encode
            return credentials.userpass.username + ":" + credentials.userpass.password + "@";
        }
        else {
            return encodeURIComponent(credentials.userpass.username) + ":" + encodeURIComponent(credentials.userpass.password) + "@";
        }
    }
    else {
        return "";
    }
}
exports.buildCredentialString = buildCredentialString;
/** build a valid host and port string */
function buildHostAndPortString(hostAndPort) {
    var hANDp = hostAndPort;
    // ignore port if undefined, otherwise build string fragment
    var port = hANDp.port ? ":" + hANDp.port : "";
    // return concatonated host and port
    return hANDp.host + port;
}
exports.buildHostAndPortString = buildHostAndPortString;
/** Builds a valid mongo db connection string */
function buildUriConnectionString(params) {
    // build credentials string
    var credentialsString = buildCredentialString(params.credentials);
    // build host and port string
    var hostAndPortString = buildHostAndPortString(params.hostAndPort);
    // build default auth db string
    var authDbString = "";
    // build additional options string
    var additionalOptionsString = "";
    // return concatonate pieces with prepend uriPrefix
    return params.uriPrefix + credentialsString + hostAndPortString + authDbString + additionalOptionsString;
}
exports.buildUriConnectionString = buildUriConnectionString;
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
function handleClientConnection(paramType, options) {
    return __awaiter(this, void 0, void 0, function () {
        var connectionParams, connectionString, clientConnection_1;
        return __generator(this, function (_a) {
            try {
                connectionParams = getConnectionStringParams(paramType, options);
                connectionString = buildUriConnectionString(connectionParams);
                clientConnection_1 = new mongodb_1["default"](connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
                return [2 /*return*/, {
                        getConnectionObject: function () {
                            return clientConnection_1;
                        }
                    }];
            }
            catch (err) {
                if (err instanceof Error)
                    throw new Error(err.message);
                throw new Error('An unknown error occurred');
            }
            return [2 /*return*/];
        });
    });
}
exports.handleClientConnection = handleClientConnection;
;
