/**
 * @description help to find data in Request
 */
import Request, { IRequest } from 'Request/request';

type Iresult = Function | undefined;

export const getFunctionInRequest: Function = (
    key: string,
    request: Request,
): Iresult => {
    let iRequest: IRequest | Function = request.request;
    if (key.indexOf('/') !== -1) {
        const keys: string[] = key.split('/');
        keys.map((v: string): void => {
            if (!(iRequest instanceof Function)) {
                iRequest = (<IRequest>iRequest)[v];
            }
        });
    } else {
        iRequest = iRequest[key];
    }
    if (iRequest instanceof Function) {
        return iRequest;
    }
};
