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
    private deferList: Promise<any>[];
    private waitList: string[];

    constructor(request: IRequestConfig) {
        this.requestConfig = request;
        this.deferList = [];
        this.waitList = [];

        this.requestFormat();
    }

    public commit(key: string): Request {
        if (!this.request.hasOwnProperty(key)) {
            // logger.error('can not find matched key function');
            throw new Error('can not find matched key function');
        }

        if (this.deferList.length) {
            this.waitList.push(key);
            this.deferList[this.deferList.length - 1].then(() => {
                this.deferList.pop();
                this.commit(this.waitList.shift());
                // this.request[key]();
            });
        } else {
            const defer: Promise<any> = this.request[key]();
            this.deferList.push(defer);
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
