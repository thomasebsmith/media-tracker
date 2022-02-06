!function r(o,a,i){function s(e,t){if(!a[e]){if(!o[e]){var n="function"==typeof require&&require;if(!t&&n)return n(e,!0);if(l)return l(e,!0);throw(n=new Error("Cannot find module '"+e+"'")).code="MODULE_NOT_FOUND",n}n=a[e]={exports:{}},o[e][0].call(n.exports,function(t){return s(o[e][1][t]||t)},n,n.exports,r,o,a,i)}return a[e].exports}for(var l="function"==typeof require&&require,t=0;t<i.length;t++)s(i[t]);return s}({1:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=t("./data"),t=t("./storage"),t=Object.freeze({columns:r.columns,rows:r.rows,register:r.register,takeID:r.takeID,updateRowWithSameID:r.updateRowWithSameID,getData:t.getData,setData:t.setData,getNextID:t.getNextID,setNextID:t.setNextID,getCommittedBackup:t.getCommittedBackup,commitBackup:t.commitBackup});n.default=t},{"./data":3,"./storage":11}],2:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=function(t,e){if(!e&&t&&t.__esModule)return t;if(null===t||"object"!=typeof t&&"function"!=typeof t)return{default:t};e=i(e);if(e&&e.has(t))return e.get(t);var n,r={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(n in t){var a;"default"!==n&&Object.prototype.hasOwnProperty.call(t,n)&&((a=o?Object.getOwnPropertyDescriptor(t,n):null)&&(a.get||a.set)?Object.defineProperty(r,n,a):r[n]=t[n])}r.default=t,e&&e.set(t,r);return r}(t("./dom")),a=t("./storage"),r=t("./visualize");function i(t){if("function"!=typeof WeakMap)return null;var e=new WeakMap,n=new WeakMap;return(i=function(t){return t?n:e})(t)}function s(t,e){var n=o.create("div");e(n),t.appendChild(n)}n.default=function(t){s(t,t=>{const e=o.create("button");e.textContent="Save Backup",e.addEventListener("click",()=>{var t=JSON.stringify((0,a.getCommittedBackup)()),e=new Blob([t],{type:"application/json"}),t=URL.createObjectURL(e);const n=o.create("a");e=(new Date).toISOString();n.setAttribute("download","backup-".concat(e,".json")),n.setAttribute("href",t),document.body.appendChild(n),n.click(),document.body.removeChild(n)}),t.appendChild(e)}),s(t,t=>{var e="control-select-backup-file";const n=o.create("label");n.textContent="Load Backup",n.setAttribute("for",e),n.classList.add("button"),t.appendChild(n);const r=o.create("input");r.setAttribute("id",e),r.setAttribute("type","file"),r.setAttribute("accept",".json,application/json,text/json"),r.addEventListener("change",async()=>{if(null!==r.files){const e=r.files[0];var t=JSON.parse(await e.text());(0,a.commitBackup)(t)}}),r.classList.add("hidden"),t.appendChild(r)}),s(t,t=>{const e=o.create("button");e.textContent="Visualize",e.addEventListener("click",()=>(0,r.visualizeData)()),t.appendChild(e)})}},{"./dom":5,"./storage":11,"./visualize":12}],3:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.columnFromString=function(t,e){e=o[e].type;return function e(t,n){switch(n){case"integer":{const r=parseInt(t,10);return Number.isFinite(r)?(0,u.some)(r):(0,u.none)()}case"float":{const o=parseFloat(t);return Number.isFinite(o)?(0,u.some)(o):(0,u.none)()}case"string":return(0,u.some)(t);case"null":return(0,u.some)(null);default:if(c(n)){const a=t.split(",");return(0,u.optionalList)(a.map(t=>e(t,n.of)))}(0,l.assert)(d(n));for(const i of n.of){const s=e(t,i);if(s.hasValue)return s}return(0,u.none)()}}(t,e)},n.stringFromColumn=function(t,e){return null===t?"":""+t},n.register=function(t){(0,l.assert)(void 0===s.get(t.id));var e=i.push(t)-1;s.set(t.id,e)},n.takeID=function(){return++f,f-1},n.updateRowWithSameID=function(t){var e=s.get(t.id);(0,l.assert)(void 0!==e);const n=i[e];for(const r of a)"id"!==r&&(n[r]=t[r])},n.rows=n.columns=n.columnKeys=void 0;var l=t("./standard"),r=t("./storage"),u=t("./optional");function c(t){return"string"!=typeof t&&"array"===t.type}function d(t){return"string"!=typeof t&&"union"===t.type}const o={id:{display:!1,name:"ID",type:"integer"},type:{display:!0,name:"Type",type:"string"},title:{display:!0,name:"Title",type:"string"},creators:{display:!0,name:"Creators",type:{type:"array",of:"string"}},rating:{display:!0,name:"Rating",type:{type:"union",of:["float","null"]}}};n.columns=o;const a=Object.keys(o);n.columnKeys=a;const i=(0,r.getData)(),s=new Map;for(let t=0;t<i.length;++t)s.set(i[t].id,t);let f=(0,r.getNextID)();class p{constructor(t=null){this.data=null===t?i:t}get length(){return this.data.length}take(t){return new p(this.data.slice(0,t))}drop(t){return new p(this.data.slice(t))}append(t){return new p(this.data.concat([t]))}sort(a){const t=this.data.slice();return t.sort((t,e)=>{for(var[n,r]of a){var o=r?-1:1,r=t[n],n=e[n];if(null!==r||null!==n){if(null===r)return-1*o;if(null===n)return o;if(r<n)return-1*o;if(n<r)return o}}return 0}),new p(t)}update(){for(const n of this.data)t=n,e=void 0,e=s.get(t.id),(0,l.assert)(void 0!==e),(0,l.assert)(i[e]==t);var t,e;(0,r.setData)(i),(0,r.setNextID)(f)}toJSON(){return{data:this.data}}[Symbol.iterator](){return this.data[Symbol.iterator]()}}t=new p;n.rows=t},{"./optional":7,"./standard":9,"./storage":11}],4:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var u=t("./data"),c=function(t,e){if(!e&&t&&t.__esModule)return t;if(null===t||"object"!=typeof t&&"function"!=typeof t)return{default:t};e=i(e);if(e&&e.has(t))return e.get(t);var n,r={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(n in t){var a;"default"!==n&&Object.prototype.hasOwnProperty.call(t,n)&&((a=o?Object.getOwnPropertyDescriptor(t,n):null)&&(a.get||a.set)?Object.defineProperty(r,n,a):r[n]=t[n])}r.default=t,e&&e.set(t,r);return r}(t("./dom")),d=t("./standard");function i(t){if("function"!=typeof WeakMap)return null;var e=new WeakMap,n=new WeakMap;return(i=function(t){return t?n:e})(t)}const f=u.columnKeys.filter(t=>u.columns[t].display),p=Object.values(u.columns).filter(t=>t.display);let v=!1;function m(t,e){t=Math.round(t),e=Math.round(e);const n=document.activeElement;if(null!==n&&"td"===n.tagName.toLowerCase()){const a=n.parentElement;(0,d.assert)(null!==a),(0,d.assert)("tr"===a.tagName.toLowerCase());var r=Array.prototype.indexOf.call(a.children,n);(0,d.assert)(-1!==r);const i=a.parentElement;(0,d.assert)(null!==i),(0,d.assert)("table"===i.tagName.toLowerCase());var o=Array.prototype.indexOf.call(i.children,a);(0,d.assert)(-1!==o),r+=t,o+=e,o=Math.min(i.children.length-1,o);o=Math.max(1,o),o=i.children[o],r=Math.min(o.children.length-1,r);r=Math.max(0,r);const s=o.children[r];(0,d.assert)(s instanceof HTMLElement),(0,d.assert)("td"===s.tagName.toLowerCase()),s.focus()}}function y(t,e){return c.create("td",Object.assign({editable:!0,spellcheck:!1,text:t},null!=e?e:{}))}function g(e){var t;const n={id:null!==(t=e.dataset.id)&&void 0!==t?t:""};for(let t=0;t<f.length;++t){var r=f[t],o=e.children[t];n[r]=o.textContent}for(const i of u.columnKeys){var a=(0,u.columnFromString)(n[i],i);(0,d.assert)(a.hasValue),n[i]=a.value}return n}document.addEventListener("focusin",t=>{const e=t.target;if(e instanceof HTMLElement&&"td"===e.tagName.toLowerCase()&&null!==e.textContent&&0!==(null===(t=e.textContent)||void 0===t?void 0:t.length)){const n=getSelection();(0,d.assert)(null!==n),n.removeAllRanges();const r=document.createRange();r.selectNodeContents(e),n.addRange(r)}}),document.addEventListener("keydown",e=>{if(!e.shiftKey&&e.target instanceof HTMLElement&&"td"===e.target.tagName.toLowerCase()){const l=getSelection();let t=!1,n=!1;if(null!==l&&1===l.rangeCount){var r=l.getRangeAt(0),o=c.findAncestorElement(r.commonAncestorContainer,"td");if(null!==o){t=0===r.startOffset&&c.isLeftmost(r.startContainer,o);var a,i,s=r.endContainer;if(s instanceof Text||s instanceof Comment||s instanceof CDATASection)n=null!==(a=r.endOffset===(null===(a=s.textContent)||void 0===a?void 0:a.length))?a:0;else{let e=s.childNodes.length;for(let t=s.childNodes.length-1;0<=t;--t){if(""!==(null!==(i=null===(i=s.childNodes[t])||void 0===i?void 0:i.textContent)&&void 0!==i?i:""))break;--e}n=r.endOffset>=e}n=n&&c.isRightmost(s,o)}}switch(e.key){case"ArrowUp":m(0,-1),e.preventDefault();break;case"ArrowDown":m(0,1),e.preventDefault();break;case"ArrowLeft":t&&(m(-1,0),e.preventDefault());break;case"ArrowRight":n&&(m(1,0),e.preventDefault());break;case"Enter":m(0,1),e.preventDefault();break;case"Escape":null!==l&&void 0!==l&&l.removeAllRanges(),document.activeElement instanceof HTMLElement&&document.activeElement.blur(),e.preventDefault()}}});t=function(t){const e=c.create("table"),n=c.create("tr");for(const a of p)n.appendChild(c.create("th",{text:a.name}));e.appendChild(n),e.addEventListener("input",t=>{t.target instanceof Node&&(null!==(t=c.findAncestorElement(t.target,"tr"))&&((0,d.assert)(t instanceof HTMLElement),v=!0,(0,u.updateRowWithSameID)(g(t))))});let r=u.rows.sort([["rating",!0],["type",!1],["title",!1],["creators",!1],["id",!1]]).take(100);function o(){v&&(r.update(),v=!1)}setInterval(()=>o(),1e4),window.addEventListener("beforeunload",()=>{o()});for(const i of r){const s=c.create("tr",{data:{id:"".concat(i.id)}});for(const l of f)s.appendChild(y((0,u.stringFromColumn)(i[l],l)));e.appendChild(s)}!function e(n,r){const o=c.create("tr",{classes:["new"]}),a=t=>{(0,d.assert)(t.target instanceof HTMLElement),""!==t.target.textContent&&(o.dataset.id=(0,u.takeID)().toString(),r(g(o)),o.classList.remove("new"),e(n,r),o.removeEventListener("input",a))};o.addEventListener("input",a);for(let t=0;t<f.length;++t){var i=y();o.appendChild(i)}n.appendChild(o)}(e,function(t){(0,u.register)(t),r=r.append(t)}),t.appendChild(e)};n.default=t},{"./data":3,"./dom":5,"./standard":9}],5:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.create=function(t,e=Object.create(null)){const n=document.createElement(t);if(Array.isArray(e.classes))for(const a of e.classes)n.classList.add(a);if("object"==typeof e.data)for(var[r,o]of Object.entries(e.data))"string"==typeof o&&(n.dataset[r]=o);"string"==typeof e.direction&&(n.dir=e.direction);"boolean"==typeof e.editable?n.contentEditable="".concat(e.editable):"string"==typeof e.editable&&(n.contentEditable=e.editable);"string"==typeof e.id&&n.setAttribute("id",e.id);"string"==typeof e.popupText&&n.setAttribute("title",e.popupText);"boolean"==typeof e.spellcheck&&(n.spellcheck=e.spellcheck);"string"==typeof e.text&&(n.textContent=e.text);return n},n.findAncestorElement=function(t,e){let n=t;do{if(n instanceof Element)return n.closest(e)}while(n=n.parentNode,null!==n);return null},n.isLeftmost=function(t,e){let n=t;do{if(n===e)return!0;if(null!==n.previousSibling)return!1}while(n=n.parentNode,null!==n);return!1},n.isRightmost=function(t,e){let n=t;do{if(n===e)return!0;if(null!==n.nextSibling)return!1}while(n=n.parentNode,null!==n);return!1},n.select=function(t){return document.querySelector(t)},n.selectAll=function(t){return Array.from(document.querySelectorAll(t))}},{}],6:[function(t,e,n){"use strict";var r=l(t("./cli")),o=l(t("./controls")),a=l(t("./display")),i=function(t,e){if(!e&&t&&t.__esModule)return t;if(null===t||"object"!=typeof t&&"function"!=typeof t)return{default:t};e=s(e);if(e&&e.has(t))return e.get(t);var n,r={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(n in t){var a;"default"!==n&&Object.prototype.hasOwnProperty.call(t,n)&&((a=o?Object.getOwnPropertyDescriptor(t,n):null)&&(a.get||a.set)?Object.defineProperty(r,n,a):r[n]=t[n])}r.default=t,e&&e.set(t,r);return r}(t("./dom")),t=t("./standard");function s(t){if("function"!=typeof WeakMap)return null;var e=new WeakMap,n=new WeakMap;return(s=function(t){return t?n:e})(t)}function l(t){return t&&t.__esModule?t:{default:t}}window.cli=r.default,(0,o.default)(null!==(o=i.select(".controls"))&&void 0!==o?o:(0,t.fatalError)("Could not find .controls")),(0,a.default)(null!==(i=i.select(".data"))&&void 0!==i?i:(0,t.fatalError)("Could not find .data"))},{"./cli":1,"./controls":2,"./display":4,"./dom":5,"./standard":9}],7:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.none=a,n.some=i,n.optionalList=function(t){const e=[];for(const n of t){if(!n.hasValue)return a();e.push(n.value)}return i(e)};class r{get hasValue(){return!1}get value(){return null}bind(t){return a()}pure(t){return i(t)}valueOr(t){return t}toString(){return"none()"}}class o{constructor(t){this.value=t}get hasValue(){return!0}bind(t){return t(this.value)}pure(t){return i(t)}valueOr(t){return this.value}toString(){return"some(".concat(this.value,")")}}function a(){return new r}function i(t){return new o(t)}},{}],8:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.showPopup=function(t){var e;const n=null!==(e=c.select("body"))&&void 0!==e?e:(0,d.fatalError)("body not found"),r=c.create("div");r.classList.add("overlay-shadow");const o=c.create("div");o.classList.add("overlay-internal");const a=c.create("nav");a.classList.add("nav-right");const i=c.create("button");i.classList.add("close");const s=c.create("div");s.classList.add("overlay"),s.setAttribute("role","dialog"),a.appendChild(i),s.appendChild(a),o.appendChild(s),r.appendChild(o),n.appendChild(r);let l=!1;function u(){l||(n.removeChild(r),l=!0)}r.addEventListener("click",t=>{t.target!==r&&t.target!==o||u()}),i.addEventListener("click",()=>u()),t(s,u)};var c=function(t,e){if(!e&&t&&t.__esModule)return t;if(null===t||"object"!=typeof t&&"function"!=typeof t)return{default:t};e=i(e);if(e&&e.has(t))return e.get(t);var n,r={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(n in t){var a;"default"!==n&&Object.prototype.hasOwnProperty.call(t,n)&&((a=o?Object.getOwnPropertyDescriptor(t,n):null)&&(a.get||a.set)?Object.defineProperty(r,n,a):r[n]=t[n])}r.default=t,e&&e.set(t,r);return r}(t("./dom")),d=t("./standard");function i(t){if("function"!=typeof WeakMap)return null;var e=new WeakMap,n=new WeakMap;return(i=function(t){return t?n:e})(t)}},{"./dom":5,"./standard":9}],9:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.assert=function(t,e){if(!t)throw Error(null!=e?e:"Assertion failed")},n.fatalError=function(t){throw Error(null!=t?t:"Fatal error")}},{}],10:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.count=l,n.filterNulls=function*(t){for(const e of t)null!==e&&(yield e)},n.map=a,n.mean=i,n.median=function(t,e=null){const n=[...t];null===e?n.sort():n.sort(e);e=n.length;return 0!==e?e%2!=0?(0,o.some)(n[(e-1)/2]):(0,o.some)(n[e/2-1]):(0,o.none)()},n.stdev=function(t){const r=[...t];return i(r).bind(e=>{var t=s(a(t=>(t-e)**2,r)),n=l(r);return(0,o.some)(Math.sqrt(t/n))})},n.sum=s,n.unique=function*(t,e=null){if(null===e){const r=new Set;for(const o of t)r.has(o)||(r.add(o),yield o)}else{var n=[];t:for(const a of t){for(const i of n)if(e(a,i))continue t;yield a}}};var o=t("./optional");function*a(t,e){for(const n of e)yield t(n)}function i(t){let e=0,n=0;for(const r of t)e+=r,++n;return 0===n?(0,o.none)():(0,o.some)(e/n)}function s(t){let e=0;for(const n of t)e+=n;return e}function l(t){let e=0;for(const n of t)++e;return e}},{"./optional":7}],11:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.getData=u,n.setData=c,n.getNextID=d,n.setNextID=f,n.getCommittedBackup=function(){return{[s]:u(),[l]:d()}},n.commitBackup=function(t){c(t[s]),f(t[l])};var r=t("./standard");const o="/media-tracker/";function a(t){t=t,t=localStorage.getItem(o+t);return null===t?null:JSON.parse(t)}function i(t,e){t=t,e=JSON.stringify(e),localStorage.setItem(o+t,e)}const s="data",l="nextID";function u(){var t;return null!==(t=a(s))&&void 0!==t?t:[]}function c(t){(0,r.assert)(Array.isArray(t),"Invalid data to be stored"),i(s,t)}function d(){var t;return null!==(t=a(l))&&void 0!==t?t:0}function f(t){(0,r.assert)("number"==typeof t,"Invalid next ID to be stored"),i(l,t)}},{"./standard":9}],12:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.visualizeData=function(){(0,r.showPopup)(t=>{const e=d.create("h1");e.textContent="Your media",t.appendChild(e);const n=d.create("p");n.textContent="".concat(c.rows.length," items"),t.appendChild(n);var r=()=>(0,f.filterNulls)((0,f.map)(t=>t.rating,c.rows)),o=(0,f.mean)(r());if(o.hasValue){const s=d.create("p");s.textContent="Mean rating: ".concat(o.value),t.appendChild(s)}o=(0,f.median)(r());if(o.hasValue){const l=d.create("p");l.textContent="Median rating: ".concat(o.value),t.appendChild(l)}r=(0,f.stdev)(r());if(r.hasValue){const u=d.create("p");u.textContent="Ratings standard deviation: ".concat(r.value),t.appendChild(u)}const a=d.create("p"),i=[...(0,f.unique)((0,f.map)(t=>t.type,c.rows))];i.sort(),a.textContent="Media types: ".concat(i.join(", ")),t.appendChild(a)})};var c=t("./data"),d=function(t,e){if(!e&&t&&t.__esModule)return t;if(null===t||"object"!=typeof t&&"function"!=typeof t)return{default:t};e=i(e);if(e&&e.has(t))return e.get(t);var n,r={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(n in t){var a;"default"!==n&&Object.prototype.hasOwnProperty.call(t,n)&&((a=o?Object.getOwnPropertyDescriptor(t,n):null)&&(a.get||a.set)?Object.defineProperty(r,n,a):r[n]=t[n])}r.default=t,e&&e.set(t,r);return r}(t("./dom")),r=t("./popup"),f=t("./statistics");function i(t){if("function"!=typeof WeakMap)return null;var e=new WeakMap,n=new WeakMap;return(i=function(t){return t?n:e})(t)}},{"./data":3,"./dom":5,"./popup":8,"./statistics":10}]},{},[6]);