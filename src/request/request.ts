/*
 * @description request.ts
 */

import { commitToken } from 'Lib/conf';
import logger from 'Lib/logger';
import Chain from 'Request/chain';

// tslint:disable no-any

export interface IRequest {
    [key: string]: Function | IRequest;
}

interface IModule {
    [key: string]: IRequest;
}

interface IRequestConfig {
    request: IRequest;
    modules?: IModule;
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

    public commitWrap(key: string, ...args: any[]): object {
        return {
            [commitToken]: true,
            key,
            args: [...args],
        };
    }

    private requestFormat(): void {
        const outputRequest: IRequest = {};
        const requestKes: string[] = Object.keys.call(
            null,
            this.requestConfig.request,
        );
        const modulesKeys: string[] = Object.keys.call(
            null,
            this.requestConfig.modules,
        );
        for (const i of requestKes) {
            outputRequest[i] = this.requestConfig.request[i];
        }
        // for (const i in this.requestConfig.request) {
        //     outputRequest[i] = this.requestConfig.request[i];
        // }

        // for (const i in this.requestConfig.modules) {
        //     const tmpRequest: IRequest = {};
        //     for (const j in this.requestConfig.modules[i].request) {
        //         tmpRequest[j] = (<IRequest>this.requestConfig.modules[i]
        //             .request)[j];
        //     }
        //     outputRequest[i] = tmpRequest;
        // }

        for (const i of modulesKeys) {
            const tmpRequest: IRequest = {};
            const tmpKeys: string[] = Object.keys.call(
                null,
                this.requestConfig.modules[i].request,
            );
            for (const j of tmpKeys) {
                tmpRequest[j] = (<IRequest>this.requestConfig.modules[i]
                    .request)[j];
            }
            outputRequest[i] = tmpRequest;
        }

        this.request = outputRequest;
    }
}
