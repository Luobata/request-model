/* eslint-disable */

const city = {
    state: {},
    request: {
        getCityList(params) {
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
