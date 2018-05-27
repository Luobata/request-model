/*
 * @description request.ts
 */

import logger from 'Lib/logger';
import Chain from 'Request/chain';
import { commitToken } from 'Lib/conf';

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

    public chain(): Chain {
        return new Chain(this);
    }

    public commitWrap(key: string, ...args: any[]) {
        return {
            [commitToken]: true,
            key,
            args: [...args],
        };
    }

    private requestFormat(): void {
        const outputRequest: IRequest = {};
        for (const i in this.requestConfig.request) {
            outputRequest[i] = this.requestConfig.request[i];
        }

        this.request = outputRequest;
    }
}
