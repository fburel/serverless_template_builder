(function(e){function a(a){for(var r,o,s=a[0],i=a[1],p=a[2],u=0,d=[];u<s.length;u++)o=s[u],Object.prototype.hasOwnProperty.call(n,o)&&n[o]&&d.push(n[o][0]),n[o]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);c&&c(a);while(d.length)d.shift()();return l.push.apply(l,p||[]),t()}function t(){for(var e,a=0;a<l.length;a++){for(var t=l[a],r=!0,s=1;s<t.length;s++){var i=t[s];0!==n[i]&&(r=!1)}r&&(l.splice(a--,1),e=o(o.s=t[0]))}return e}var r={},n={app:0},l=[];function o(a){if(r[a])return r[a].exports;var t=r[a]={i:a,l:!1,exports:{}};return e[a].call(t.exports,t,t.exports,o),t.l=!0,t.exports}o.m=e,o.c=r,o.d=function(e,a,t){o.o(e,a)||Object.defineProperty(e,a,{enumerable:!0,get:t})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,a){if(1&a&&(e=o(e)),8&a)return e;if(4&a&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&a&&"string"!=typeof e)for(var r in e)o.d(t,r,function(a){return e[a]}.bind(null,r));return t},o.n=function(e){var a=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(a,"a",a),a},o.o=function(e,a){return Object.prototype.hasOwnProperty.call(e,a)},o.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],i=s.push.bind(s);s.push=a,s=s.slice();for(var p=0;p<s.length;p++)a(s[p]);var c=i;l.push([0,"chunk-vendors"]),t()})({0:function(e,a,t){e.exports=t("56d7")},"56d7":function(e,a,t){"use strict";t.r(a);var r=t("2b0e"),n=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("v-app",[t("v-app-bar",{attrs:{app:""}},[e._v("Serverless Template Builder")]),t("v-main",[t("v-container",[t("v-alert",{attrs:{border:"top","colored-border":"",type:"info",elevation:"2"}},[e._v(" This tools helps you create your own yaml file for the aws sam client ")]),t("v-card",{staticClass:"pa-3",attrs:{elevation:"2"}},[t("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:e.valid,callback:function(a){e.valid=a},expression:"valid"}},[t("v-text-field",{attrs:{label:"app name",rules:e.nameRules,required:""},model:{value:e.appName,callback:function(a){e.appName=a},expression:"appName"}}),t("v-text-field",{attrs:{label:"app description"},model:{value:e.appDesc,callback:function(a){e.appDesc=a},expression:"appDesc"}}),t("v-combobox",{attrs:{items:e.runtimes_list,rules:[function(e){return!!e||"runtime is required"}],label:"runtime",chips:""},model:{value:e.appRuntime,callback:function(a){e.appRuntime=a},expression:"appRuntime"}}),[t("v-file-input",{attrs:{placeholder:"Upload your api description file (csv format)",label:"api","prepend-icon":"mdi-paperclip",rules:[function(e){return!!e||"you must select a file"}]},scopedSlots:e._u([{key:"selection",fn:function(a){var r=a.text;return[t("v-chip",{attrs:{small:"",label:"",color:"primary"}},[e._v(" "+e._s(r)+" ")])]}}]),model:{value:e.currentFile,callback:function(a){e.currentFile=a},expression:"currentFile"}})],t("v-btn",{staticClass:"mr-4",attrs:{disabled:!e.valid,color:"success"},on:{click:e.validate}},[e._v(" Submit ")])],2),e.progress>0?t("v-progress-linear",{attrs:{value:e.progress}}):e._e()],1),e.yaml.length>1?t("v-card",{staticClass:"pa-3",attrs:{elevation:"2"}},[t("v-textarea",{attrs:{outlined:"",name:"input-7-4",label:"template.yml",value:e.yaml}})],1):e._e(),e.yaml.length>1?t("v-card",{staticClass:"pa-3",attrs:{elevation:"2"}},[t("v-textarea",{attrs:{outlined:"",name:"input-7-4",label:"template.yml",value:e.files}})],1):e._e()],1)],1)],1)},l=[],o=t("bc3a"),s=t.n(o),i=s.a.create({baseURL:"http://localhost:3000",headers:{"Content-type":"application/json"}});class p{upload(e,a,t,r,n){let l=new FormData;return l.append("appName",e),l.append("appDesc",a),l.append("appRuntime",t),l.append("csv",r),i.post("/api/upload",l,{headers:{"Content-Type":"multipart/form-data"},onUploadProgress:n})}}var c=new p,u={name:"App",components:{SendFormService:c},data:()=>({valid:!0,appName:"",appDesc:"",appRuntime:"",yaml:"",files:"",currentFile:void 0,runtimes_list:["nodejs12.x","dotnet3"],nameRules:[e=>!!e||"Name is required",e=>e&&e.length<=20||"must be 20 characters max",e=>e&&e.match(/^[a-z\-]{1,20}/)||'Name must be lowercase without space or special characters, only the "-" symbol is allowed'],progress:0}),methods:{validate(){this.yaml="",this.$refs.form.validate()?(console.log("valid"),c.upload(this.appName,this.appDesc,this.appRuntime,this.currentFile,e=>{this.progress=Math.round(100*e.loaded/e.total)}).then(e=>{console.log(e),console.log("done"),this.yaml=e.data.template,this.files=e.data.files}).catch(e=>{console.log(e)})):console.log("not valid")}}},d=u,m=t("2877"),v=t("6544"),f=t.n(v),b=t("0798"),h=t("7496"),y=t("40dc"),g=t("8336"),x=t("b0af"),w=t("cc20"),_=t("2b5d"),V=t("a523"),j=t("23a7"),O=t("4bd4"),S=t("f6c4"),k=t("8e36"),C=t("8654"),F=t("a844"),P=Object(m["a"])(d,n,l,!1,null,null,null),R=P.exports;f()(P,{VAlert:b["a"],VApp:h["a"],VAppBar:y["a"],VBtn:g["a"],VCard:x["a"],VChip:w["a"],VCombobox:_["a"],VContainer:V["a"],VFileInput:j["a"],VForm:O["a"],VMain:S["a"],VProgressLinear:k["a"],VTextField:C["a"],VTextarea:F["a"]});var N=t("2f62");r["a"].use(N["a"]);var T=new N["a"].Store({state:{},mutations:{},actions:{},modules:{}}),D=t("f309");r["a"].use(D["a"]);var M=new D["a"]({});r["a"].config.productionTip=!1,new r["a"]({store:T,vuetify:M,render:function(e){return e(R)}}).$mount("#app")}});
//# sourceMappingURL=app.7c32ab4f.js.map