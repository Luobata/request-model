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
            // 返回一个Promise
            // 能不能自动包成一个Promise
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
            // 返回一个Promise
        },
        enums2(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 0);
            });
            // 返回一个Promise
        },
        enums3(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(params);
                }, 0);
            });
            // 返回一个Promise
        },
        enums4(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 0);
            });
            // 返回一个Promise
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
describe('request-model', () => {
    describe('test commit', () => {
        require('./request-commit');
    });
    describe('test config', () => {
        require('./request-config');
    });
});
