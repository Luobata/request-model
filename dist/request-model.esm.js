/**
 * @desciption conf
 */
var commitToken = function () {
    var key = '__REQUEST__MODEL__COMMIT__TOKEN';
    if (Symbol) {
        return Symbol(key);
    } else {
        return key;
    }
}();

/**
 * @description help
 */
// tslint:disable no-any no-unsafe-any
var isArray = function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
var isObject = function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};
var isPromise = function isPromise(obj) {
    try {
        return typeof obj.then === 'function';
    } catch (e) {
        return false;
    }
};

var getFunctionInRequest = function getFunctionInRequest(key, request) {
    var iRequest = request;
    if (key.indexOf('/') !== -1) {
        var keys = key.split('/');
        keys.map(function (v) {
            if (!(iRequest instanceof Function)) {
                iRequest = iRequest[v];
            }
        });
    } else {
        iRequest = iRequest[key];
    }
    if (iRequest instanceof Function) {
        return iRequest;
    }
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
var isCommitObj = function isCommitObj(v) {
    return isObject(v) ? 'handler' in v : false;
};
var getKey = function getKey(v) {
    return isCommitObj(v) ? v.handler : v;
};
var getArgs = function getArgs(v) {
    return isCommitObj(v) ? v.args : [];
};
var hasRequest = function hasRequest(key, request) {
    if (isArray(key)) {
        return key.filter(function (v) {
            return !!getFunctionInRequest(getKey(v), request);
        }).length === key.length;
    } else {
        return !!getFunctionInRequest(key, request);
    }
};
var getAll = function getAll(key, request, args) {
    return key.map(function (v) {
        return getFunctionInRequest(getKey(v), request).apply(undefined, _toConsumableArray(getArgs(v)).concat(_toConsumableArray(args)));
    });
};
/**
 * default class Chain
 */

var Chain = function () {
    function Chain(request, action) {
        _classCallCheck(this, Chain);

        this.request = request;
        this.resultList = [];
        this.waitList = [];
        this.actionFun = action;
    }

    _createClass(Chain, [{
        key: 'commit',
        value: function commit(key) {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (!hasRequest(key, this.request)) {
                throw new Error('can not find matched ' + key + ' function');
            }
            if (this.deferItem) {
                this.waitList.push({
                    key: key,
                    args: args
                });
            } else {
                var defer = void 0;
                if (isArray(key)) {
                    defer = Promise.all(getAll(key, this.request, [].concat(args)));
                } else {
                    defer = getFunctionInRequest(key, this.request).apply(undefined, args);
                }
                if (!isPromise(defer)) {
                    throw new Error('The ' + key + ' function not return a Promise function');
                }
                this.deferItem = defer;
                this.deferItem.then(function (result) {
                    _this.commitChain(result);
                }, function (error) {
                    if (_this.reject) {
                        _this.deferItem = null;
                        _this.reject(error);
                    }
                });
            }
            return this;
        }
    }, {
        key: 'then',
        value: function then(resolve, reject) {
            if (this.deferItem) {
                this.waitList.push({
                    resolve: resolve,
                    reject: reject
                });
            } else {
                this.innerResolve({ resolve: resolve, reject: reject });
            }
            return this;
        }
    }, {
        key: 'finish',
        value: function finish(resolve, reject) {
            this.resolve = resolve;
            this.reject = reject;
            return this;
        }
        // tslint:disable no-reserved-keywords

    }, {
        key: 'catch',
        value: function _catch(reject) {
            this.reject = reject;
            return this;
        }
        // tslint:enable no-reserved-keywords

    }, {
        key: 'action',
        value: function action(key) {
            var _actionFun$key;

            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            return (_actionFun$key = this.actionFun[key]).call.apply(_actionFun$key, [null, this].concat(args));
        }
    }, {
        key: 'commitChain',
        value: function commitChain(result) {
            this.resultList.push(result);
            if (this.waitList.length) {
                var keyObj = this.waitList.shift();
                this.deferItem = null;
                if ('key' in keyObj) {
                    // object Idefer
                    this.commit.apply(this, [keyObj.key].concat(_toConsumableArray(keyObj.args), [result]));
                } else {
                    // object Ithen
                    this.innerResolve(keyObj, result);
                }
            } else {
                if (this.resolve) {
                    this.resolve(this.resultList);
                }
            }
        }
    }, {
        key: 'innerResolve',
        value: function innerResolve(then, result) {
            var _this2 = this;

            var deferItem = then.resolve(result);
            if (isPromise(deferItem)) {
                // object Promise
                deferItem.then(function (data) {
                    _this2.commitChain(data);
                }, function (error) {
                    if (_this2.reject) {
                        _this2.reject(error);
                    }
                });
            } else if (isArray(deferItem)) {
                // 暂时可以认为一定是 commitAll 包装
                var item = deferItem.map(function (v) {
                    return {
                        handler: v.key,
                        args: v.args
                    };
                });
                this.commit(item);
            } else if (deferItem !== undefined && deferItem[commitToken]) {
                // another commit
                this.commit.apply(this, [deferItem.key].concat(_toConsumableArray(deferItem.args)));
            } else {
                this.commitChain(deferItem);
            }
            return this;
        }
    }]);

    return Chain;
}();

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var defaultConfig = {
    promiseWrap: false
};
// export interface IcommitWrap {
//     [commitToken]: boolean;
//     key: string;
//     args: any[];
// }
// tslint:disable promise-function-async
var formatFunctionToPromise = function formatFunctionToPromise(flag, fn) {
    if (flag) {
        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return new Promise(function (resolve, reject) {
                fn.call.apply(fn, [null, resolve, reject].concat(args));
            });
        };
    } else {
        return fn;
    }
};
// tslint:enable promise-function-async
/**
 * class Request
 */

var Request = function () {
    function Request(request) {
        _classCallCheck$1(this, Request);

        this.requestConfig = request;
        this.setting = this.getRequestConfig();
        this.action = this.requestConfig.action;
        this.requestFormat();
    }

    _createClass$1(Request, [{
        key: 'chain',
        value: function chain() {
            return new Chain(this.request, this.action);
        }
    }, {
        key: 'commitWrap',
        value: function commitWrap(key) {
            var _ref;

            for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
            }

            return _ref = {}, _defineProperty(_ref, commitToken, true), _defineProperty(_ref, 'key', key), _defineProperty(_ref, 'args', [].concat(args)), _ref;
        }
    }, {
        key: 'commitAll',
        value: function commitAll(commitWrap) {
            return commitWrap.map(function (v) {
                var _ref2;

                return _ref2 = {}, _defineProperty(_ref2, commitToken, true), _defineProperty(_ref2, 'key', v.key), _defineProperty(_ref2, 'args', [].concat(_toConsumableArray$1(v.args))), _ref2;
            });
        }
    }, {
        key: 'requestFormat',
        value: function requestFormat() {
            var outputRequest = {};
            var requestKes = Object.keys.call(null, this.requestConfig.request || {});
            var modulesKeys = Object.keys.call(null, this.requestConfig.modules || {});
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = requestKes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    outputRequest[i] = formatFunctionToPromise(this.setting.config.promiseWrap, this.requestConfig.request[i]);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = modulesKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var _i = _step2.value;

                    var tmpRequest = {};
                    var tmpKeys = Object.keys.call(null, this.requestConfig.modules[_i].request || {});
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = tmpKeys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var j = _step3.value;

                            tmpRequest[j] = formatFunctionToPromise(this.setting.modules[_i].promiseWrap, this.requestConfig.modules[_i].request[j]);
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }

                    outputRequest[_i] = tmpRequest;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.request = outputRequest;
        }
    }, {
        key: 'getRequestConfig',
        value: function getRequestConfig() {
            var _this = this;

            var tmpConfig = {
                config: defaultConfig,
                modules: {}
            };
            var keys = Object.keys.call(null, this.requestConfig.config || {});
            var modulesKeys = Object.keys.call(null, this.requestConfig.modules || {});
            keys.map(function (v) {
                tmpConfig.config[v] = _this.requestConfig.config[v];
            });
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = modulesKeys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var i = _step4.value;

                    tmpConfig.modules[i] = Object.assign({}, tmpConfig.config);
                    var tmpKeys = Object.keys.call(null, this.requestConfig.modules[i].config || {});
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = tmpKeys[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var j = _step5.value;

                            tmpConfig.modules[i][j] = this.requestConfig.modules[i].config[j];
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                _iterator5.return();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return tmpConfig;
        }
    }]);

    return Request;
}();

export default Request;
//# sourceMappingURL=request-model.esm.js.map
