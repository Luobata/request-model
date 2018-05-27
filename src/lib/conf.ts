export const commitToken = (() => {
    const key = '__REQUEST__MODEL__COMMIT__TOKEN';
    if ((<any>window).Symbol) {
        return Symbol(key);
    } else {
        return key;
    }
})();
