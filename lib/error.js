'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
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
var MongoOpsError = /** @class */ (function (_super) {
    __extends(MongoOpsError, _super);
    function MongoOpsError(message) {
        var _this = this;
        if (message instanceof Error) {
            _this = _super.call(this, message.message) || this;
            _this.stack = message.stack;
        }
        else {
            // the message argument is not an Error structure, is most likely a string in this case
            // so we should call parent constructor with this message    
            _this = _super.call(this, message) || this;
            // then add null call stack
            _this.stack = undefined;
        }
        return _this;
    }
    return MongoOpsError;
}(Error));
;
exports["default"] = MongoOpsError;
