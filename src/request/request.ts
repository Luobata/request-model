/*
 * @description request.ts
 */

import { commitToken } from 'Lib/conf';
import logger from 'Lib/logger';
import Chain from 'Request/chain';

// tslint:disable no-any no-unsafe-any

export interface IRequest {
    [key: string]: Function | IRequest;
}

interface IModule {
    [key: string]: IRequestConfig;
}

interface IAction {
    [key: string]: Function;
}

interface IConfig {
    promiseWrap?: boolean;
    [key: string]: boolean;
}

export interface IRequestConfig {
    request: IRequest;
    modules?: IModule;
    config?: IConfig;
    action?: IAction;
}

interface IoutputRequest {
    request: IRequest;
}

interface IrequestConfig {
    config: IConfig;
    modules?: {
        [key: string]: IConfig;
    };
}

const defaultConfig: IConfig = {
    promiseWrap: false,
};

// export interface IcommitWrap {
//     [commitToken]: boolean;
//     key: string;
//     args: any[];
// }

const formatFunctionToPromise: Function = (
    flag: boolean,
    fn: Function,
): Function => {
    if (flag) {
        return (...args: any[]): Promise<any> => {
            return new Promise((resolve: Function, reject: Function): any => {
                fn.call(null, resolve, reject, ...args);
            });
        };
    } else {
        return fn;
    }
};

/**
 * class Request
 */
export default class Request {
    public request: IRequest;

    private requestConfig: IRequestConfig;
    private setting: IrequestConfig;

    constructor(request: IRequestConfig) {
        this.requestConfig = request;

        this.setting = this.getRequestConfig();
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
            this.requestConfig.request || {},
        );
        const modulesKeys: string[] = Object.keys.call(
            null,
            this.requestConfig.modules || {},
        );

        for (const i of requestKes) {
            outputRequest[i] = formatFunctionToPromise(
                this.setting.config.promiseWrap,
                this.requestConfig.request[i],
            );
        }

        for (const i of modulesKeys) {
            const tmpRequest: IRequest = {};
            const tmpKeys: string[] = Object.keys.call(
                null,
                this.requestConfig.modules[i].request || {},
            );
            for (const j of tmpKeys) {
                tmpRequest[j] = formatFunctionToPromise(
                    this.setting.modules[i].promiseWrap,
                    <Function>(<IRequest>this.requestConfig.modules[i].request)[
                        j
                    ],
                );
            }
            outputRequest[i] = tmpRequest;
        }

        this.request = outputRequest;
    }

    private getRequestConfig(): IrequestConfig {
        const tmpConfig: IrequestConfig = {
            config: defaultConfig,
            modules: {},
        };
        const keys: string[] = Object.keys.call(
            null,
            this.requestConfig.config || {},
        );
        const modulesKeys: string[] = Object.keys.call(
            null,
            this.requestConfig.modules || {},
        );

        keys.map((v: string): void => {
            tmpConfig.config[v] = this.requestConfig.config[v];
        });

        for (const i of modulesKeys) {
            tmpConfig.modules[i] = { ...tmpConfig.config };
            const tmpKeys: string[] = Object.keys.call(
                null,
                this.requestConfig.modules[i].config || {},
            );
            for (const j of tmpKeys) {
                tmpConfig.modules[i][j] = (<IConfig>this.requestConfig.modules[
                    i
                ].config)[j];
            }
        }

        return tmpConfig;
    }
}
