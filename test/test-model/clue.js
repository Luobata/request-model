/* eslint-disable */
const city = require('./city');

const clue = {
    state: {},
    modules: {
        city,
    },
    request: {
        getClueList(params) {
            // 返回一个Promise
            // 能不能自动包成一个Promise
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 0);
            });
        },
        getClueEnums(params, params2) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 0);
            });
            // 返回一个Promise
        },
    },
    config: {
        promiseWrap: false,
    },
};

module.exports = clue;
// export default clue;
