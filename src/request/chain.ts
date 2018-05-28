/**
 * @description chain
 */
import { commitToken } from 'Lib/conf';
import { isPromise } from 'Lib/help';
import Request from 'Request/request';

// tslint:disable no-any

interface Idefer {
    key: string;
    args: any[];
}

interface Ithen {
    resolve: Function;
    reject: Function;
}

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

    public commit(key: string, ...args: any[]): Chain {
        if (!this.request.request.hasOwnProperty(key)) {
            throw new Error(`can not find matched ${key} function`);
        }

        if (this.deferItem) {
            this.waitList.push({
                key,
                args,
            });
        } else {
            const defer: Promise<any> = this.request.request[key](...args);
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
