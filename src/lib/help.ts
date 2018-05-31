/**
 * @description help
 */

// tslint:disable no-any no-unsafe-any

export const isArray: Function = (obj: any): boolean => {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

export const isObject: Function = (obj: any): boolean => {
    return Object.prototype.toString.call(obj) === '[object Object]';
};
export const isFunction: Function = (obj: any): obj is Function => {
    return Function.prototype.toString.call(obj) === '[object Function]';
};

export const isPromise: Function = (obj: any): boolean => {
    try {
        return typeof obj.then === 'function';
    } catch (e) {
        return false;
    }
};
