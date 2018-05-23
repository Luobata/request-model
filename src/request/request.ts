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
export default class Reuest {
    private requestConfig: IRequestConfig;

    public requestModel: IoutputRequest;

    constructor(request: IRequestConfig) {
        this.requestConfig = request;

        this.requestFormat();
    }

    private requestFormat(): void {
        const outputRequest: IRequest = {};
        for (const i in this.requestConfig.request) {
            outputRequest[i] = this.requestConfig.request[i];
        }

        this.requestModel = {
            request: outputRequest,
        };
    }
}
