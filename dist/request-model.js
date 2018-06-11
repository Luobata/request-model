!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports["request-model"]=e():t["request-model"]=e()}("undefined"!=typeof self?self:this,function(){return function(t){var e={};function s(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}return s.m=t,s.c=e,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},s.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/",s(s.s=1)}([function(t,e,s){"use strict";const i=(()=>{const t="__REQUEST__MODEL__COMMIT__TOKEN";return Symbol?Symbol(t):t})();e.a=i},function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=s(2);e.default=i.a},function(t,e,s){"use strict";var i=s(0),n=s(3);const r={promiseWrap:!1},o=(t,e)=>t?(...t)=>new Promise((s,i)=>{e.call(null,s,i,...t)}):e;e.a=class{constructor(t){this.requestConfig=t,this.setting=this.getRequestConfig(),this.action=this.requestConfig.action,this.requestFormat()}chain(){return new n.a(this.request,this.action)}commitWrap(t,...e){return{[i.a]:!0,key:t,args:[...e]}}commitAll(t){return t.map(t=>({[i.a]:!0,key:t.key,args:[...t.args]}))}requestFormat(){const t={},e=Object.keys.call(null,this.requestConfig.request||{}),s=Object.keys.call(null,this.requestConfig.modules||{});for(const s of e)t[s]=o(this.setting.config.promiseWrap,this.requestConfig.request[s]);for(const e of s){const s={},i=Object.keys.call(null,this.requestConfig.modules[e].request||{});for(const t of i)s[t]=o(this.setting.modules[e].promiseWrap,this.requestConfig.modules[e].request[t]);t[e]=s}this.request=t}getRequestConfig(){const t={config:r,modules:{}},e=Object.keys.call(null,this.requestConfig.config||{}),s=Object.keys.call(null,this.requestConfig.modules||{});e.map(e=>{t.config[e]=this.requestConfig.config[e]});for(const e of s){t.modules[e]=Object.assign({},t.config);const s=Object.keys.call(null,this.requestConfig.modules[e].config||{});for(const i of s)t.modules[e][i]=this.requestConfig.modules[e].config[i]}return t}}},function(t,e,s){"use strict";var i=s(0),n=s(4),r=s(5);const o=t=>!!Object(n.b)(t)&&"handler"in t,c=t=>o(t)?t.handler:t,u=(t,e)=>Object(n.a)(t)?t.filter(t=>!!Object(r.a)(c(t),e)).length===t.length:!!Object(r.a)(t,e),l=(t,e,s)=>t.map(t=>Object(r.a)(c(t),e)(...(t=>o(t)?t.args:[])(t),...s));e.a=class{constructor(t,e){this.request=t,this.resultList=[],this.waitList=[],this.actionFun=e}commit(t,...e){if(!u(t,this.request))throw new Error(`can not find matched ${t} function`);if(this.deferItem)this.waitList.push({key:t,args:e});else{let s;if(s=Object(n.a)(t)?Promise.all(l(t,this.request,[...e])):Object(r.a)(t,this.request)(...e),!Object(n.c)(s))throw new Error(`The ${t} function not return a Promise function`);this.deferItem=s,this.deferItem.then(t=>{this.commitChain(t)},t=>{this.reject&&(this.deferItem=null,this.reject(t))})}return this}then(t,e){return this.deferItem?this.waitList.push({resolve:t,reject:e}):this.innerResolve({resolve:t,reject:e}),this}finish(t,e){return this.resolve=t,this.reject=e,this}catch(t){return this.reject=t,this}action(t,...e){return this.actionFun[t].call(null,this,...e)}commitChain(t){if(this.resultList.push(t),this.waitList.length){const e=this.waitList.shift();this.deferItem=null,"key"in e?this.commit(e.key,...e.args,t):this.innerResolve(e,t)}else this.resolve&&this.resolve(this.resultList)}innerResolve(t,e){const s=t.resolve(e);if(Object(n.c)(s))s.then(t=>{this.commitChain(t)},t=>{this.reject&&this.reject(t)});else if(Object(n.a)(s)){const t=s.map(t=>({handler:t.key,args:t.args}));this.commit(t)}else void 0!==s&&s[i.a]?this.commit(s.key,...s.args):this.commitChain(s);return this}}},function(t,e,s){"use strict";e.a=(t=>"[object Array]"===Object.prototype.toString.call(t));e.b=(t=>"[object Object]"===Object.prototype.toString.call(t));e.c=(t=>{try{return"function"==typeof t.then}catch(t){return!1}})},function(t,e,s){"use strict";e.a=((t,e)=>{let s=e;-1!==t.indexOf("/")?t.split("/").map(t=>{s instanceof Function||(s=s[t])}):s=s[t];if(s instanceof Function)return s})}])});
//# sourceMappingURL=request-model.js.map