/* eslint-disable */
const assert = require('assert');
const RequestModel = require('../dist/request-model').default;
const clue = require('./test-model/clue');
const wrap = require('./test-model/wrap');

it('config with promiseWrap', function(done) {
    rModel
        .chain()
        .commit('wrap/getClueList', 33)
        .commit('wrap/getClueEnums', 22)
        .finish(data => {
            result = data;
            assert.deepEqual(result, [33, 22]);
            done();
        });
});
