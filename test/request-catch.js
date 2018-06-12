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

it('method catch usage', function(done) {
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

it('method catch usage with commit error', function(done) {
    rModel
        .chain()
        .commit('error')
        .then(
            data => {},
            data => {
                assert.deepEqual(data.message, 'error');
                done();
            },
        );
});

it('method then reject aync catch', function(done) {
    rModel
        .chain()
        .then(() => {
            throw new Error('error');
        })
        .then(
            data => {
                assert.deepEqual(data, undefined);
            },
            data => {
                assert.deepEqual(data.message, 'error');
            },
        )
        .commit('getNameById', 1)
        .then(
            data => {
                assert.deepEqual(data, 1);
                done();
            },
            data => {
                assert.deepEqual(data, undefined);
            },
        );
});

it('method then reject aync catch', function(done) {
    rModel
        .chain()
        .then(() => {
            throw new Error('error');
        })
        .then(data => {
            assert.deepEqual(data, undefined);
        })
        .commit('getNameById', 1)
        .then(
            data => {
                assert.deepEqual(data, undefined);
            },
            data => {
                assert.deepEqual(data.message, 'error');
                done();
            },
        );
});
