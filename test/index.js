import RequestModel from '../src/index';

const rModel = new RequestModel({
    state: {},
    request: {
        getNameById(params) {
            // 返回一个Promise
            // 能不能自动包成一个Promise
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(1);
                }, 2000);
            });
        },
        enums() {
            setTimeout(() => {
                resolve(2);
            }, 2000);
            // 返回一个Promise
        },
    },
});

// 实现requst嵌套 all之类的操作

// simply request
// rModel.request.getNameById();
//
// rModel.request.getNameById().then(
//     (request, data) => {
//         console.log(data);
//     },
//     errData => {
//         console.log(errData);
//     },
// );

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
