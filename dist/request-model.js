!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports["request-model"]=t():e["request-model"]=t()}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function s(i){if(t[i])return t[i].exports;var n=t[i]={i:i,l:!1,exports:{}};return e[i].call(n.exports,n,n.exports,s),n.l=!0,n.exports}return s.m=e,s.c=t,s.d=function(e,t,i){s.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:i})},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/",s(s.s=1)}([function(e,t,s){"use strict";const i=(()=>{const e="__REQUEST__MODEL__COMMIT__TOKEN";return Symbol?Symbol(e):e})();t.a=i},function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=s(2);t.default=i.a},function(e,t,s){"use strict";var i=s(0),n=s(3);const r={promiseWrap:!1},o=(e,t)=>e?(...e)=>new Promise((s,i)=>{t.call(null,s,i,...e)}):t;t.a=class{constructor(e){this.requestConfig=e,this.setting=this.getRequestConfig(),this.action=this.requestConfig.action,this.requestFormat()}chain(){return new n.a(this.request,this.action)}commitWrap(e,...t){return{[i.a]:!0,key:e,args:[...t]}}commitAll(e){return e.map(e=>({[i.a]:!0,key:e.key,args:[...e.args]}))}requestFormat(){const e={request:{},modules:{}},t=Object.keys.call(null,this.requestConfig.request||{}),s=Object.keys.call(null,this.requestConfig.modules||{});for(const s of t)e.request[s]=o(this.setting.config.promiseWrap,this.requestConfig.request[s]);const i=(e,t,s,n)=>{for(const r of e){const e={request:{},modules:{}},c=Object.keys.call(null,s[r].request||{});for(const i of c)e.request[i]=o(t.modules[r].config.promiseWrap,s[r].request[i]);n.modules[r]=e;const l=Object.keys.call(null,s[r].modules||{});l.length&&i(l,t.modules[r],s[r].modules,n.modules[r])}};i(s,this.setting,this.requestConfig.modules,e),this.request=e}getRequestConfig(){const e={config:r,modules:{}},t=Object.keys.call(null,this.requestConfig.config||{}),s=Object.keys.call(null,this.requestConfig.modules||{});t.map(t=>{e.config[t]=this.requestConfig.config[t]});const i=(e,t,s)=>{for(const n of e){s.modules[n]={config:Object.assign({},s.config),modules:{}};const e=Object.keys.call(null,t[n].config||{});for(const i of e)s.modules[n].config[i]=t[n].config[i];const r=Object.keys.call(null,t[n].modules||{});r.length&&i(r,t[n].modules,s.modules[n])}};return i(s,this.requestConfig.modules,e),e}}},function(e,t,s){"use strict";var i=s(0),n=s(4),r=s(5);function o(e){return void 0!==e.key}const c=e=>!!Object(n.b)(e)&&"handler"in e,l=e=>c(e)?e.handler:e,u=(e,t)=>{if(Object(n.a)(e)){const s=e.filter(e=>!Object(r.a)(l(e),t));return s.length?s.map(e=>e.handler?e.handler:e).join(","):""}return Object(r.a)(e,t)?"":e},h=(e,t,s)=>e.map(e=>Object(r.a)(l(e),t)(...(e=>c(e)?e.args:[])(e),...s));t.a=class{constructor(e,t){this.request=e,this.resultList=[],this.waitList=[],this.actionFun=t}commit(e,...t){if(this.unResolveRejection)return this;const s=u(e,this.request);if(s)throw new Error(`can not find matched commit key: ${s}`);if(this.deferItem)this.waitList.push({key:e,args:t});else{let s;if(s=Object(n.a)(e)?Promise.all(h(e,this.request,[...t])):Object(r.a)(e,this.request)(...t),!Object(n.c)(s))throw new Error(`The ${e} function not return a Promise function`);this.deferItem=s,this.deferItem.then(e=>{this.commitChain(e)},e=>{this.innerRejection(e)})}return this}then(e,t){return this.deferItem?this.waitList.push({resolve:e,reject:t}):this.innerResolve({resolve:e,reject:t}),this}finish(e,t){return this.waitList.length||this.deferItem?(this.resolve=e,this.reject=t):this.innerResolve({resolve:e,reject:t}),this}finally(e,t){return this.finish(e,t)}catch(e){const t=()=>{};return this.waitList.length||this.deferItem?this.reject=e:this.innerResolve({resolve:t,reject:e}),this}action(e,...t){return this.actionFun[e].call(null,this,...t)}commitChain(e){if(this.resultList.push(e),this.waitList.length){const t=this.waitList.shift();this.deferItem=null,o(t)?this.commit(t.key,...t.args,e):this.innerResolve(t,e)}else this.resolve&&this.resolve(this.resultList)}innerResolve(e,t){let s;if(this.unResolveRejection)return e.reject?(e.reject(this.unResolveRejection),this.unResolveRejection=null):this.innerRejection(this.unResolveRejection)&&(this.unResolveRejection=null),this;try{s=e.resolve(t)}catch(e){return this.innerRejection(e)||(this.unResolveRejection=e),this}if(Object(n.c)(s))this.deferItem=s,s.then(e=>{this.commitChain(e)},e=>{this.innerRejection(e)});else if(Object(n.a)(s)){const e=s.map(e=>({handler:e.key,args:e.args}));this.commit(e)}else void 0!==s&&s[i.a]?this.commit(s.key,...s.args):this.commitChain(s);return this}innerRejection(e,t){let s;if(this.waitList.length){let e=0;for(let t=0;t<this.waitList.length;t+=1)if(!o(this.waitList[t])&&this.waitList[t].reject){s=this.waitList[t].reject,e=t;break}this.waitList.splice(0,e)}return!s&&this.reject&&(s=this.reject),!!s&&(t&&t(),this.deferItem=null,s(e),!0)}}},function(e,t,s){"use strict";t.a=(e=>"[object Array]"===Object.prototype.toString.call(e));t.b=(e=>"[object Object]"===Object.prototype.toString.call(e));t.c=(e=>{try{return"function"==typeof e.then}catch(e){return!1}})},function(e,t,s){"use strict";t.a=((e,t)=>{let s,i=t;try{if(-1!==e.indexOf("/")){const t=e.split("/");t.map((e,n)=>{n!==t.length-1?i=i.modules[e]:s=i.request[e]})}else s=i.request[e]}catch(e){}return s})}])});
//# sourceMappingURL=request-model.js.map