!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["request-model"]=t():e["request-model"]=t()}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function r(s){if(t[s])return t[s].exports;var i=t[s]={i:s,l:!1,exports:{}};return e[s].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:s})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/",r(r.s=1)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.commitToken=(()=>{const e="__REQUEST__MODEL__COMMIT__TOKEN";return Symbol?Symbol(e):e})()},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=r(2),i=r.n(s);t.default=i.a},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(0),i=r(3);t.default=class{constructor(e){this.requestConfig=e,this.requestFormat()}chain(){return new i.default(this)}commitWrap(e,...t){return{[s.commitToken]:!0,key:e,args:[...t]}}requestFormat(){const e={};for(const t in this.requestConfig.request)e[t]=this.requestConfig.request[t];this.request=e}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(0),i=r(4),n=e=>"handler"in e,o=e=>n(e)?e.handler:e,u=(e,t)=>i.isArray(e)?e.filter(e=>!!t.request.hasOwnProperty(o(e))).length===e.length:!!t.request.hasOwnProperty(e),c=(e,t)=>e.map(e=>t.request[o(e)](...(e=>n(e)?e.args:[])(e)));t.default=class{constructor(e){this.request=e,this.resultList=[],this.waitList=[]}commit(e,...t){if(!u(e,this.request))throw new Error(`can not find matched ${e} function`);if(this.deferItem)this.waitList.push({key:e,args:t});else{let r;if(r=i.isArray(e)?Promise.all(c(e,this.request)):this.request.request[e](...t),!i.isPromise(r))throw new Error(`The ${e} function not return a Promise function`);this.deferItem=r,this.deferItem.then(e=>{this.commitChain(e)},e=>{this.reject&&(this.deferItem=null,this.reject(e))})}return this}then(e,t){return this.waitList.push({resolve:e,reject:t}),this}finish(e,t){return this.resolve=e,this.reject=t,this}catch(e){return this.reject=e,this}commitChain(e){if(this.resultList.push(e),this.waitList.length){const t=this.waitList.shift();this.deferItem=null,"key"in t?this.commit(t.key,...t.args,e):this.innerResolve(t,e)}else this.resolve&&this.resolve(this.resultList)}innerResolve(e,t){const r=e.resolve(t);return i.isPromise(r)?r.then(e=>{this.commitChain(e)},e=>{this.reject&&this.reject(e)}):r[s.commitToken]?this.commit(r.key,...r.args):this.commitChain(r),this}}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isArray=(e=>"[object Array]"===Object.prototype.toString.call(e)),t.isPromise=(e=>{try{return"function"==typeof e.then}catch(e){return!1}})}])});
//# sourceMappingURL=request-model.js.map