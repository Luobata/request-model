/**
 * @description help
 */

export const isPromise = (obj: any): boolean => {
    try {
        return typeof obj.then === 'function';
    } catch (e) {
        return false;
    }
};
