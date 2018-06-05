/**
 * @description help to find data in Request
 */
import { IRequest } from 'Request/request';

type Iresult = Function | undefined;

export const getFunctionInRequest: Function = (
    key: string,
    request: IRequest,
): Iresult => {
    let iRequest: IRequest | Function = request;
    if (key.indexOf('/') !== -1) {
        const keys: string[] = key.split('/');
        keys.map((v: string): void => {
            if (!(iRequest instanceof Function)) {
                iRequest = iRequest[v];
            }
        });
    } else {
        iRequest = iRequest[key];
    }
    if (iRequest instanceof Function) {
        return iRequest;
    }
};
