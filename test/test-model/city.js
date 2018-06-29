/* eslint-disable */

const city = {
    state: {},
    request: {
        getCityList(params) {
            // 返回一个Promise
            // 能不能自动包成一个Promise
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 0);
            });
        },
        getCityNum(params, params2) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(params);
                }, 0);
            });
            // 返回一个Promise
        },
    },
};

module.exports = city;
// export default clue;
