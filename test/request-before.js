/* eslint-disable */
const assert = require('assert');

it('before only in then argumennts', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .then(
            data => {},
            data => {},
            data => {},
            data => {
                done();
            },
        );
});
