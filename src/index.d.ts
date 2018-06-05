/**
 * @description index.d
 */
import { IRequestConfig, IcommitWrap } from 'Request/request';

export declare class RequestModel {
    constructor(request: IRequestConfig);

    public chain(): Chain;
    public commitWrap(key: string, ...args: any[]): object;
    public commitAll(commitWrap: IcommitWrap[]): object[];
}

export declare class Chain {
    constructor(request: Request);

    public commit(key: string, ...args: any[]): Chain;
    public then(resolve: Function, reject: Function): Chain;
    public finish(resolve: Function, reject: Function): Chain;
    public catch(reject: Function): Chain;
}
