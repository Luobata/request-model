/**
 * @desc collection class
 */

import { getFunctionName, isFunction } from 'Lib/help';
import Chain from 'Request/chain';

export default class Collection extends Chain {
    constructor() {
        super({ request: {}, modules: {} }, {});
    }

    public add(fn: Function, key?: string): Collection {
        // may use for js
        if (!isFunction(fn)) {
            throw new Error('The input must be a Function.');
        }

        if (!getFunctionName(fn) && !key) {
            throw new Error('The input function must have a name.');
        }

        const name: string = key || getFunctionName(fn);
        this.request.request[name] = fn;

        return this;
    }

    // public commit(key: string): Collection {
    //     return this;
    // }

    // public then(): Collection {
    //     return this;
    // }
}
