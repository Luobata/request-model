import RequestModel from '../src/index';

window.onload = () => {
    const rModel = new RequestModel({
        state: {},
        request: {
            getNameById(params) {
                // 返回一个Promise
                // 能不能自动包成一个Promise
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('xxx');
                        resolve(1);
                    }, 2000);
                });
            },
            enums() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('enums');
                        resolve(2);
                    }, 1000);
                });
                // 返回一个Promise
            },
            enums2() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log('enums2');
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
    rModel
        .chain()
        .commit('getNameById')
        .commit('enums')
        .commit('enums')
        .commit('enums2');

    rModel
        .chain()
        .commit('getNameById')
        .commit('enums')
        .commit('enums')
        .commit('enums2');
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
