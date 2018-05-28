/**
 * @description help
 */

// tslint:disable no-any

export const isArray: Function = (obj: any): boolean => {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
export const isPromise: Function = (obj: any): boolean => {
    try {
        return typeof obj.then === 'function';
    } catch (e) {
        return false;
    }
};
