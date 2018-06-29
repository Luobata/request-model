/**
 * @description help to find data in Request
 */
import { IRequest } from 'Request/request';

type Iresult = Function | undefined;

export const getFunctionInRequest: Function = (
    key: string,
    request: IRequest,
): Iresult => {
    let iRequest: IRequest = request;
    let result: Function;
    try {
        if (key.indexOf('/') !== -1) {
            const keys: string[] = key.split('/');
            keys.map(
                (v: string, i: number): void => {
                    if (i !== keys.length - 1) {
                        iRequest = iRequest.modules[v];
                    } else {
                        result = iRequest.request[v];
                    }
                },
            );
        } else {
            result = iRequest.request[key];
        }
    } catch (e) {}

    return result;
};
