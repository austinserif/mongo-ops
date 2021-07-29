'use strict';
exports.__esModule = true;
exports.getConnectionStringParams = void 0;
var error_1 = require("./error");
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
    }
    else if (paramType === "custom") {
        // look for connection string params based on custom env var naming scheme
    }
    else {
        // look for connection string params based on standard env var naming scheme 
        // (this assumes that the server running the program is only communicating with a single database or cluster)
    }
}
exports.getConnectionStringParams = getConnectionStringParams;
;
;
;
// FUNCTION: getConnectionStringConfig
/**
 * TOOD: Define a function that takes a configuration object that tells
 * the program where to look for variables to build a connection string
 * (current args, default env vars, special env vars, etc). If the inputs are valid,
 * then the function should build them into an object and return it.
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
function buildHostAndPortString(hostAndPort) {
    var hANDp = hostAndPort;
    // ignore port if undefined, otherwise build string fragment
    var port = hANDp.port ? ":" + hANDp.port : "";
    // return concatonated host and port
    return hANDp.host + port;
}
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
