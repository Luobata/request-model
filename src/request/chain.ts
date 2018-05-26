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
    Request: Request;
    private deferItem: Promise<any> | null;
    private waitList: Idefer[];

    constructor(Request: Request) {
        this.Request = Request;
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
            this.deferItem.then(() => {
                if (this.waitList.length) {
                    const keyObj: Idefer = this.waitList.shift();
                    this.deferItem = null;
                    this.commit(keyObj.key, ...keyObj.args);
                }
            });
        }

        return this;
    }
}
