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

**request**:

type `{ [type: string]: Function }`

**config**: config for requestModel, the sub module config will extends its parent config.

| key         | type    | default | description                              |
| :---------- | :------ | :------ | :--------------------------------------- |
| promiseWrap | boolean | false   | Wrap your request fucntion with Promise. |

**module**: sub modules to request-model(only one hierarchy is supported now)

type `[type: string]: another request-model options like`

```Js
{
  key: {
    request: {
      [string]: Function
    }
  }
}
```

**action**: the collection of the commit.
type `[type: string]: Function`
params `(chain: Chain, ...args: any[])`

```js
    action: {
        init(chain, ...args) {
            return chain
                .commit('getNameById', args[0])
                .commit('enums', args[1]);
        },
    },
```

#### Methods

*   **chain**
    Use to start the chain usage.
    return `new Chain()`
*   commitWrap
    params `key: string (the function name in the constructor request)`
*   commitAll
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

---

#### Chain

generator after requestModel.chain()

#### Methods

*   **commit**

    params `key: string`

    return `Chain`

*   then

    join your commit chain with another Function.

    params `(resolve: Function, ?reject: Function)`

    return `Chain`

*   finish

    add a finish Function will resolve after all the commit.

    params `(resolve: Function, ?reject: Function)`

    return `Chain`

*   catch

    add a error catch Functin.

    params `(reject: Function)`

    return `Chain`
