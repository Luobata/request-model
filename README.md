# request-model

request-model is a useful async function management lib and help you coding more happy.

If you like to **make your async function sequential execution and in a chain usage**, you will like request-model.

## Installation

```js
npm install --save-dev request-model
```

## Usage

```js
import requestModel from 'request-model';

const rModel = new RequestModel({
    request: {
        getNameById(params) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(1);
                }, 2000);
            });
        },
        enums(params, params2) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(2);
                }, 1000);
            });
            // 返回一个Promise
        },
    },
});

// first getNameById and finsh start enums
rModel
    .chain()
    .commit('getNameById', 1)
    .commit('enums', 2);
```

## API

#### Constructor(request-model)

```js
import requestModel from 'request-model';

const rModel = new RequestModel({
    ...options,
});
```

##### Construction options

-   **request**:

    type `{ [type: string]: Function }`

-   **config**: config for requestModel, the sub module config will extends its parent config.

    | key         | type    | default | description                              |
    | :---------- | :------ | :------ | :--------------------------------------- |
    | promiseWrap | boolean | false   | Wrap your request fucntion with Promise. |

-   **module**: sub modules to request-model(**multistage sub modules support now**)

    type `[type: string]: another request-model options like`

    ```js
    {
      key: {
        request: {
          [string]: Function
        },
        modules: {
            ...
        }
      }
    }
    ```

-   **action**: the collection of the commit.

    type `[type: string]: Function`

    params `(chain: Chain, ...args: any[])`

    ```js
    action: {
        init(chain, ...args) {
            return chain
                .commit('getNameById', args[0])
                .commit('enums', args[1]);
        },
    }
    ```

#### Methods

-   **chain**

    Use to start the chain usage.

    return `new Chain()`

-   collection
    Use to get a collection.

    return `new Collection()`

-   PROMISEWRAP(**static**)

    Wrap a function to promise.

    params`(fn: Function)`
    return`Function`

-   commitWrap

    params `key: string (the function name in the constructor request)`

-   commitAll

    params `The return Array of commitWrap`

    etc:

    ```js
    rModel
        .chain()
        .commit('getNameById', 1)
        .then(data => {
            return rModel.commitAll([
                rModel.commitWrap('enums2', 2),
                rModel.commitWrap('enums4', 4),
            ]);
        .finish(data => {
            // data = [1 [2, 4]]
        });
    ```

-   every method in Chain can be use and the same input and output.

    etc:

    ```js
    rModel.chain().commit('getNameById', 1);
    // same as
    rModel.commit('getNameById', 1);
    ```

---

#### Chain

generator after requestModel.chain()

#### Methods

-   **commit**

    params `key: string`

    return `Chain`

-   then

    join your commit chain with another Function.

    params `(resolve: Function, ?reject: Function, ?always: Function, ?before: Function)`

    return `Chain`

-   finish / finally (same usage)

    add a finish Function will resolve after all the commit.

    params `(resolve: Function, ?reject: Function, ?always: Function)`

    return `Chain`

-   catch

    add a error catch Functin.

    params `(reject: Function)`

    return `Chain`

-   always

    add a always Functin. **It will be called when after last resolve or reject(also resolve and reject could be empty)**
    **not support usage with always only(without commit/then)**

    params `(alwaysFn: Function)`

    return `Chain`

#### Collection(extends Chain)

generator after requestModel.collection().

-   add
    add a Function into the collection.

    params`add(fn: Function, key?: string)` The key is not nessary if the fn has its name(not anoymous)
    return `Collection`
    etc:

    ```Js
    const collection = rModel.collection();
    collection.add(
        RequestModel.PROMISEWRAP((resolve, reject, params) => {
            setTimeout(() => {
                resolve(params);
            }, 0);
        }),
        'a',
    );
    collection.add(
        RequestModel.PROMISEWRAP((resolve, reject, params) => {
            setTimeout(() => {
                resolve(params);
            }, 0);
        }),
        'b',
    );
    collection
        .commit('a', 1)
        .commit('b', 2)
        .finish(data => {
            assert.deepEqual(data, [1, 2]);
            done();
        });
    ```
