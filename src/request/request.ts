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

export interface IAction {
    [key: string]: Function;
}

interface IConfig {
    promiseWrap?: boolean;
    [key: string]: boolean;
}

export interface IcommitWrap {
    key: string;
    args: any[];
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
    modules: {
        [key: string]: IrequestConfig;
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

// tslint:disable promise-function-async
const formatFunctionToPromise: Function = (
    flag: boolean,
    fn: Function,
): Function => {
    if (flag) {
        return (...args: any[]): Promise<any> => {
            return new Promise(
                (resolve: Function, reject: Function): any => {
                    fn.call(null, resolve, reject, ...args);
                },
            );
        };
    } else {
        return fn;
    }
};
// tslint:enable promise-function-async

/**
 * class Request
 */
export default class Request {
    public request: IRequest;

    private requestConfig: IRequestConfig;
    private setting: IrequestConfig;
    private action: IAction;

    constructor(request: IRequestConfig) {
        this.requestConfig = request;

        this.setting = this.getRequestConfig();
        console.log(this.setting);
        this.action = this.requestConfig.action;
        this.requestFormat();
    }

    public chain(): Chain {
        return new Chain(this.request, this.action);
    }

    public commitWrap(key: string, ...args: any[]): object {
        return {
            [commitToken]: true,
            key,
            args: [...args],
        };
    }

    public commitAll(commitWrap: IcommitWrap[]): object[] {
        return commitWrap.map(
            (v: IcommitWrap): object => {
                return {
                    [commitToken]: true,
                    key: v.key,
                    args: [...v.args],
                };
            },
        );
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
                    this.setting.modules[i].config.promiseWrap,
                    <Function>this.requestConfig.modules[i].request[j],
                );
            }
            outputRequest[i] = tmpRequest;
        }

        this.request = outputRequest;
        console.log(this.request);
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

        keys.map(
            (v: string): void => {
                tmpConfig.config[v] = this.requestConfig.config[v];
            },
        );

        const loopModules = (
            modulesKeys: string[],
            modules: IModule,
            pModules: IrequestConfig,
        ) => {
            for (const i of modulesKeys) {
                pModules.modules[i] = {
                    config: { ...pModules.config },
                    modules: {},
                };
                const tmpKeys: string[] = Object.keys.call(
                    null,
                    modules[i].config || {},
                );
                for (const j of tmpKeys) {
                    pModules.modules[i].config[j] = modules[i].config[j];
                }

                // 如果还有子module 循环
                const subModules: string[] = Object.keys.call(
                    null,
                    modules[i].modules || {},
                );
                if (subModules.length) {
                    loopModules(
                        subModules,
                        modules[i].modules,
                        pModules.modules[i],
                    );
                }
            }
        };
        loopModules(modulesKeys, this.requestConfig.modules, tmpConfig);

        return tmpConfig;
    }
}
