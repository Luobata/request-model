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

it('method then usage with commitWrap catch', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .then(data => {
            return rModel.commitWrap('reject', 2);
        })
        .then(
            data => {},
            data => {
                assert.deepEqual(data, 2);
                done();
            },
        );
});
it('method then usage with commitAll catch', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .then(data => {
            return rModel.commitAll([
                rModel.commitWrap('enums2', 2),
                rModel.commitWrap('reject', 4),
            ]);
        })
        .then(
            data => {},
            data => {
                assert.deepEqual(data, 4);
                done();
            },
        );
});

it('method finish usage with reject catch', function(done) {
    rModel
        .chain()
        .commit('reject', 2)
        .finish(
            data => {},
            data => {
                assert.deepEqual(data, 2);
                done();
            },
        );
});

it('method catch usage ', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .then(data => {})
        .commit('reject', 2)
        .catch(data => {
            assert.deepEqual(data, 2);
            done();
        });
});
