/* eslint-disable */
const RequestModel = require('../dist/request-model').default;
const clue = require('./test-model/clue');
const wrap = require('./test-model/wrap');

const rModel = new RequestModel({
    state: {},
    modules: {
        clue,
        wrap,
    },
    request: {
        getNameById(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 0);
            });
        },
        enums(params, params2) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([params, params2]);
                }, 0);
            });
        },
        enums2(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 0);
            });
        },
        enums3(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(params);
                }, 0);
            });
        },
        enums4(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 0);
            });
        },
        reject(params) {
            // rejct
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(params);
                }, 0);
            });
        },
        error(params) {
            // error when call
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        throw new Error('error');
                        resolve(params);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            });
        },
    },
    action: {
        init(chain, ...args) {
            return chain
                .commit('getNameById', args[0])
                .commit('enums', args[1]);
        },
    },
});
global.rModel = rModel;
global.RequestModel = RequestModel;
describe('request-model', () => {
    describe('test commit', () => {
        require('./request-commit');
    });
    describe('test commit without chain', () => {
        require('./request-commit-no-chain');
    });
    describe('test config', () => {
        require('./request-config');
    });
    describe('test error catch', () => {
        require('./request-catch');
    });
    describe('test always', () => {
        require('./request-always');
    });
    describe('test collection', () => {
        require('./request-collection');
    });
});
