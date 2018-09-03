/* eslint-disable */
const assert = require('assert');

it('always in common usage', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .then(data => {})
        .then(data => {}, data => {})
        .always(() => {
            done();
        });
});

it('always after reject usage', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .then(data => {})
        .commit('reject', 2)
        .then(data => {}, data => {})
        .always(() => {
            done();
        });
});

it('always at first but called last', function(done) {
    let a = 1;
    rModel
        .chain()
        .always(() => {
            assert.equal(a, 2);
            done();
        })
        .commit('getNameById', 1)
        .then(data => {})
        .then(
            data => {
                a = 2;
            },
            data => {
                console.log(data);
            },
        );
});
