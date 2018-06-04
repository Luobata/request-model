/* eslint-disable */

const wrap = {
    state: {},
    request: {
        getClueList(resolve, reject, params) {
            // 返回一个Promise
            // 能不能自动包成一个Promise
            setTimeout(() => {
                console.log(resolve);
                console.log(params);
                resolve(params);
            }, 1000);
        },
        getClueEnums(resolve, reject, params, params2) {
            setTimeout(() => {
                console.log(params, params2);
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
