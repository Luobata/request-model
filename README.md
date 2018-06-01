# request-model

request-model is a useful async function management lib and help you coding more happy.

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

*   Constructor

```js
import requestModel from 'request-model';

const rModel = new RequestModel({
    ...options,
});
```

\*\* Construction options

** request \*** type: `{ [type: string]: Function }`
