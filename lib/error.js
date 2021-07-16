'use strict';

/**
 * creates a new MongoOpsError
 * 
 * **First iteration based on MongoError**, for more info
 * see [MongoClient node driver on github](https://github.com/mongodb/node-mongodb-native/blob/3.6/lib/core/error.js).
 * 
 * @augments Error
 * @param {Error|string|object} message error message
 * @property {string} message error message
 * @property {string} stack error call stack
 */
class MongoOpsError extends Error {
    constructor(message) {
        if (message instanceof Error) {
            super(message.message);
            this.stack = message.stack;
        } else {
            // the message argument is not an Error structure, is most likely a string in this case
            // so we should call parent constructor with this message    
            super(message);
            
            // then add null call stack
            this.stack = null;
        }
    }
};

module.exports = MongoOpsError;
