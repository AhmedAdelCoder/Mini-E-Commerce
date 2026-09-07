import{c as s,s as e}from"./index-CH2Q4BVd.js";/**
 * @license lucide-react v0.439.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=s("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]),n={create:async t=>{const{data:a}=await e.post("/orders",t);return a},getMyOrders:async()=>{const{data:t}=await e.get("/orders/my");return t},getAll:async t=>{const{data:a}=await e.get("/orders",{params:t});return a},updateStatus:async(t,a)=>{const{data:r}=await e.patch(`/orders/${t}/status`,{status:a});return r}};export{o as C,n as o};
