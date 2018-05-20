import RequestModel from '../src/index';

const rModel = new RequestModel({
    state: {},
    request: {
        getNameById() {
            // 返回一个Promise
        },
        enums() {
            // 返回一个Promise
        },
    },
});

// 实现requst嵌套 all之类的操作

// simply request
rModel.request.getNameById();

rModel.request.getNameById().then(
    (request, data) => {
        console.log(data);
    },
    errData => {
        console.log(errData);
    },
);

// multi request
rModel.request
    .getNameById()
    .then(request => request.enums())
    .catch(errData => {
        console.log(errData);
    });

// all
rModel.promise.all(request => [request.enums, request.getNameById]).then();
