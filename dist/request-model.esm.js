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
var isFunction = function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
};
var isPromise = function isPromise(obj) {
    try {
        return typeof obj.then === 'function';
    } catch (e) {
        return false;
    }
};
var getFunctionName = function getFunctionName(input) {
    var result = /^function\s+([\w\$]+)\s*\(/.exec(input.toString());
    return result ? result[1] : '';
};

var getFunctionInRequest = function getFunctionInRequest(key, request) {
    var iRequest = request;
    var result = void 0;
    try {
        if (key.indexOf('/') !== -1) {
            var keys = key.split('/');
            keys.map(function (v, i) {
                if (i !== keys.length - 1) {
                    iRequest = iRequest.modules[v];
                } else {
                    result = iRequest.request[v];
                }
            });
        } else {
            result = iRequest.request[key];
        }
    } catch (e) {}
    return result;
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
function isIdefer(v) {
    return v.key !== undefined;
}
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
        var keys = key.filter(function (v) {
            return !getFunctionInRequest(getKey(v), request);
        });
        return keys.length ? keys.map(function (v) {
            return v.handler ? v.handler : v;
        }).join(',') : '';
    } else {
        return getFunctionInRequest(key, request) ? '' : key;
    }
};
var getAll = function getAll(key, request, args) {
    return key.map(function (v) {
        return getFunctionInRequest(getKey(v), request).apply(undefined, _toConsumableArray(getArgs(v)).concat(_toConsumableArray(args)));
    });
};
// tslint:disable-next-line no-empty
var noop = function noop() {};
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

            if (this.unResolveRejection) {
                return this;
            }
            var keyStr = hasRequest(key, this.request);
            if (keyStr) {
                throw new Error('can not find matched commit key: ' + keyStr);
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
                // call entry one
                this.deferItem = defer;
                this.deferItem.then(function (result) {
                    _this.commitChain(result);
                }, function (error) {
                    _this.innerRejection(error);
                });
            }
            return this;
        }
    }, {
        key: 'then',
        value: function then(resolve, reject, always, before) {
            if (this.deferItem) {
                this.waitList.push({
                    resolve: resolve,
                    reject: reject,
                    always: always,
                    before: before
                });
            } else {
                this.innerResolve({ resolve: resolve, reject: reject, always: always, before: before });
            }
            return this;
        }
    }, {
        key: 'finish',
        value: function finish(resolve, reject, always) {
            if (!this.waitList.length && !this.deferItem) {
                this.innerResolve({ resolve: resolve, reject: reject, always: always });
            } else {
                this.resolve = resolve;
                this.reject = reject ? reject : this.reject;
            }
            return this;
        }
        // tslint:disable-next-line no-reserved-keywords

    }, {
        key: 'finally',
        value: function _finally(resolve, reject, always) {
            return this.finish(resolve, reject, always);
        }
        // tslint:disable-next-line no-reserved-keywords

    }, {
        key: 'catch',
        value: function _catch(reject) {
            if (!this.waitList.length && !this.deferItem) {
                this.innerResolve({ resolve: noop, reject: reject });
            } else {
                this.reject = reject;
            }
            return this;
        }
    }, {
        key: 'always',
        value: function always(_always) {
            this.alwaysFn = _always;
            return this;
        }
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
                if (isIdefer(keyObj)) {
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
                this.innerAlways();
            }
        }
    }, {
        key: 'innerResolve',
        value: function innerResolve(then, result) {
            var _this2 = this;

            // call entry two
            var deferItem = void 0;
            if (this.unResolveRejection) {
                if (then.reject) {
                    if (then.before) {
                        then.before();
                    }
                    then.reject(this.unResolveRejection);
                    if (then.always) {
                        then.always();
                    }
                    this.unResolveRejection = null;
                } else if (this.innerRejection(this.unResolveRejection, then.always, then.before)) {
                    this.unResolveRejection = null;
                }
                return this;
            } else {
                try {
                    if (then.before) {
                        then.before();
                    }
                    deferItem = then.resolve(result);
                    if (then.always) {
                        then.always();
                    }
                } catch (e) {
                    if (!this.innerRejection(e, then.always)) {
                        this.unResolveRejection = e;
                    }
                    return this;
                }
            }
            if (isPromise(deferItem)) {
                // object Promise
                this.deferItem = deferItem;
                deferItem.then(function (data) {
                    _this2.commitChain(data);
                }, function (error) {
                    _this2.innerRejection(error, deferItem.always);
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
        // fn may be the always fn

    }, {
        key: 'innerRejection',
        value: function innerRejection(error, fn, beforeFn) {
            var reject = void 0;
            var always = fn;
            var before = beforeFn;
            // if (this.waitList.length && !isIdefer(this.waitList[0])) {
            if (this.waitList.length) {
                var index = 0;
                for (var i = 0; i < this.waitList.length; i = i + 1) {
                    if (!isIdefer(this.waitList[i]) && this.waitList[i].reject) {
                        reject = this.waitList[i].reject;
                        always = this.waitList[i].always;
                        before = this.waitList[i].before;
                        index = i;
                        break;
                    }
                }
                this.waitList.splice(0, index);
            }
            if (!reject && this.reject) {
                reject = this.reject;
            }
            if (reject) {
                this.deferItem = null;
                if (before) {
                    before();
                }
                reject(error);
                if (always) {
                    always();
                }
                this.innerAlways();
                return true;
            } else {
                this.innerAlways();
                return false;
            }
        }
    }, {
        key: 'innerAlways',
        value: function innerAlways() {
            if (this.alwaysFn) {
                this.alwaysFn();
            }
        }
    }]);

    return Chain;
}();

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Collection = function (_Chain) {
    _inherits(Collection, _Chain);

    function Collection() {
        _classCallCheck$1(this, Collection);

        return _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).call(this, { request: {}, modules: {} }, {}));
    }

    _createClass$1(Collection, [{
        key: 'add',
        value: function add(fn, key) {
            // may use for js
            if (!isFunction(fn)) {
                throw new Error('The input must be a Function.');
            }
            if (!getFunctionName(fn) && !key) {
                throw new Error('The input function must have a name.');
            }
            var name = key || getFunctionName(fn);
            this.request.request[name] = fn;
            return this;
        }
    }]);

    return Collection;
}(Chain);

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
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
        _classCallCheck$2(this, Request);

        this.requestConfig = request;
        this.setting = this.getRequestConfig();
        this.actionCollection = this.requestConfig.action;
        this.requestFormat();
    }

    _createClass$2(Request, [{
        key: 'chain',
        value: function chain() {
            return new Chain(this.request, this.actionCollection);
        }
    }, {
        key: 'collection',
        value: function collection() {
            return new Collection();
        }
        // add request

    }, {
        key: 'add',
        value: function add() {}
        // wrap-start: wrap method to avoid use chain

    }, {
        key: 'commit',
        value: function commit() {
            var chain = this.chain();

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return chain.commit.apply(chain, args);
        }
    }, {
        key: 'action',
        value: function action() {
            var chain = this.chain();

            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            return chain.action.apply(chain, args);
        }
    }, {
        key: 'then',
        value: function then() {
            var chain = this.chain();

            for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
            }

            return chain.then.apply(chain, args);
        }
    }, {
        key: 'finish',
        value: function finish() {
            var chain = this.chain();

            for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                args[_key5] = arguments[_key5];
            }

            return chain.finish.apply(chain, args);
        }
        // tslint:disable-next-line no-reserved-keywords

    }, {
        key: 'catch',
        value: function _catch() {
            var chain = this.chain();

            for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                args[_key6] = arguments[_key6];
            }

            return chain.catch.apply(chain, args);
        }
    }, {
        key: 'always',
        value: function always() {
            var chain = this.chain();

            for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                args[_key7] = arguments[_key7];
            }

            return chain.always.apply(chain, args);
        }
        // tslint:disable-next-line no-reserved-keywords

    }, {
        key: 'finally',
        value: function _finally() {
            var chain = this.chain();

            for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                args[_key8] = arguments[_key8];
            }

            return chain.finally.apply(chain, args);
        }
        // wrap end

    }, {
        key: 'commitWrap',
        value: function commitWrap(key) {
            var _ref;

            for (var _len9 = arguments.length, args = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
                args[_key9 - 1] = arguments[_key9];
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
            var outputRequest = {
                request: {},
                modules: {}
            };
            var requestKes = Object.keys.call(null, this.requestConfig.request || {});
            var modulesKeys = Object.keys.call(null, this.requestConfig.modules || {});
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = requestKes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    outputRequest.request[i] = formatFunctionToPromise(this.setting.config.promiseWrap, this.requestConfig.request[i]);
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

            var loopRequest = function loopRequest(mKeys, setting, pModule, resultRequest) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = mKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _i = _step2.value;

                        var tmpRequest = {
                            request: {},
                            modules: {}
                        };
                        var tmpKeys = Object.keys.call(null, pModule[_i].request || {});
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = tmpKeys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var j = _step3.value;

                                tmpRequest.request[j] = formatFunctionToPromise(setting.modules[_i].config.promiseWrap, pModule[_i].request[j]);
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

                        resultRequest.modules[_i] = tmpRequest;
                        var subModules = Object.keys.call(null, pModule[_i].modules || {});
                        if (subModules.length) {
                            loopRequest(subModules, setting.modules[_i], pModule[_i].modules, resultRequest.modules[_i]);
                        }
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
            };
            loopRequest(modulesKeys, this.setting, this.requestConfig.modules, outputRequest);
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
            var loopModules = function loopModules(modulesKey, modules, pModules) {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = modulesKey[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var i = _step4.value;

                        pModules.modules[i] = {
                            config: Object.assign({}, pModules.config),
                            modules: {}
                        };
                        var tmpKeys = Object.keys.call(null, modules[i].config || {});
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = tmpKeys[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var j = _step5.value;

                                pModules.modules[i].config[j] = modules[i].config[j];
                            }
                            // 如果还有子module 循环
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

                        var subModules = Object.keys.call(null, modules[i].modules || {});
                        if (subModules.length) {
                            loopModules(subModules, modules[i].modules, pModules.modules[i]);
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
            };
            loopModules(modulesKeys, this.requestConfig.modules, tmpConfig);
            return tmpConfig;
        }
    }], [{
        key: 'PROMISEWRAP',
        value: function PROMISEWRAP(fn) {
            return formatFunctionToPromise(true, fn);
        }
    }]);

    return Request;
}();

export default Request;
//# sourceMappingURL=request-model.esm.js.map
