/* eslint-disable */
const assert = require('assert');

it('method then usage with reject catch', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .then(data => {})
        .commit('reject', 2)
        .then(
            data => {},
            data => {
                assert.deepEqual(data, 2);
                done();
            },
        );
});
