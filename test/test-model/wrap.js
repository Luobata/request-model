/* eslint-disable */

const wrap = {
    state: {},
    request: {
        getClueList(resolve, reject, params) {
            // 能自动包成一个Promise
            setTimeout(() => {
                resolve(params);
            }, 0);
        },
        getClueEnums(resolve, reject, params, params2) {
            setTimeout(() => {
                resolve(params);
            }, 0);
            // 返回一个Promise
        },
    },
    config: {
        promiseWrap: true,
    },
};

module.exports = wrap;
