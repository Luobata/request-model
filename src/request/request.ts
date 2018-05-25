/*
 * @description request.ts
 */

import { isPromise } from 'Lib/help';
import logger from 'Lib/logger';

interface IRequest {
    [key: string]: Function;
}

interface IRequestConfig {
    request: IRequest;
}

interface IoutputRequest {
    request: IRequest;
}

/**
 * class Request
 */
export default class Request {
    public request: IRequest;

    private requestConfig: IRequestConfig;
    private deferItem: Promise<any> | null;
    private waitList: string[];

    constructor(request: IRequestConfig) {
        this.requestConfig = request;
        this.waitList = [];

        this.requestFormat();
    }

    public commit(key: string): Request {
        if (!this.request.hasOwnProperty(key)) {
            throw new Error(`can not find matched ${key} function`);
        }

        if (this.deferItem) {
            this.waitList.push(key);
        } else {
            const defer: Promise<any> = this.request[key]();
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

    private requestFormat(): void {
        const outputRequest: IRequest = {};
        for (const i in this.requestConfig.request) {
            outputRequest[i] = this.requestConfig.request[i];
        }

        this.request = outputRequest;
    }
}
