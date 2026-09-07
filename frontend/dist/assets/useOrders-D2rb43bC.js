import{c as n,e as o,w as t,t as a,x as i}from"./index-CH2Q4BVd.js";import{o as s}from"./orders.api-BJ8_AYYW.js";/**
 * @license lucide-react v0.439.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=n("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]),l=["orders","my"],c=e=>e?["orders","all",e]:["orders","all"];function f(){const{isAuthenticated:e}=o();return t({queryKey:l,queryFn:()=>s.getMyOrders(),enabled:e,staleTime:1e3*60,retry:!1})}function p(e,r=1){return t({queryKey:[...c(e),r],queryFn:()=>s.getAll({status:e,page:r,limit:20}),staleTime:1e3*30,retry:!1})}function q(){const e=a();return i({mutationFn:({orderId:r,status:u})=>s.updateStatus(r,u),onSuccess:()=>{e.invalidateQueries({queryKey:["orders"]})}})}export{m as C,p as a,q as b,f as u};
