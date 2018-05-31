/* eslint-disable */

const clue = {
    state: {},
    request: {
        getClueList(params) {
            // 返回一个Promise
            // 能不能自动包成一个Promise
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('getClueList', params);
                    resolve(1);
                }, 0);
            });
        },
        getClueEnums(params, params2) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log('getClueEnums', params, params2);
                    resolve(2);
                }, 0);
            });
            // 返回一个Promise
        },
    },
};

export default clue;
