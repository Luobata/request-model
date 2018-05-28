/**
 * @description chain
 */
import { commitToken } from 'Lib/conf';
import { isArray, isPromise } from 'Lib/help';
import Request from 'Request/request';

// tslint:disable no-any

interface Idefer {
    key: string | string[];
    args: any[];
}

interface Ithen {
    resolve: Function;
    reject: Function;
}

const hasRequest: Function = (
    key: string | string[],
    request: Request,
): boolean => {
    if (isArray(key)) {
        return (
            (<string[]>key).filter(
                (v: string): boolean => !!request.request.hasOwnProperty(v),
            ).length === (<string[]>key).length
        );
    } else {
        return !!request.request.hasOwnProperty(<string>key);
    }
};

const getAll: Function = (key: string[], request: Request): Function[] => {
    return key.map((v: string): Function => request.request[v]());
};

/**
 * default class Chain
 */
export default class Chain {
    private request: Request;
    private deferItem: Promise<any> | null;
    // private waitList: Array<Idefer | Ithen>;
    private waitList: (Idefer | Ithen)[];
    private resultList: any[];
    private resolve: Function;
    private reject: Function;

    constructor(request: Request) {
        this.request = request;
        this.resultList = [];
        this.waitList = [];
    }

    public commit(key: string | string[], ...args: any[]): Chain {
        // if (!this.request.request.hasOwnProperty(key)) {
        if (!hasRequest(key, this.request)) {
            throw new Error(`can not find matched ${key} function`);
        }

        if (this.deferItem) {
            this.waitList.push({
                key,
                args,
            });
        } else {
            let defer: Promise<any>;
            if (isArray(key)) {
                defer = Promise.all(getAll(key, this.request));
            } else {
                defer = this.request.request[<string>key](...args);
            }
            if (!isPromise(defer)) {
                throw new Error(
                    `The ${key} function not return a Promise function`,
                );
            }
            this.deferItem = defer;
            this.deferItem.then(
                (result: any) => {
                    this.commitChain(result);
                },
                (error: any) => {
                    if (this.reject) {
                        this.deferItem = null;
                        this.reject(error);
                    }
                },
            );
        }

        return this;
    }

    public then(resolve: Function, reject: Function): Chain {
        this.waitList.push({
            resolve,
            reject,
        });

        return this;
    }

    public finish(resolve: Function, reject: Function): Chain {
        this.resolve = resolve;
        this.reject = reject;

        return this;
    }

    // tslint:disable no-reserved-keywords
    public catch(reject: Function): Chain {
        this.reject = reject;

        return this;
    }
    // tslint:enable no-reserved-keywords

    private commitChain(result: any): void {
        this.resultList.push(result);
        if (this.waitList.length) {
            const keyObj: Idefer | Ithen = this.waitList.shift();
            this.deferItem = null;
            if ('key' in keyObj) {
                // object Idefer
                this.commit(keyObj.key, ...keyObj.args, result);
            } else {
                // object Ithen
                this.innerResolve(keyObj, result);
            }
        } else {
            if (this.resolve) {
                this.resolve(this.resultList);
            }
        }
    }

    private innerResolve(then: Ithen, result: any): Chain {
        const deferItem: any = then.resolve(result);
        if (isPromise(deferItem)) {
            // object Promise
            deferItem.then(
                (data: any) => {
                    this.commitChain(data);
                    // this.resultList.push(data);
                },
                (error: any) => {
                    if (this.reject) {
                        this.reject(error);
                    }
                },
            );
        } else if (deferItem[commitToken]) {
            // another commit
            this.commit(deferItem.key, ...deferItem.args);
        } else {
            this.commitChain(deferItem);
        }

        return this;
    }
}
