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

    constructor(request: IRequestConfig) {
        this.requestConfig = request;

        this.requestFormat();
    }

    public commit(key: string): Request {
        if (!this.request.hasOwnProperty(key)) {
            // logger.error('can not find matched key function');
            throw new Error('can not find matched key function');
        }

        this.request[key]();

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
