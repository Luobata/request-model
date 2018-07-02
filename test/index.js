import RequestModel from '../src/index';
import clue from './test-model/clue';
import wrap from './test-model/wrap';

/* eslint-disable */

window.onload = () => {
    const rModel = new RequestModel({
        state: {},
        modules: {
            clue,
            wrap,
        },
        request: {
            getNameById(params) {
                console.log(params);
                // 返回一个Promise
                // 能不能自动包成一个Promise
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(params);
                    }, 0);
                });
            },
            enums(params, params2) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve([params, params2]);
                    }, 0);
                });
                // 返回一个Promise
            },
            enums2(params) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(params);
                    }, 0);
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
                        resolve(params);
                    }, 2000);
                });
                // 返回一个Promise
            },
            reject(params) {
                // rejct
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject(params);
                    }, 0);
                });
            },
            error(params) {
                // error when call
                return new Promise((resolve, reject) => {
                    throw new Error('error');
                    setTimeout(() => {
                        console.log(a);
                        resolve(params);
                    }, 0);
                });
            },
        },
        action: {
            init(chain, ...args) {
                return chain
                    .commit('getNameById', args[0])
                    .commit('enums', args[1]);
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

    const test6 = () => {
        rModel
            .chain()
            .commit('getNameById')
            .commit([
                {
                    handler: 'enums4',
                    args: [4],
                },
                {
                    handler: 'enums',
                    args: [2],
                },
            ])
            .commit('enums');
    };
    const test7 = () => {
        rModel
            .chain()
            .commit('clue/getClueList', 33)
            .commit('clue/getClueEnums', 22)
            .finish(data => {
                console.log(data);
            });
    };

    const test8 = () => {
        rModel
            .chain()
            .commit('wrap/getClueList', 33)
            .commit('wrap/getClueEnums', 22);
    };
    const test9 = () => {
        rModel
            .chain()
            .action('init', 1, 2)
            .commit('enums', 'c')
            .commit('wrap/getClueList', 33)
            .commit('wrap/getClueEnums', 22)
            .action('init', 3, 4)
            .finish(data => {
                console.log(data);
            });
    };

    const test10 = () => {
        rModel
            .chain()
            .commit('getNameById', 1)
            .then(data => {
                return rModel.commitAll([
                    rModel.commitWrap('enums', 2, 3),
                    rModel.commitWrap('enums4', 4),
                ]);
            })
            .commit('enums', 111)
            .finish(data => {
                console.log(data);
            });
    };

    const test11 = () => {
        rModel
            .chain()
            .then(data => {
                return rModel.commitAll([
                    rModel.commitWrap('enums2', 2),
                    rModel.commitWrap('enums4', 4),
                ]);
            })
            .commit('enums', 111)
            .finish(data => {
                console.log(data);
            });
    };

    const test12 = () => {
        rModel
            .chain()
            .then(data => {
                return rModel.commitAll([
                    rModel.commitWrap('enums2', 2),
                    rModel.commitWrap('enums4', 4),
                ]);
            })
            .finish(data => {
                console.log(data);
            });
    };
    const test13 = () => {
        rModel
            .chain()
            .commit('enums', 111)
            .then(data => {})
            .commit('getNameById', 222)
            .then(data => {
                console.log(data);
            });
    };

    const test14 = () => {
        rModel
            .chain()
            .commit(['enums', 'reject'])
            .then(
                data => {},
                data => {
                    console.log(data);
                },
            );
    };
    const test15 = () => {
        rModel
            .chain()
            .commit('getNameById', 1)
            .then(data => {
                // return rModel.commitWrap('reject', 3);
                return rModel.commitAll([
                    rModel.commitWrap('enums2', 2),
                    rModel.commitWrap('reject', 4),
                ]);
            })
            .then(
                data => {},
                data => {
                    console.log(data);
                },
            );
    };
    const test16 = () => {
        rModel
            .chain()
            .commit('error')
            .then(
                data => {},
                data => {
                    console.log(data);
                },
            );
    };
    const test18 = () => {
        rModel
            .chain()
            //.commit('getNameById', 1)
            .then(() => {
                // return new Promise((resolve, reject) => {
                //     console.log(b);
                // });
                console.log(b);
                //return rModel.commitWrap('error');
            })
            .then(data => {
                console.log(1, 12);
            })
            // .commit('getNameById', 4)
            // .then(() => {
            //     return rModel.commitWrap('getNameById', 3);
            // })
            .finish(
                data => {
                    console.log(2, 12);
                },
                data => {
                    console.log(2, data);
                },
            );
    };
    const test19 = () => {
        rModel
            .chain()
            .commit('getNameById', 1)
            .then(() => {
                console.log(b);
            })
            .then(data => {
                console.log(1, 12);
            })
            .then(data => {
                console.log(2, 12);
            })
            .finish(
                data => {
                    console.log(data);
                },
                data => {
                    console.log(2, data);
                },
            );
    };
    const test17 = () => {
        return new Promise((resolve, reject) => {
            try {
                console.log(a);
            } catch (e) {
                reject(e);
            }
        });
    };
    const test20 = () => {
        rModel
            .chain()
<<<<<<< HEAD
            .commit('wrap/city/getCityList', 33)
            .commit('clue/city/getCityNum', 22)
            .finish(data => {
                console.log(data);
            });
=======
            .commit([
                {
                    handler: 'enums4',
                    args: [4],
                },
                {
                    handler: 'enums',
                    args: [2],
                },
            ])
            .commit('enums');
>>>>>>> add: finally test case
    };

    test20();
    // test17()
    //     .then(
    //         () => {
    //             console.log(2);
    //         },
    //     )
    //     .then(
    //         () => {
    //             console.log(1);
    //         },
    //     )
    //     .catch(e => {
    //         console.log(e);
    //     });
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
