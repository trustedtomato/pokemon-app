(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{413:function(t,e,n){"use strict";n.r(e);n(41),n(26),n(33),n(61),n(32),n(62);var r=n(24),o=n(1),c=n(43);function l(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function v(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(e){Object(r.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var f=o.a.extend({computed:v(v({},Object(c.e)("search-options",["limitOptions","inUrl","sortOptions"])),Object(c.d)("search-options",["search","results","maxPage","pageButtonChunks"])),methods:v(v({},Object(c.c)("search-options",["updateInUrl"])),{},{pageClick:function(t){this.updateInUrl({page:t})}})}),O=n(47),component=Object(O.a)(f,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"toolbar"},[n("label",[t._v("\n    Number of results per page:\n    "),n("select",{domProps:{value:t.inUrl.limit},on:{input:function(e){t.updateInUrl({limit:Number(e.target.value),page:1})}}},t._l(t.limitOptions,(function(option){return n("option",{key:option,domProps:{value:option}},[t._v(t._s(option))])})),0)]),t._v(" "),n("label",[t._v("\n    Sort by:\n    "),n("select",{domProps:{value:t.inUrl.sort},on:{input:function(e){return t.updateInUrl({sort:e.target.value,page:1})}}},t._l(Object.entries(t.sortOptions),(function(e){var r=e[0],o=e[1];return n("option",{key:r,domProps:{value:r}},[t._v(t._s(o))])})),0)]),t._v(" "),n("span",[n("button",{staticClass:"page-btn",attrs:{disabled:t.inUrl.page<=1},on:{click:function(e){return t.pageClick(t.inUrl.page-1)}}},[t._v("\n      Previous\n    ")]),t._v(" "),t._l(t.pageButtonChunks,(function(e,i){return n("span",{key:i},[i>0?n("span",[t._v(" ... ")]):t._e(),t._v(" "),t._l(e,(function(e){return n("button",{key:e,class:"page-btn "+(t.inUrl.page===e?"page-btn--active":""),on:{click:function(n){return t.pageClick(e)}}},[t._v("\n        "+t._s(e)+"\n      ")])}))],2)})),t._v(" "),n("button",{staticClass:"page-btn",attrs:{disabled:t.inUrl.page>=t.maxPage},on:{click:function(e){return t.pageClick(t.inUrl.page+1)}}},[t._v("\n      Next\n    ")])],2)])}),[],!1,null,null,null);e.default=component.exports}}]);