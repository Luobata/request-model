/* eslint-disable */
const assert = require('assert');
it('basic usage', function(done) {
    rModel.request
        .getNameById(1)
        .then(data => {
            return rModel.request.enums(2, data);
        })
        .then(data => {
            return rModel.request.enums2(4, data);
        })
        .then(data => {
            result = data;
            assert.deepEqual(result, 4);
            done();
        });
});
it('chain usage', function(done) {
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

it('method commit with commitAll in Array input', function(done) {
    rModel
        .chain()
        .commit('getNameById', 1)
        .then(data => {
            return rModel.commitAll([
                rModel.commitWrap('enums2', 2),
                rModel.commitWrap('enums4', 4),
            ]);
        })
        .commit('enums', 111)
        .finish(data => {
            result = data;
            assert.deepEqual(result, [1, [2, 4], [111, [2, 4]]]);
            done();
        });
});

it('method commit with then infront of any commit', function(done) {
    rModel
        .chain()
        .then(data => {
            return rModel.commitAll([
                rModel.commitWrap('enums2', 2),
                rModel.commitWrap('enums4', 4),
            ]);
        })
        .commit('enums', 111)
        .finish(data => {
            result = data;
            assert.deepEqual(result, [[2, 4], [111, [2, 4]]]);
            done();
        });
});
it('method commit with finish after then without any commit', function(done) {
    rModel
        .chain()
        .then(data => {
            return rModel.commitAll([
                rModel.commitWrap('enums2', 2),
                rModel.commitWrap('enums4', 4),
            ]);
        })
        .finish(data => {
            result = data;
            assert.deepEqual(result, [[2, 4]]);
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
            assert.deepEqual(result, [1, [1, 1], [111, [1, 1]]]);
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
                args: [2],
            },
        ])
        .finish(data => {
            result = data;
            assert.deepEqual(result, [1, [4, [2, 1]]]);
            done();
        });
});

it('method commit with moodule', function(done) {
    rModel
        .chain()
        .commit('clue/getClueList', 33)
        .commit('clue/getClueEnums', 22)
        .finish(data => {
            result = data;
            assert.deepEqual(result, [33, 22]);
            done();
        });
});

it('method commit with moodule', function(done) {
    rModel
        .chain()
        .action('init', 1, 2)
        .commit('enums', 'c')
        .action('init', 3, 4)
        .finish(data => {
            result = data;
            assert.deepEqual(result, [1, [2, 1], ['c', [2, 1]], 3, [4, 3]]);
            done();
        });
});
