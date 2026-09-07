import{c as a,j as e,a as n}from"./index-CH2Q4BVd.js";/**
 * @license lucide-react v0.439.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=a("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.439.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=a("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);function d({icon:t,title:s,description:r,action:c,className:l}){return e.jsxs("div",{className:n("flex flex-col items-center justify-center py-20 px-6 text-center",l),children:[t&&e.jsx("div",{className:"mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-muted-foreground",children:t}),e.jsx("h3",{className:"mb-2 text-lg font-semibold text-foreground",children:s}),r&&e.jsx("p",{className:"mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed",children:r}),c]})}function o({message:t,onRetry:s,className:r}){return e.jsxs("div",{className:n("flex flex-col items-center justify-center py-20 px-6 text-center",r),children:[e.jsx("div",{className:"mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10",children:e.jsx(x,{className:"h-8 w-8 text-red-400"})}),e.jsx("h3",{className:"mb-2 text-lg font-semibold text-foreground",children:"Something went wrong"}),e.jsx("p",{className:"mb-6 max-w-sm text-sm text-muted-foreground",children:t||"Unable to load content. Please try again."}),s&&e.jsxs("button",{onClick:s,className:"inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90",children:[e.jsx(i,{className:"h-4 w-4"}),"Try again"]})]})}export{x as C,o as E,i as R,d as a};
