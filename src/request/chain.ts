/**
 * @description chain
 */
import { isPromise } from 'Lib/help';
import Request from 'Request/request';

/**
 * default class Chain
 */
export default class Chain {
    Request: Request;
    private deferItem: Promise<any> | null;
    private waitList: string[];

    constructor(Request: Request) {
        this.Request = Request;
        this.waitList = [];
    }

    public commit(key: string): Chain {
        if (!this.Request.request.hasOwnProperty(key)) {
            throw new Error(`can not find matched ${key} function`);
        }

        if (this.deferItem) {
            this.waitList.push(key);
        } else {
            const defer: Promise<any> = this.Request.request[key]();
            if (!isPromise(defer)) {
                throw new Error(
                    `The ${key} function not return a Promise function`,
                );
            }
            this.deferItem = defer;
            this.deferItem.then(() => {
                if (this.waitList.length) {
                    const keyStr: string = this.waitList.shift();
                    this.deferItem = null;
                    this.commit(keyStr);
                }
            });
        }

        return this;
    }
}
