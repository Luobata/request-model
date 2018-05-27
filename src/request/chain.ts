/**
 * @description chain
 */
import { isPromise } from 'Lib/help';
import Request from 'Request/request';

interface Idefer {
    key: string;
    args: any[];
}

/**
 * default class Chain
 */
export default class Chain {
    private Request: Request;
    private deferItem: Promise<any> | null;
    private waitList: Idefer[];
    private resultList: any[];
    private resolve: Function;
    private reject: Function;

    constructor(Request: Request) {
        this.Request = Request;
        this.resultList = [];
        this.waitList = [];
    }

    public commit(key: string, ...args: any[]): Chain {
        // console.log(...args);
        if (!this.Request.request.hasOwnProperty(key)) {
            throw new Error(`can not find matched ${key} function`);
        }

        if (this.deferItem) {
            this.waitList.push({
                key,
                args,
            });
        } else {
            const defer: Promise<any> = this.Request.request[key](...args);
            if (!isPromise(defer)) {
                throw new Error(
                    `The ${key} function not return a Promise function`,
                );
            }
            this.deferItem = defer;
            this.deferItem.then(
                (result: any) => {
                    this.resultList.push(result);
                    if (this.waitList.length) {
                        const keyObj: Idefer = this.waitList.shift();
                        this.deferItem = null;
                        this.commit(keyObj.key, ...keyObj.args, result);
                    } else {
                        if (this.resolve) {
                            this.resolve(this.resultList);
                        }
                    }
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
        this.resolve = resolve;
        this.reject = reject;

        return this;
    }

    public catch(reject: Function): Chain {
        this.reject = reject;

        return this;
    }
}
