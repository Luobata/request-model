import RequestModel from '../src/index';

/* eslint-disable */

window.onload = () => {
    const rModel = new RequestModel({
        state: {},
        request: {
            getNameById(params) {
                // 返回一个Promise
                // 能不能自动包成一个Promise
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('xxx', params);
                        resolve(1);
                    }, 2000);
                });
            },
            enums(params, params2) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('enums', params, params2);
                        resolve(2);
                    }, 1000);
                });
                // 返回一个Promise
            },
            enums2(params) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('enums2', params);
                        resolve(3);
                    }, 2000);
                });
                // 返回一个Promise
            },
            enums3(params) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('enums3', params);
                        reject(3);
                    }, 2000);
                });
                // 返回一个Promise
            },
            enums4(params) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('enums4', params);
                        resolve(3);
                    }, 2000);
                });
                // 返回一个Promise
            },
        },
    });
    console.log(rModel);
    // simply request
    // rModel.request.getNameById();

    // rModel.request.getNameById().then(
    //     (request, data) => {
    //         console.log(data);
    //     },
    //     errData => {
    //         console.log(errData);
    //     },
    // );
    const test1 = () => {
        rModel
            .chain()
            .commit('getNameById', 1)
            .commit('enums', 2, 5)
            .commit('enums', 3)
            .commit('enums2', 4)
            .then(
                data => {
                    console.log(data);
                },
                data => {
                    console.log(data);
                },
            );
    };

    const test2 = () => {
        rModel
            .chain()
            .commit('getNameById')
            .commit('enums', 'a')
            .commit('enums')
            .commit('enums2')
            .catch(data => {
                console.log(data);
            });
    };

    const test3 = () => {
        rModel
            .chain()
            .commit('getNameById')
            .then(data => {
                console.log(data);
                return 'abc';
            })
            .commit('enums');
    };

    const test4 = () => {
        rModel
            .chain()
            .commit('getNameById')
            .then(data => {
                console.log(data);
                return rModel.commitWrap('enums2', 222);
            })
            .commit('enums');
    };
    const test5 = () => {
        rModel
            .chain()
            .commit('getNameById')
            .commit(['enums4', 'enums2'])
            .commit('enums');
    };

    test5();
};

// 实现requst嵌套 all之类的操作

// multi request
// rModel.request
//     .getNameById()
//     .then(request => request.enums())
//     .then(data => {
//         console.log(data);
//     })
//     .catch(errData => {
//         console.log(errData);
//     });
//
// // all
// rModel.promise.all(request => [request.enums, request.getNameById]).then();
