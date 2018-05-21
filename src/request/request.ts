/*
 * @description request.ts
 */

interface IRequest {
    request: object;
}
/**
 * class Request
 */
export default class Reuest {
    private requestConfig: IRequest;

    public requestModel: IRequest;

    constructor(request: IRequest) {
        this.requestConfig = request;

        this.requestFormat();
    }

    private requestFormat(): void {
        const keyArr: string[] = Object.keys.call(
            null,
            this.requestConfig.request,
        );
        const outputRequest: object = {};
        for (const i of keyArr) {
            outputRequest[i] = this.requestConfig.request[i];
        }
    }
}
