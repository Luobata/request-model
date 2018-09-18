/* eslint-disable */
const assert = require('assert');

it('collection basic usage', function(done) {
    const collection = rModel.collection();
    collection.add(
        RequestModel.PROMISEWRAP((resolve, reject, params) => {
            setTimeout(() => {
                resolve(params);
            }, 0);
        }),
        'a',
    );
    collection.add(
        RequestModel.PROMISEWRAP((resolve, reject, params) => {
            setTimeout(() => {
                resolve(params);
            }, 0);
        }),
        'b',
    );
    collection
        .commit('a', 1)
        .commit('b', 2)
        .finish(data => {
            assert.deepEqual(data, [1, 2]);
            done();
        });
});
