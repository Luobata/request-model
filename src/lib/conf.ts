/**
 * @desciption conf
 */

export const commitToken: symbol | string = ((): symbol | string => {
    const key: string = '__REQUEST__MODEL__COMMIT__TOKEN';
    if (Symbol) {
        return Symbol(key);
    } else {
        return key;
    }
})();
