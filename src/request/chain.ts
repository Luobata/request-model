/**
 * @description chain
 */
import { commitToken } from 'Lib/conf';
import { isArray, isObject, isPromise } from 'Lib/help';
import { getFunctionInRequest } from 'Request/data';
import { IAction, IcommitWrap, IRequest } from 'Request/request';

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

function isIdefer(v: any): v is Idefer {
    return v.key !== undefined;
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

const hasRequest: Function = (key: deferKey, request: IRequest): string => {
    if (isArray(key)) {
        // (<(string | IcommitObj)[]>key).filter(
        //     (v: string | IcommitObj): boolean =>
        //         !!getFunctionInRequest(getKey(v), request),
        // ).length === (<(string | IcommitObj)[]>key).length
        const keys: (string | IcommitObj)[] = (<(string | IcommitObj)[]>(
            key
        )).filter(
            (v: string | IcommitObj): boolean =>
                !getFunctionInRequest(getKey(v), request),
        );

        return keys.length
            ? keys.map((v: IcommitObj) => (v.handler ? v.handler : v)).join(',')
            : '';
    } else {
        return getFunctionInRequest(<string>key, request) ? '' : <string>key;
        // return !!getFunctionInRequest(<string>key, request);
    }
};

const getAll: Function = (
    key: (string | IcommitObj)[],
    request: IRequest,
    args: any[],
): Function[] => {
    return key.map(
        (v: string | IcommitObj): Function =>
            getFunctionInRequest(getKey(v), request)(...getArgs(v), ...args),
    );
};

// tslint:disable-next-line no-empty
const noop: Function = (): void => {};

/**
 * default class Chain
 */
export default class Chain {
    private request: IRequest;
    private actionFun: IAction;
    private deferItem: Promise<any> | null;
    private waitList: (Idefer | Ithen)[];
    private resultList: any[];
    private resolve: Function;
    private reject: Function;
    private alwaysFn: Function;
    private unResolveRejection: any;

    constructor(request: IRequest, action: IAction) {
        this.request = request;
        this.resultList = [];
        this.waitList = [];
        this.actionFun = action;
    }

    public commit(key: deferKey, ...args: any[]): Chain {
        if (this.unResolveRejection) {
            return this;
        }
        const keyStr: string = hasRequest(key, this.request);
        if (keyStr) {
            throw new Error(`can not find matched commit key: ${keyStr}`);
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
            // call entry one
            this.deferItem = defer;
            this.deferItem.then(
                (result: any) => {
                    this.commitChain(result);
                },
                (error: any) => {
                    this.innerRejection(error);
                },
            );
        }

        return this;
    }

    public then(resolve: Function, reject?: Function): Chain {
        if (this.deferItem) {
            this.waitList.push({
                resolve,
                reject,
            });
        } else {
            this.innerResolve({ resolve, reject });
        }

        return this;
    }

    public finish(resolve: Function, reject?: Function): Chain {
        if (!this.waitList.length && !this.deferItem) {
            this.innerResolve({ resolve, reject });
        } else {
            this.resolve = resolve;
            this.reject = reject;
        }

        return this;
    }

    // tslint:disable-next-line no-reserved-keywords
    public finally(resolve: Function, reject?: Function): Chain {
        return this.finish(resolve, reject);
    }

    // tslint:disable-next-line no-reserved-keywords
    public catch(reject: Function): Chain {
        if (!this.waitList.length && !this.deferItem) {
            this.innerResolve({ resolve: noop, reject });
        } else {
            this.reject = reject;
        }

        return this;
    }

    public always(always: Function): Chain {
        this.alwaysFn = always;

        return this;
    }

    public action(key: string, ...args: any[]): Chain {
        return this.actionFun[key].call(null, this, ...args);
    }

    private commitChain(result: any): void {
        this.resultList.push(result);
        if (this.waitList.length) {
            const keyObj: Idefer | Ithen = this.waitList.shift();
            this.deferItem = null;
            if (isIdefer(keyObj)) {
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

            this.innerAlways();
        }
    }

    private innerResolve(then: Ithen, result?: any): Chain {
        // call entry two
        let deferItem: any;
        if (this.unResolveRejection) {
            if (then.reject) {
                then.reject(this.unResolveRejection);
                this.unResolveRejection = null;
            } else if (this.innerRejection(this.unResolveRejection)) {
                this.unResolveRejection = null;
            }

            return this;
        } else {
            try {
                deferItem = then.resolve(result);
            } catch (e) {
                if (!this.innerRejection(e)) {
                    this.unResolveRejection = e;
                }

                return this;
            }
        }
        if (isPromise(deferItem)) {
            // object Promise
            this.deferItem = deferItem;
            deferItem.then(
                (data: any) => {
                    this.commitChain(data);
                },
                (error: any) => {
                    this.innerRejection(error);
                },
            );
        } else if (isArray(deferItem)) {
            // 暂时可以认为一定是 commitAll 包装
            const item: IcommitObj[] = deferItem.map((v: IcommitWrap) => {
                return {
                    handler: v.key,
                    args: v.args,
                };
            });
            this.commit(item);
        } else if (deferItem !== undefined && deferItem[commitToken]) {
            // another commit
            this.commit(deferItem.key, ...deferItem.args);
        } else {
            this.commitChain(deferItem);
        }

        return this;
    }

    private innerRejection(error: any, fn?: Function): boolean {
        let reject!: Function;
        // if (this.waitList.length && !isIdefer(this.waitList[0])) {
        if (this.waitList.length) {
            let index: number = 0;
            for (let i: number = 0; i < this.waitList.length; i = i + 1) {
                if (
                    !isIdefer(this.waitList[i]) &&
                    (<Ithen>this.waitList[i]).reject
                ) {
                    reject = (<Ithen>this.waitList[i]).reject;
                    index = i;
                    break;
                }
            }
            this.waitList.splice(0, index);
        }
        if (!reject && this.reject) {
            reject = this.reject;
        }
        if (reject) {
            if (fn) {
                fn();
            }
            this.deferItem = null;
            reject(error);
            this.innerAlways();

            return true;
        } else {
            this.innerAlways();

            return false;
        }
    }

    private innerAlways(): void {
        if (this.alwaysFn) {
            this.alwaysFn();
        }
    }
}
