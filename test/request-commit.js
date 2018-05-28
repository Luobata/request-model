/* eslint-disable */
const assert = require('assert');
const RequestModel = require('../dist/request-model');

let result;

const rModel = new RequestModel({
    state: {},
    request: {
        getNameById(params) {
            // 返回一个Promise
            // 能不能自动包成一个Promise
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 2000);
            });
        },
        enums(params, params2) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([params, params2]);
                }, 1000);
            });
            // 返回一个Promise
        },
        enums2(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 2000);
            });
            // 返回一个Promise
        },
        enums3(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(params);
                }, 2000);
            });
            // 返回一个Promise
        },
        enums4(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 2000);
            });
            // 返回一个Promise
        },
    },
});
it('basic usage', () => {
    result = rModel
        .chain()
        .commit('getNameById')
        .commit('enums')
        .commit('enums')
        .commit('enums2')
        .catch(data => {
            console.log(data);
        });
    console.log(result);
});
