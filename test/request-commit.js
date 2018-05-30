/* eslint-disable */
const assert = require('assert');
const RequestModel = require('../dist/request-model').default;

const rModel = new RequestModel({
    state: {},
    request: {
        getNameById(params) {
            // 返回一个Promise
            // 能不能自动包成一个Promise
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 20);
            });
        },
        enums(params, params2) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([params, params2]);
                }, 10);
            });
            // 返回一个Promise
        },
        enums2(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 20);
            });
            // 返回一个Promise
        },
        enums3(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject(params);
                }, 20);
            });
            // 返回一个Promise
        },
        enums4(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 20);
            });
            // 返回一个Promise
        },
    },
});
it('basic usage', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .commit('enums', 2)
        .commit('enums2', 4)
        .finish(data => {
            result = data;
            assert.deepEqual(result, [1, [2, 1], 4]);
            done();
        });
});
it('method then usage with no-promise return', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .then(data => {
            return 'abc';
        })
        .commit('enums2')
        .finish(data => {
            result = data;
            assert.deepEqual(result, [1, 'abc', 'abc']);
            done();
        });
});

it('method then usage with promise return', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .then(data => {
            return rModel.commitWrap('enums2', 222);
        })
        .commit('enums', 111)
        .finish(data => {
            result = data;
            assert.deepEqual(result, [1, 222, [111, 222]]);
            done();
        });
});

it('method commit with Array input', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .commit(['enums4', 'enums2'])
        .commit('enums', 111)
        .finish(data => {
            result = data;
            assert.deepEqual(result, [
                1,
                [undefined, undefined],
                [111, [undefined, undefined]],
            ]);
            done();
        });
});

it('method commit with Array input and arguments', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .commit([
            {
                handler: 'enums4',
                args: [4],
            },
            {
                handler: 'enums',
                args: [1, 2],
            },
        ])
        .finish(data => {
            result = data;
            assert.deepEqual(result, [1, [4, [1, 2]]]);
            done();
        });
});
