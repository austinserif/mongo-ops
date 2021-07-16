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
            if (typeof message === 'string') {
                super(message);
            } else {
                // TODO: finish this
                super(message);
            }
        }
    }
}