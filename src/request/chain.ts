/**
 * @description chain
 */
import { commitToken } from 'Lib/conf';
import { isArray, isObject, isPromise } from 'Lib/help';
import { getFunctionInRequest } from 'Request/data';
import Request, { IAction } from 'Request/request';

// tslint:disable no-any no-unsafe-any

interface Idefer {
    key: deferKey;
    args: any[];
}

type deferKey = string | string[] | IcommitObj[];
type deferKeyItem = string | IcommitObj;

interface Ithen {
    resolve: Function;
    reject: Function;
}

interface IcommitObj {
    handler: string;
    args: any[];
}

const isCommitObj: Function = (v: any): boolean => {
    return isObject(v) ? 'handler' in v : false;
};

const getKey: Function = (v: deferKeyItem): string => {
    return isCommitObj(v) ? (<IcommitObj>v).handler : <string>v;
};

const getArgs: Function = (v: deferKeyItem): any[] => {
    return isCommitObj(v) ? (<IcommitObj>v).args : [];
};

const hasRequest: Function = (key: deferKey, request: Request): boolean => {
    if (isArray(key)) {
        return (
            (<(string | IcommitObj)[]>key).filter(
                (v: string | IcommitObj): boolean =>
                    !!getFunctionInRequest(getKey(v), request),
            ).length === (<(string | IcommitObj)[]>key).length
        );
    } else {
        return !!getFunctionInRequest(<string>key, request);
    }
};

const getAll: Function = (
    key: (string | IcommitObj)[],
    request: Request,
    args: any[],
): Function[] => {
    return key.map((v: string | IcommitObj): Function =>
        getFunctionInRequest(getKey(v), request)(...getArgs(v), ...args),
    );
};

/**
 * default class Chain
 */
export default class Chain {
    private request: Request;
    private actionFun: IAction;
    private deferItem: Promise<any> | null;
    private waitList: (Idefer | Ithen)[];
    private resultList: any[];
    private resolve: Function;
    private reject: Function;

    constructor(request: Request, action: IAction) {
        this.request = request;
        this.resultList = [];
        this.waitList = [];
        this.actionFun = action;
    }

    public commit(key: deferKey, ...args: any[]): Chain {
        if (!hasRequest(key, this.request)) {
            throw new Error(`can not find matched ${key} function`);
        }

        if (this.deferItem) {
            this.waitList.push({
                key,
                args,
            });
        } else {
            let defer: Promise<any>;
            if (isArray(key)) {
                defer = Promise.all(getAll(key, this.request, [...args]));
            } else {
                defer = getFunctionInRequest(<string>key, this.request)(
                    ...args,
                );
            }
            if (!isPromise(defer)) {
                throw new Error(
                    `The ${key} function not return a Promise function`,
                );
            }
            this.deferItem = defer;
            this.deferItem.then(
                (result: any) => {
                    this.commitChain(result);
                },
                (error: any) => {
                    if (this.reject) {
                        this.deferItem = null;
                        this.reject(error);
                    }
                },
            );
        }

        return this;
    }

    public then(resolve: Function, reject: Function): Chain {
        this.waitList.push({
            resolve,
            reject,
        });

        return this;
    }

    public finish(resolve: Function, reject: Function): Chain {
        this.resolve = resolve;
        this.reject = reject;

        return this;
    }

    // tslint:disable no-reserved-keywords
    public catch(reject: Function): Chain {
        this.reject = reject;

        return this;
    }

    public action(key: string, ...args: any[]): Chain {
        return this.actionFun[key].call(this, ...args);
    }
    // tslint:enable no-reserved-keywords

    private commitChain(result: any): void {
        this.resultList.push(result);
        if (this.waitList.length) {
            const keyObj: Idefer | Ithen = this.waitList.shift();
            this.deferItem = null;
            if ('key' in keyObj) {
                // object Idefer
                this.commit(keyObj.key, ...keyObj.args, result);
            } else {
                // object Ithen
                this.innerResolve(keyObj, result);
            }
        } else {
            if (this.resolve) {
                this.resolve(this.resultList);
            }
        }
    }

    private innerResolve(then: Ithen, result: any): Chain {
        const deferItem: any = then.resolve(result);
        if (isPromise(deferItem)) {
            // object Promise
            deferItem.then(
                (data: any) => {
                    this.commitChain(data);
                },
                (error: any) => {
                    if (this.reject) {
                        this.reject(error);
                    }
                },
            );
        } else if (deferItem[commitToken]) {
            // another commit
            this.commit(deferItem.key, ...deferItem.args);
        } else {
            this.commitChain(deferItem);
        }

        return this;
    }
}
