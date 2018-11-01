/**
 * @description index.d
 */
import { IRequestConfig, IcommitWrap } from 'Request/request';

export declare class RequestModel {
    constructor(request: IRequestConfig);

    public static PROMISEWRAP(fn: Function): Function;
    public chain(): Chain;
    public collection(): Collection;
    public commitWrap(key: string, ...args: any[]): object;
    public commitAll(commitWrap: IcommitWrap[]): object[];

    public commit(key: string, ...args: any[]): Chain;
    public then(resolve: Function, reject: Function): Chain;
    public finish(resolve: Function, reject: Function): Chain;
    public finally(resolve: Function, reject: Function): Chain;
    public catch(reject: Function): Chain;
    public always(always: Function): Chain;
    public action(key: string, ...args: any[]): Chain;
}

export declare class Chain {
    constructor(request: Request);

    public commit(key: string, ...args: any[]): Chain;
    public then(resolve: Function, reject: Function): Chain;
    public finish(resolve: Function, reject: Function): Chain;
    public finally(resolve: Function, reject: Function): Chain;
    public catch(reject: Function): Chain;
    public always(always: Function): Chain;
    public action(key: string, ...args: any[]): Chain;
}

export declare class Collection extends Chain {
    add(fn: Function, key?: string): Collection;
}
