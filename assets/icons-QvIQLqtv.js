function pr(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var je={exports:{}},fe={};var bt;function hr(){if(bt)return fe;bt=1;var e=Symbol.for("react.transitional.element"),t=Symbol.for("react.fragment");function a(r,n,i){var o=null;if(i!==void 0&&(o=""+i),n.key!==void 0&&(o=""+n.key),"key"in n){i={};for(var l in n)l!=="key"&&(i[l]=n[l])}else i=n;return n=i.ref,{$$typeof:e,type:r,key:o,ref:n!==void 0?n:null,props:i}}return fe.Fragment=t,fe.jsx=a,fe.jsxs=a,fe}var xt;function gr(){return xt||(xt=1,je.exports=hr()),je.exports}var es=gr(),Le={exports:{}},g={};var St;function yr(){if(St)return g;St=1;var e=Symbol.for("react.transitional.element"),t=Symbol.for("react.portal"),a=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),n=Symbol.for("react.profiler"),i=Symbol.for("react.consumer"),o=Symbol.for("react.context"),l=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),c=Symbol.for("react.memo"),m=Symbol.for("react.lazy"),v=Symbol.for("react.activity"),S=Symbol.iterator;function h(s){return s===null||typeof s!="object"?null:(s=S&&s[S]||s["@@iterator"],typeof s=="function"?s:null)}var k={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},w=Object.assign,C={};function P(s,d,b){this.props=s,this.context=d,this.refs=C,this.updater=b||k}P.prototype.isReactComponent={},P.prototype.setState=function(s,d){if(typeof s!="object"&&typeof s!="function"&&s!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,s,d,"setState")},P.prototype.forceUpdate=function(s){this.updater.enqueueForceUpdate(this,s,"forceUpdate")};function F(){}F.prototype=P.prototype;function N(s,d,b){this.props=s,this.context=d,this.refs=C,this.updater=b||k}var L=N.prototype=new F;L.constructor=N,w(L,P.prototype),L.isPureReactComponent=!0;var A=Array.isArray;function q(){}var I={H:null,A:null,T:null,S:null},ee=Object.prototype.hasOwnProperty;function le(s,d,b){var y=b.ref;return{$$typeof:e,type:s,key:d,ref:y!==void 0?y:null,props:b}}function fr(s,d){return le(s.type,d,s.props)}function Ne(s){return typeof s=="object"&&s!==null&&s.$$typeof===e}function ur(s){var d={"=":"=0",":":"=2"};return"$"+s.replace(/[=:]/g,function(b){return d[b]})}var gt=/\/+/g;function Re(s,d){return typeof s=="object"&&s!==null&&s.key!=null?ur(""+s.key):d.toString(36)}function cr(s){switch(s.status){case"fulfilled":return s.value;case"rejected":throw s.reason;default:switch(typeof s.status=="string"?s.then(q,q):(s.status="pending",s.then(function(d){s.status==="pending"&&(s.status="fulfilled",s.value=d)},function(d){s.status==="pending"&&(s.status="rejected",s.reason=d)})),s.status){case"fulfilled":return s.value;case"rejected":throw s.reason}}throw s}function te(s,d,b,y,E){var _=typeof s;(_==="undefined"||_==="boolean")&&(s=null);var T=!1;if(s===null)T=!0;else switch(_){case"bigint":case"string":case"number":T=!0;break;case"object":switch(s.$$typeof){case e:case t:T=!0;break;case m:return T=s._init,te(T(s._payload),d,b,y,E)}}if(T)return E=E(s),T=y===""?"."+Re(s,0):y,A(E)?(b="",T!=null&&(b=T.replace(gt,"$&/")+"/"),te(E,d,b,"",function(vr){return vr})):E!=null&&(Ne(E)&&(E=fr(E,b+(E.key==null||s&&s.key===E.key?"":(""+E.key).replace(gt,"$&/")+"/")+T)),d.push(E)),1;T=0;var D=y===""?".":y+":";if(A(s))for(var j=0;j<s.length;j++)y=s[j],_=D+Re(y,j),T+=te(y,d,b,_,E);else if(j=h(s),typeof j=="function")for(s=j.call(s),j=0;!(y=s.next()).done;)y=y.value,_=D+Re(y,j++),T+=te(y,d,b,_,E);else if(_==="object"){if(typeof s.then=="function")return te(cr(s),d,b,y,E);throw d=String(s),Error("Objects are not valid as a React child (found: "+(d==="[object Object]"?"object with keys {"+Object.keys(s).join(", ")+"}":d)+"). If you meant to render a collection of children, use an array instead.")}return T}function be(s,d,b){if(s==null)return s;var y=[],E=0;return te(s,y,"","",function(_){return d.call(b,_,E++)}),y}function dr(s){if(s._status===-1){var d=s._result;d=d(),d.then(function(b){(s._status===0||s._status===-1)&&(s._status=1,s._result=b)},function(b){(s._status===0||s._status===-1)&&(s._status=2,s._result=b)}),s._status===-1&&(s._status=0,s._result=d)}if(s._status===1)return s._result.default;throw s._result}var yt=typeof reportError=="function"?reportError:function(s){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var d=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof s=="object"&&s!==null&&typeof s.message=="string"?String(s.message):String(s),error:s});if(!window.dispatchEvent(d))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",s);return}console.error(s)},mr={map:be,forEach:function(s,d,b){be(s,function(){d.apply(this,arguments)},b)},count:function(s){var d=0;return be(s,function(){d++}),d},toArray:function(s){return be(s,function(d){return d})||[]},only:function(s){if(!Ne(s))throw Error("React.Children.only expected to receive a single React element child.");return s}};return g.Activity=v,g.Children=mr,g.Component=P,g.Fragment=a,g.Profiler=n,g.PureComponent=N,g.StrictMode=r,g.Suspense=f,g.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=I,g.__COMPILER_RUNTIME={__proto__:null,c:function(s){return I.H.useMemoCache(s)}},g.cache=function(s){return function(){return s.apply(null,arguments)}},g.cacheSignal=function(){return null},g.cloneElement=function(s,d,b){if(s==null)throw Error("The argument must be a React element, but you passed "+s+".");var y=w({},s.props),E=s.key;if(d!=null)for(_ in d.key!==void 0&&(E=""+d.key),d)!ee.call(d,_)||_==="key"||_==="__self"||_==="__source"||_==="ref"&&d.ref===void 0||(y[_]=d[_]);var _=arguments.length-2;if(_===1)y.children=b;else if(1<_){for(var T=Array(_),D=0;D<_;D++)T[D]=arguments[D+2];y.children=T}return le(s.type,E,y)},g.createContext=function(s){return s={$$typeof:o,_currentValue:s,_currentValue2:s,_threadCount:0,Provider:null,Consumer:null},s.Provider=s,s.Consumer={$$typeof:i,_context:s},s},g.createElement=function(s,d,b){var y,E={},_=null;if(d!=null)for(y in d.key!==void 0&&(_=""+d.key),d)ee.call(d,y)&&y!=="key"&&y!=="__self"&&y!=="__source"&&(E[y]=d[y]);var T=arguments.length-2;if(T===1)E.children=b;else if(1<T){for(var D=Array(T),j=0;j<T;j++)D[j]=arguments[j+2];E.children=D}if(s&&s.defaultProps)for(y in T=s.defaultProps,T)E[y]===void 0&&(E[y]=T[y]);return le(s,_,E)},g.createRef=function(){return{current:null}},g.forwardRef=function(s){return{$$typeof:l,render:s}},g.isValidElement=Ne,g.lazy=function(s){return{$$typeof:m,_payload:{_status:-1,_result:s},_init:dr}},g.memo=function(s,d){return{$$typeof:c,type:s,compare:d===void 0?null:d}},g.startTransition=function(s){var d=I.T,b={};I.T=b;try{var y=s(),E=I.S;E!==null&&E(b,y),typeof y=="object"&&y!==null&&typeof y.then=="function"&&y.then(q,yt)}catch(_){yt(_)}finally{d!==null&&b.types!==null&&(d.types=b.types),I.T=d}},g.unstable_useCacheRefresh=function(){return I.H.useCacheRefresh()},g.use=function(s){return I.H.use(s)},g.useActionState=function(s,d,b){return I.H.useActionState(s,d,b)},g.useCallback=function(s,d){return I.H.useCallback(s,d)},g.useContext=function(s){return I.H.useContext(s)},g.useDebugValue=function(){},g.useDeferredValue=function(s,d){return I.H.useDeferredValue(s,d)},g.useEffect=function(s,d){return I.H.useEffect(s,d)},g.useEffectEvent=function(s){return I.H.useEffectEvent(s)},g.useId=function(){return I.H.useId()},g.useImperativeHandle=function(s,d,b){return I.H.useImperativeHandle(s,d,b)},g.useInsertionEffect=function(s,d){return I.H.useInsertionEffect(s,d)},g.useLayoutEffect=function(s,d){return I.H.useLayoutEffect(s,d)},g.useMemo=function(s,d){return I.H.useMemo(s,d)},g.useOptimistic=function(s,d){return I.H.useOptimistic(s,d)},g.useReducer=function(s,d,b){return I.H.useReducer(s,d,b)},g.useRef=function(s){return I.H.useRef(s)},g.useState=function(s){return I.H.useState(s)},g.useSyncExternalStore=function(s,d,b){return I.H.useSyncExternalStore(s,d,b)},g.useTransition=function(){return I.H.useTransition()},g.version="19.2.0",g}var At;function br(){return At||(At=1,Le.exports=yr()),Le.exports}var aa=br();const ra=pr(aa);function He(e,t){(t==null||t>e.length)&&(t=e.length);for(var a=0,r=Array(t);a<t;a++)r[a]=e[a];return r}function xr(e){if(Array.isArray(e))return e}function Sr(e){if(Array.isArray(e))return He(e)}function Ar(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function wr(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,na(r.key),r)}}function Er(e,t,a){return t&&wr(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function Ae(e,t){var a=typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=it(e))||t){a&&(e=a);var r=0,n=function(){};return{s:n,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(f){throw f},f:n}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var i,o=!0,l=!1;return{s:function(){a=a.call(e)},n:function(){var f=a.next();return o=f.done,f},e:function(f){l=!0,i=f},f:function(){try{o||a.return==null||a.return()}finally{if(l)throw i}}}}function x(e,t,a){return(t=na(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function kr(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function Pr(e,t){var a=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(a!=null){var r,n,i,o,l=[],f=!0,c=!1;try{if(i=(a=a.call(e)).next,t===0){if(Object(a)!==a)return;f=!1}else for(;!(f=(r=i.call(a)).done)&&(l.push(r.value),l.length!==t);f=!0);}catch(m){c=!0,n=m}finally{try{if(!f&&a.return!=null&&(o=a.return(),Object(o)!==o))return}finally{if(c)throw n}}return l}}function _r(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ir(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function wt(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable})),a.push.apply(a,r)}return a}function u(e){for(var t=1;t<arguments.length;t++){var a=arguments[t]!=null?arguments[t]:{};t%2?wt(Object(a),!0).forEach(function(r){x(e,r,a[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):wt(Object(a)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(a,r))})}return e}function Ie(e,t){return xr(e)||Pr(e,t)||it(e,t)||_r()}function z(e){return Sr(e)||kr(e)||it(e)||Ir()}function Cr(e,t){if(typeof e!="object"||!e)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var r=a.call(e,t);if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function na(e){var t=Cr(e,"string");return typeof t=="symbol"?t:t+""}function ke(e){"@babel/helpers - typeof";return ke=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},ke(e)}function it(e,t){if(e){if(typeof e=="string")return He(e,t);var a={}.toString.call(e).slice(8,-1);return a==="Object"&&e.constructor&&(a=e.constructor.name),a==="Map"||a==="Set"?Array.from(e):a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?He(e,t):void 0}}var Et=function(){},ot={},ia={},oa=null,sa={mark:Et,measure:Et};try{typeof window<"u"&&(ot=window),typeof document<"u"&&(ia=document),typeof MutationObserver<"u"&&(oa=MutationObserver),typeof performance<"u"&&(sa=performance)}catch{}var Tr=ot.navigator||{},kt=Tr.userAgent,Pt=kt===void 0?"":kt,X=ot,O=ia,_t=oa,xe=sa;X.document;var B=!!O.documentElement&&!!O.head&&typeof O.addEventListener=="function"&&typeof O.createElement=="function",la=~Pt.indexOf("MSIE")||~Pt.indexOf("Trident/"),Me,Or=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,Fr=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,fa={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},Nr={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},ua=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],R="classic",he="duotone",ca="sharp",da="sharp-duotone",ma="chisel",va="etch",pa="jelly",ha="jelly-duo",ga="jelly-fill",ya="notdog",ba="notdog-duo",xa="slab",Sa="slab-press",Aa="thumbprint",wa="utility",Ea="utility-duo",ka="utility-fill",Pa="whiteboard",Rr="Classic",jr="Duotone",Lr="Sharp",Mr="Sharp Duotone",$r="Chisel",zr="Etch",Dr="Jelly",Ur="Jelly Duo",Wr="Jelly Fill",Yr="Notdog",Hr="Notdog Duo",Gr="Slab",Br="Slab Press",qr="Thumbprint",Xr="Utility",Vr="Utility Duo",Jr="Utility Fill",Kr="Whiteboard",_a=[R,he,ca,da,ma,va,pa,ha,ga,ya,ba,xa,Sa,Aa,wa,Ea,ka,Pa];Me={},x(x(x(x(x(x(x(x(x(x(Me,R,Rr),he,jr),ca,Lr),da,Mr),ma,$r),va,zr),pa,Dr),ha,Ur),ga,Wr),ya,Yr),x(x(x(x(x(x(x(x(Me,ba,Hr),xa,Gr),Sa,Br),Aa,qr),wa,Xr),Ea,Vr),ka,Jr),Pa,Kr);var Qr={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},Zr={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},en=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),tn={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-press":{regular:"faslpr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},whiteboard:{semibold:"fawsb"}},Ia=["fak","fa-kit","fakd","fa-kit-duotone"],It={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},an=["kit"],rn="kit",nn="kit-duotone",on="Kit",sn="Kit Duotone";x(x({},rn,on),nn,sn);var ln={kit:{"fa-kit":"fak"}},fn={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},un={kit:{fak:"fa-kit"}},Ct={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},$e,Se={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},cn=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],dn="classic",mn="duotone",vn="sharp",pn="sharp-duotone",hn="chisel",gn="etch",yn="jelly",bn="jelly-duo",xn="jelly-fill",Sn="notdog",An="notdog-duo",wn="slab",En="slab-press",kn="thumbprint",Pn="utility",_n="utility-duo",In="utility-fill",Cn="whiteboard",Tn="Classic",On="Duotone",Fn="Sharp",Nn="Sharp Duotone",Rn="Chisel",jn="Etch",Ln="Jelly",Mn="Jelly Duo",$n="Jelly Fill",zn="Notdog",Dn="Notdog Duo",Un="Slab",Wn="Slab Press",Yn="Thumbprint",Hn="Utility",Gn="Utility Duo",Bn="Utility Fill",qn="Whiteboard";$e={},x(x(x(x(x(x(x(x(x(x($e,dn,Tn),mn,On),vn,Fn),pn,Nn),hn,Rn),gn,jn),yn,Ln),bn,Mn),xn,$n),Sn,zn),x(x(x(x(x(x(x(x($e,An,Dn),wn,Un),En,Wn),kn,Yn),Pn,Hn),_n,Gn),In,Bn),Cn,qn);var Xn="kit",Vn="kit-duotone",Jn="Kit",Kn="Kit Duotone";x(x({},Xn,Jn),Vn,Kn);var Qn={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},Zn={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},Ge={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},ei=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],Ca=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fawsb","fatl","fans","fands","faes","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(cn,ei),ti=["solid","regular","light","thin","duotone","brands","semibold"],Ta=[1,2,3,4,5,6,7,8,9,10],ai=Ta.concat([11,12,13,14,15,16,17,18,19,20]),ri=["aw","fw","pull-left","pull-right"],ni=[].concat(z(Object.keys(Zn)),ti,ri,["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","inverse","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul","width-auto","width-fixed",Se.GROUP,Se.SWAP_OPACITY,Se.PRIMARY,Se.SECONDARY]).concat(Ta.map(function(e){return"".concat(e,"x")})).concat(ai.map(function(e){return"w-".concat(e)})),ii={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},H="___FONT_AWESOME___",Be=16,Oa="fa",Fa="svg-inline--fa",Q="data-fa-i2svg",qe="data-fa-pseudo-element",oi="data-fa-pseudo-element-pending",st="data-prefix",lt="data-icon",Tt="fontawesome-i2svg",si="async",li=["HTML","HEAD","STYLE","SCRIPT"],Na=["::before","::after",":before",":after"],Ra=(function(){try{return!0}catch{return!1}})();function ge(e){return new Proxy(e,{get:function(a,r){return r in a?a[r]:a[R]}})}var ja=u({},fa);ja[R]=u(u(u(u({},{"fa-duotone":"duotone"}),fa[R]),It.kit),It["kit-duotone"]);var fi=ge(ja),Xe=u({},tn);Xe[R]=u(u(u(u({},{duotone:"fad"}),Xe[R]),Ct.kit),Ct["kit-duotone"]);var Ot=ge(Xe),Ve=u({},Ge);Ve[R]=u(u({},Ve[R]),un.kit);var ft=ge(Ve),Je=u({},Qn);Je[R]=u(u({},Je[R]),ln.kit);ge(Je);var ui=Or,La="fa-layers-text",ci=Fr,di=u({},Qr);ge(di);var mi=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],ze=Nr,vi=[].concat(z(an),z(ni)),ce=X.FontAwesomeConfig||{};function pi(e){var t=O.querySelector("script["+e+"]");if(t)return t.getAttribute(e)}function hi(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}if(O&&typeof O.querySelector=="function"){var gi=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];gi.forEach(function(e){var t=Ie(e,2),a=t[0],r=t[1],n=hi(pi(a));n!=null&&(ce[r]=n)})}var Ma={styleDefault:"solid",familyDefault:R,cssPrefix:Oa,replacementClass:Fa,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};ce.familyPrefix&&(ce.cssPrefix=ce.familyPrefix);var oe=u(u({},Ma),ce);oe.autoReplaceSvg||(oe.observeMutations=!1);var p={};Object.keys(Ma).forEach(function(e){Object.defineProperty(p,e,{enumerable:!0,set:function(a){oe[e]=a,de.forEach(function(r){return r(p)})},get:function(){return oe[e]}})});Object.defineProperty(p,"familyPrefix",{enumerable:!0,set:function(t){oe.cssPrefix=t,de.forEach(function(a){return a(p)})},get:function(){return oe.cssPrefix}});X.FontAwesomeConfig=p;var de=[];function yi(e){return de.push(e),function(){de.splice(de.indexOf(e),1)}}var ae=Be,U={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function bi(e){if(!(!e||!B)){var t=O.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=e;for(var a=O.head.childNodes,r=null,n=a.length-1;n>-1;n--){var i=a[n],o=(i.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(o)>-1&&(r=i)}return O.head.insertBefore(t,r),e}}var xi="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function Ft(){for(var e=12,t="";e-- >0;)t+=xi[Math.random()*62|0];return t}function se(e){for(var t=[],a=(e||[]).length>>>0;a--;)t[a]=e[a];return t}function ut(e){return e.classList?se(e.classList):(e.getAttribute("class")||"").split(" ").filter(function(t){return t})}function $a(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Si(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,'="').concat($a(e[a]),'" ')},"").trim()}function Ce(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,": ").concat(e[a].trim(),";")},"")}function ct(e){return e.size!==U.size||e.x!==U.x||e.y!==U.y||e.rotate!==U.rotate||e.flipX||e.flipY}function Ai(e){var t=e.transform,a=e.containerWidth,r=e.iconWidth,n={transform:"translate(".concat(a/2," 256)")},i="translate(".concat(t.x*32,", ").concat(t.y*32,") "),o="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),l="rotate(".concat(t.rotate," 0 0)"),f={transform:"".concat(i," ").concat(o," ").concat(l)},c={transform:"translate(".concat(r/2*-1," -256)")};return{outer:n,inner:f,path:c}}function wi(e){var t=e.transform,a=e.width,r=a===void 0?Be:a,n=e.height,i=n===void 0?Be:n,o="";return la?o+="translate(".concat(t.x/ae-r/2,"em, ").concat(t.y/ae-i/2,"em) "):o+="translate(calc(-50% + ".concat(t.x/ae,"em), calc(-50% + ").concat(t.y/ae,"em)) "),o+="scale(".concat(t.size/ae*(t.flipX?-1:1),", ").concat(t.size/ae*(t.flipY?-1:1),") "),o+="rotate(".concat(t.rotate,"deg) "),o}var Ei=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 7 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 7 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 7 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 7 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 7 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 7 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-slab-regular: normal 400 1em/1 "Font Awesome 7 Slab";
  --fa-font-slab-press-regular: normal 400 1em/1 "Font Awesome 7 Slab Press";
  --fa-font-whiteboard-semibold: normal 600 1em/1 "Font Awesome 7 Whiteboard";
  --fa-font-thumbprint-light: normal 300 1em/1 "Font Awesome 7 Thumbprint";
  --fa-font-notdog-solid: normal 900 1em/1 "Font Awesome 7 Notdog";
  --fa-font-notdog-duo-solid: normal 900 1em/1 "Font Awesome 7 Notdog Duo";
  --fa-font-etch-solid: normal 900 1em/1 "Font Awesome 7 Etch";
  --fa-font-jelly-regular: normal 400 1em/1 "Font Awesome 7 Jelly";
  --fa-font-jelly-fill-regular: normal 400 1em/1 "Font Awesome 7 Jelly Fill";
  --fa-font-jelly-duo-regular: normal 400 1em/1 "Font Awesome 7 Jelly Duo";
  --fa-font-chisel-regular: normal 400 1em/1 "Font Awesome 7 Chisel";
  --fa-font-utility-semibold: normal 600 1em/1 "Font Awesome 7 Utility";
  --fa-font-utility-duo-semibold: normal 600 1em/1 "Font Awesome 7 Utility Duo";
  --fa-font-utility-fill-semibold: normal 600 1em/1 "Font Awesome 7 Utility Fill";
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function za(){var e=Oa,t=Fa,a=p.cssPrefix,r=p.replacementClass,n=Ei;if(a!==e||r!==t){var i=new RegExp("\\.".concat(e,"\\-"),"g"),o=new RegExp("\\--".concat(e,"\\-"),"g"),l=new RegExp("\\.".concat(t),"g");n=n.replace(i,".".concat(a,"-")).replace(o,"--".concat(a,"-")).replace(l,".".concat(r))}return n}var Nt=!1;function De(){p.autoAddCss&&!Nt&&(bi(za()),Nt=!0)}var ki={mixout:function(){return{dom:{css:za,insertCss:De}}},hooks:function(){return{beforeDOMElementCreation:function(){De()},beforeI2svg:function(){De()}}}},G=X||{};G[H]||(G[H]={});G[H].styles||(G[H].styles={});G[H].hooks||(G[H].hooks={});G[H].shims||(G[H].shims=[]);var $=G[H],Da=[],Ua=function(){O.removeEventListener("DOMContentLoaded",Ua),Pe=1,Da.map(function(t){return t()})},Pe=!1;B&&(Pe=(O.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(O.readyState),Pe||O.addEventListener("DOMContentLoaded",Ua));function Pi(e){B&&(Pe?setTimeout(e,0):Da.push(e))}function ye(e){var t=e.tag,a=e.attributes,r=a===void 0?{}:a,n=e.children,i=n===void 0?[]:n;return typeof e=="string"?$a(e):"<".concat(t," ").concat(Si(r),">").concat(i.map(ye).join(""),"</").concat(t,">")}function Rt(e,t,a){if(e&&e[t]&&e[t][a])return{prefix:t,iconName:a,icon:e[t][a]}}var Ue=function(t,a,r,n){var i=Object.keys(t),o=i.length,l=a,f,c,m;for(r===void 0?(f=1,m=t[i[0]]):(f=0,m=r);f<o;f++)c=i[f],m=l(m,t[c],c,t);return m};function Wa(e){return z(e).length!==1?null:e.codePointAt(0).toString(16)}function jt(e){return Object.keys(e).reduce(function(t,a){var r=e[a],n=!!r.icon;return n?t[r.iconName]=r.icon:t[a]=r,t},{})}function Ke(e,t){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},r=a.skipHooks,n=r===void 0?!1:r,i=jt(t);typeof $.hooks.addPack=="function"&&!n?$.hooks.addPack(e,jt(t)):$.styles[e]=u(u({},$.styles[e]||{}),i),e==="fas"&&Ke("fa",t)}var ve=$.styles,_i=$.shims,Ya=Object.keys(ft),Ii=Ya.reduce(function(e,t){return e[t]=Object.keys(ft[t]),e},{}),dt=null,Ha={},Ga={},Ba={},qa={},Xa={};function Ci(e){return~vi.indexOf(e)}function Ti(e,t){var a=t.split("-"),r=a[0],n=a.slice(1).join("-");return r===e&&n!==""&&!Ci(n)?n:null}var Va=function(){var t=function(i){return Ue(ve,function(o,l,f){return o[f]=Ue(l,i,{}),o},{})};Ha=t(function(n,i,o){if(i[3]&&(n[i[3]]=o),i[2]){var l=i[2].filter(function(f){return typeof f=="number"});l.forEach(function(f){n[f.toString(16)]=o})}return n}),Ga=t(function(n,i,o){if(n[o]=o,i[2]){var l=i[2].filter(function(f){return typeof f=="string"});l.forEach(function(f){n[f]=o})}return n}),Xa=t(function(n,i,o){var l=i[2];return n[o]=o,l.forEach(function(f){n[f]=o}),n});var a="far"in ve||p.autoFetchSvg,r=Ue(_i,function(n,i){var o=i[0],l=i[1],f=i[2];return l==="far"&&!a&&(l="fas"),typeof o=="string"&&(n.names[o]={prefix:l,iconName:f}),typeof o=="number"&&(n.unicodes[o.toString(16)]={prefix:l,iconName:f}),n},{names:{},unicodes:{}});Ba=r.names,qa=r.unicodes,dt=Te(p.styleDefault,{family:p.familyDefault})};yi(function(e){dt=Te(e.styleDefault,{family:p.familyDefault})});Va();function mt(e,t){return(Ha[e]||{})[t]}function Oi(e,t){return(Ga[e]||{})[t]}function K(e,t){return(Xa[e]||{})[t]}function Ja(e){return Ba[e]||{prefix:null,iconName:null}}function Fi(e){var t=qa[e],a=mt("fas",e);return t||(a?{prefix:"fas",iconName:a}:null)||{prefix:null,iconName:null}}function V(){return dt}var Ka=function(){return{prefix:null,iconName:null,rest:[]}};function Ni(e){var t=R,a=Ya.reduce(function(r,n){return r[n]="".concat(p.cssPrefix,"-").concat(n),r},{});return _a.forEach(function(r){(e.includes(a[r])||e.some(function(n){return Ii[r].includes(n)}))&&(t=r)}),t}function Te(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.family,r=a===void 0?R:a,n=fi[r][e];if(r===he&&!e)return"fad";var i=Ot[r][e]||Ot[r][n],o=e in $.styles?e:null,l=i||o||null;return l}function Ri(e){var t=[],a=null;return e.forEach(function(r){var n=Ti(p.cssPrefix,r);n?a=n:r&&t.push(r)}),{iconName:a,rest:t}}function Lt(e){return e.sort().filter(function(t,a,r){return r.indexOf(t)===a})}var Mt=Ca.concat(Ia);function Oe(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.skipLookups,r=a===void 0?!1:a,n=null,i=Lt(e.filter(function(h){return Mt.includes(h)})),o=Lt(e.filter(function(h){return!Mt.includes(h)})),l=i.filter(function(h){return n=h,!ua.includes(h)}),f=Ie(l,1),c=f[0],m=c===void 0?null:c,v=Ni(i),S=u(u({},Ri(o)),{},{prefix:Te(m,{family:v})});return u(u(u({},S),$i({values:e,family:v,styles:ve,config:p,canonical:S,givenPrefix:n})),ji(r,n,S))}function ji(e,t,a){var r=a.prefix,n=a.iconName;if(e||!r||!n)return{prefix:r,iconName:n};var i=t==="fa"?Ja(n):{},o=K(r,n);return n=i.iconName||o||n,r=i.prefix||r,r==="far"&&!ve.far&&ve.fas&&!p.autoFetchSvg&&(r="fas"),{prefix:r,iconName:n}}var Li=_a.filter(function(e){return e!==R||e!==he}),Mi=Object.keys(Ge).filter(function(e){return e!==R}).map(function(e){return Object.keys(Ge[e])}).flat();function $i(e){var t=e.values,a=e.family,r=e.canonical,n=e.givenPrefix,i=n===void 0?"":n,o=e.styles,l=o===void 0?{}:o,f=e.config,c=f===void 0?{}:f,m=a===he,v=t.includes("fa-duotone")||t.includes("fad"),S=c.familyDefault==="duotone",h=r.prefix==="fad"||r.prefix==="fa-duotone";if(!m&&(v||S||h)&&(r.prefix="fad"),(t.includes("fa-brands")||t.includes("fab"))&&(r.prefix="fab"),!r.prefix&&Li.includes(a)){var k=Object.keys(l).find(function(C){return Mi.includes(C)});if(k||c.autoFetchSvg){var w=en.get(a).defaultShortPrefixId;r.prefix=w,r.iconName=K(r.prefix,r.iconName)||r.iconName}}return(r.prefix==="fa"||i==="fa")&&(r.prefix=V()||"fas"),r}var zi=(function(){function e(){Ar(this,e),this.definitions={}}return Er(e,[{key:"add",value:function(){for(var a=this,r=arguments.length,n=new Array(r),i=0;i<r;i++)n[i]=arguments[i];var o=n.reduce(this._pullDefinitions,{});Object.keys(o).forEach(function(l){a.definitions[l]=u(u({},a.definitions[l]||{}),o[l]),Ke(l,o[l]);var f=ft[R][l];f&&Ke(f,o[l]),Va()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(a,r){var n=r.prefix&&r.iconName&&r.icon?{0:r}:r;return Object.keys(n).map(function(i){var o=n[i],l=o.prefix,f=o.iconName,c=o.icon,m=c[2];a[l]||(a[l]={}),m.length>0&&m.forEach(function(v){typeof v=="string"&&(a[l][v]=c)}),a[l][f]=c}),a}}])})(),$t=[],ne={},ie={},Di=Object.keys(ie);function Ui(e,t){var a=t.mixoutsTo;return $t=e,ne={},Object.keys(ie).forEach(function(r){Di.indexOf(r)===-1&&delete ie[r]}),$t.forEach(function(r){var n=r.mixout?r.mixout():{};if(Object.keys(n).forEach(function(o){typeof n[o]=="function"&&(a[o]=n[o]),ke(n[o])==="object"&&Object.keys(n[o]).forEach(function(l){a[o]||(a[o]={}),a[o][l]=n[o][l]})}),r.hooks){var i=r.hooks();Object.keys(i).forEach(function(o){ne[o]||(ne[o]=[]),ne[o].push(i[o])})}r.provides&&r.provides(ie)}),a}function Qe(e,t){for(var a=arguments.length,r=new Array(a>2?a-2:0),n=2;n<a;n++)r[n-2]=arguments[n];var i=ne[e]||[];return i.forEach(function(o){t=o.apply(null,[t].concat(r))}),t}function Z(e){for(var t=arguments.length,a=new Array(t>1?t-1:0),r=1;r<t;r++)a[r-1]=arguments[r];var n=ne[e]||[];n.forEach(function(i){i.apply(null,a)})}function J(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return ie[e]?ie[e].apply(null,t):void 0}function Ze(e){e.prefix==="fa"&&(e.prefix="fas");var t=e.iconName,a=e.prefix||V();if(t)return t=K(a,t)||t,Rt(Qa.definitions,a,t)||Rt($.styles,a,t)}var Qa=new zi,Wi=function(){p.autoReplaceSvg=!1,p.observeMutations=!1,Z("noAuto")},Yi={i2svg:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return B?(Z("beforeI2svg",t),J("pseudoElements2svg",t),J("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot;p.autoReplaceSvg===!1&&(p.autoReplaceSvg=!0),p.observeMutations=!0,Pi(function(){Gi({autoReplaceSvgRoot:a}),Z("watch",t)})}},Hi={icon:function(t){if(t===null)return null;if(ke(t)==="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:K(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){var a=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],r=Te(t[0]);return{prefix:r,iconName:K(r,a)||a}}if(typeof t=="string"&&(t.indexOf("".concat(p.cssPrefix,"-"))>-1||t.match(ui))){var n=Oe(t.split(" "),{skipLookups:!0});return{prefix:n.prefix||V(),iconName:K(n.prefix,n.iconName)||n.iconName}}if(typeof t=="string"){var i=V();return{prefix:i,iconName:K(i,t)||t}}}},M={noAuto:Wi,config:p,dom:Yi,parse:Hi,library:Qa,findIconDefinition:Ze,toHtml:ye},Gi=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot,r=a===void 0?O:a;(Object.keys($.styles).length>0||p.autoFetchSvg)&&B&&p.autoReplaceSvg&&M.dom.i2svg({node:r})};function Fe(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(r){return ye(r)})}}),Object.defineProperty(e,"node",{get:function(){if(B){var r=O.createElement("div");return r.innerHTML=e.html,r.children}}}),e}function Bi(e){var t=e.children,a=e.main,r=e.mask,n=e.attributes,i=e.styles,o=e.transform;if(ct(o)&&a.found&&!r.found){var l=a.width,f=a.height,c={x:l/f/2,y:.5};n.style=Ce(u(u({},i),{},{"transform-origin":"".concat(c.x+o.x/16,"em ").concat(c.y+o.y/16,"em")}))}return[{tag:"svg",attributes:n,children:t}]}function qi(e){var t=e.prefix,a=e.iconName,r=e.children,n=e.attributes,i=e.symbol,o=i===!0?"".concat(t,"-").concat(p.cssPrefix,"-").concat(a):i;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:u(u({},n),{},{id:o}),children:r}]}]}function Xi(e){var t=["aria-label","aria-labelledby","title","role"];return t.some(function(a){return a in e})}function vt(e){var t=e.icons,a=t.main,r=t.mask,n=e.prefix,i=e.iconName,o=e.transform,l=e.symbol,f=e.maskId,c=e.extra,m=e.watchable,v=m===void 0?!1:m,S=r.found?r:a,h=S.width,k=S.height,w=[p.replacementClass,i?"".concat(p.cssPrefix,"-").concat(i):""].filter(function(A){return c.classes.indexOf(A)===-1}).filter(function(A){return A!==""||!!A}).concat(c.classes).join(" "),C={children:[],attributes:u(u({},c.attributes),{},{"data-prefix":n,"data-icon":i,class:w,role:c.attributes.role||"img",viewBox:"0 0 ".concat(h," ").concat(k)})};!Xi(c.attributes)&&!c.attributes["aria-hidden"]&&(C.attributes["aria-hidden"]="true"),v&&(C.attributes[Q]="");var P=u(u({},C),{},{prefix:n,iconName:i,main:a,mask:r,maskId:f,transform:o,symbol:l,styles:u({},c.styles)}),F=r.found&&a.found?J("generateAbstractMask",P)||{children:[],attributes:{}}:J("generateAbstractIcon",P)||{children:[],attributes:{}},N=F.children,L=F.attributes;return P.children=N,P.attributes=L,l?qi(P):Bi(P)}function zt(e){var t=e.content,a=e.width,r=e.height,n=e.transform,i=e.extra,o=e.watchable,l=o===void 0?!1:o,f=u(u({},i.attributes),{},{class:i.classes.join(" ")});l&&(f[Q]="");var c=u({},i.styles);ct(n)&&(c.transform=wi({transform:n,width:a,height:r}),c["-webkit-transform"]=c.transform);var m=Ce(c);m.length>0&&(f.style=m);var v=[];return v.push({tag:"span",attributes:f,children:[t]}),v}function Vi(e){var t=e.content,a=e.extra,r=u(u({},a.attributes),{},{class:a.classes.join(" ")}),n=Ce(a.styles);n.length>0&&(r.style=n);var i=[];return i.push({tag:"span",attributes:r,children:[t]}),i}var We=$.styles;function et(e){var t=e[0],a=e[1],r=e.slice(4),n=Ie(r,1),i=n[0],o=null;return Array.isArray(i)?o={tag:"g",attributes:{class:"".concat(p.cssPrefix,"-").concat(ze.GROUP)},children:[{tag:"path",attributes:{class:"".concat(p.cssPrefix,"-").concat(ze.SECONDARY),fill:"currentColor",d:i[0]}},{tag:"path",attributes:{class:"".concat(p.cssPrefix,"-").concat(ze.PRIMARY),fill:"currentColor",d:i[1]}}]}:o={tag:"path",attributes:{fill:"currentColor",d:i}},{found:!0,width:t,height:a,icon:o}}var Ji={found:!1,width:512,height:512};function Ki(e,t){!Ra&&!p.showMissingIcons&&e&&console.error('Icon with name "'.concat(e,'" and prefix "').concat(t,'" is missing.'))}function tt(e,t){var a=t;return t==="fa"&&p.styleDefault!==null&&(t=V()),new Promise(function(r,n){if(a==="fa"){var i=Ja(e)||{};e=i.iconName||e,t=i.prefix||t}if(e&&t&&We[t]&&We[t][e]){var o=We[t][e];return r(et(o))}Ki(e,t),r(u(u({},Ji),{},{icon:p.showMissingIcons&&e?J("missingIconAbstract")||{}:{}}))})}var Dt=function(){},at=p.measurePerformance&&xe&&xe.mark&&xe.measure?xe:{mark:Dt,measure:Dt},ue='FA "7.1.0"',Qi=function(t){return at.mark("".concat(ue," ").concat(t," begins")),function(){return Za(t)}},Za=function(t){at.mark("".concat(ue," ").concat(t," ends")),at.measure("".concat(ue," ").concat(t),"".concat(ue," ").concat(t," begins"),"".concat(ue," ").concat(t," ends"))},pt={begin:Qi,end:Za},we=function(){};function Ut(e){var t=e.getAttribute?e.getAttribute(Q):null;return typeof t=="string"}function Zi(e){var t=e.getAttribute?e.getAttribute(st):null,a=e.getAttribute?e.getAttribute(lt):null;return t&&a}function eo(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(p.replacementClass)}function to(){if(p.autoReplaceSvg===!0)return Ee.replace;var e=Ee[p.autoReplaceSvg];return e||Ee.replace}function ao(e){return O.createElementNS("http://www.w3.org/2000/svg",e)}function ro(e){return O.createElement(e)}function er(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.ceFn,r=a===void 0?e.tag==="svg"?ao:ro:a;if(typeof e=="string")return O.createTextNode(e);var n=r(e.tag);Object.keys(e.attributes||[]).forEach(function(o){n.setAttribute(o,e.attributes[o])});var i=e.children||[];return i.forEach(function(o){n.appendChild(er(o,{ceFn:r}))}),n}function no(e){var t=" ".concat(e.outerHTML," ");return t="".concat(t,"Font Awesome fontawesome.com "),t}var Ee={replace:function(t){var a=t[0];if(a.parentNode)if(t[1].forEach(function(n){a.parentNode.insertBefore(er(n),a)}),a.getAttribute(Q)===null&&p.keepOriginalSource){var r=O.createComment(no(a));a.parentNode.replaceChild(r,a)}else a.remove()},nest:function(t){var a=t[0],r=t[1];if(~ut(a).indexOf(p.replacementClass))return Ee.replace(t);var n=new RegExp("".concat(p.cssPrefix,"-.*"));if(delete r[0].attributes.id,r[0].attributes.class){var i=r[0].attributes.class.split(" ").reduce(function(l,f){return f===p.replacementClass||f.match(n)?l.toSvg.push(f):l.toNode.push(f),l},{toNode:[],toSvg:[]});r[0].attributes.class=i.toSvg.join(" "),i.toNode.length===0?a.removeAttribute("class"):a.setAttribute("class",i.toNode.join(" "))}var o=r.map(function(l){return ye(l)}).join(`
`);a.setAttribute(Q,""),a.innerHTML=o}};function Wt(e){e()}function tr(e,t){var a=typeof t=="function"?t:we;if(e.length===0)a();else{var r=Wt;p.mutateApproach===si&&(r=X.requestAnimationFrame||Wt),r(function(){var n=to(),i=pt.begin("mutate");e.map(n),i(),a()})}}var ht=!1;function ar(){ht=!0}function rt(){ht=!1}var _e=null;function Yt(e){if(_t&&p.observeMutations){var t=e.treeCallback,a=t===void 0?we:t,r=e.nodeCallback,n=r===void 0?we:r,i=e.pseudoElementsCallback,o=i===void 0?we:i,l=e.observeMutationsRoot,f=l===void 0?O:l;_e=new _t(function(c){if(!ht){var m=V();se(c).forEach(function(v){if(v.type==="childList"&&v.addedNodes.length>0&&!Ut(v.addedNodes[0])&&(p.searchPseudoElements&&o(v.target),a(v.target)),v.type==="attributes"&&v.target.parentNode&&p.searchPseudoElements&&o([v.target],!0),v.type==="attributes"&&Ut(v.target)&&~mi.indexOf(v.attributeName))if(v.attributeName==="class"&&Zi(v.target)){var S=Oe(ut(v.target)),h=S.prefix,k=S.iconName;v.target.setAttribute(st,h||m),k&&v.target.setAttribute(lt,k)}else eo(v.target)&&n(v.target)})}}),B&&_e.observe(f,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function io(){_e&&_e.disconnect()}function oo(e){var t=e.getAttribute("style"),a=[];return t&&(a=t.split(";").reduce(function(r,n){var i=n.split(":"),o=i[0],l=i.slice(1);return o&&l.length>0&&(r[o]=l.join(":").trim()),r},{})),a}function so(e){var t=e.getAttribute("data-prefix"),a=e.getAttribute("data-icon"),r=e.innerText!==void 0?e.innerText.trim():"",n=Oe(ut(e));return n.prefix||(n.prefix=V()),t&&a&&(n.prefix=t,n.iconName=a),n.iconName&&n.prefix||(n.prefix&&r.length>0&&(n.iconName=Oi(n.prefix,e.innerText)||mt(n.prefix,Wa(e.innerText))),!n.iconName&&p.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(n.iconName=e.firstChild.data)),n}function lo(e){var t=se(e.attributes).reduce(function(a,r){return a.name!=="class"&&a.name!=="style"&&(a[r.name]=r.value),a},{});return t}function fo(){return{iconName:null,prefix:null,transform:U,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function Ht(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},a=so(e),r=a.iconName,n=a.prefix,i=a.rest,o=lo(e),l=Qe("parseNodeAttributes",{},e),f=t.styleParser?oo(e):[];return u({iconName:r,prefix:n,transform:U,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:i,styles:f,attributes:o}},l)}var uo=$.styles;function rr(e){var t=p.autoReplaceSvg==="nest"?Ht(e,{styleParser:!1}):Ht(e);return~t.extra.classes.indexOf(La)?J("generateLayersText",e,t):J("generateSvgReplacementMutation",e,t)}function co(){return[].concat(z(Ia),z(Ca))}function Gt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!B)return Promise.resolve();var a=O.documentElement.classList,r=function(v){return a.add("".concat(Tt,"-").concat(v))},n=function(v){return a.remove("".concat(Tt,"-").concat(v))},i=p.autoFetchSvg?co():ua.concat(Object.keys(uo));i.includes("fa")||i.push("fa");var o=[".".concat(La,":not([").concat(Q,"])")].concat(i.map(function(m){return".".concat(m,":not([").concat(Q,"])")})).join(", ");if(o.length===0)return Promise.resolve();var l=[];try{l=se(e.querySelectorAll(o))}catch{}if(l.length>0)r("pending"),n("complete");else return Promise.resolve();var f=pt.begin("onTree"),c=l.reduce(function(m,v){try{var S=rr(v);S&&m.push(S)}catch(h){Ra||h.name==="MissingIcon"&&console.error(h)}return m},[]);return new Promise(function(m,v){Promise.all(c).then(function(S){tr(S,function(){r("active"),r("complete"),n("pending"),typeof t=="function"&&t(),f(),m()})}).catch(function(S){f(),v(S)})})}function mo(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;rr(e).then(function(a){a&&tr([a],t)})}function vo(e){return function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=(t||{}).icon?t:Ze(t||{}),n=a.mask;return n&&(n=(n||{}).icon?n:Ze(n||{})),e(r,u(u({},a),{},{mask:n}))}}var po=function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=a.transform,n=r===void 0?U:r,i=a.symbol,o=i===void 0?!1:i,l=a.mask,f=l===void 0?null:l,c=a.maskId,m=c===void 0?null:c,v=a.classes,S=v===void 0?[]:v,h=a.attributes,k=h===void 0?{}:h,w=a.styles,C=w===void 0?{}:w;if(t){var P=t.prefix,F=t.iconName,N=t.icon;return Fe(u({type:"icon"},t),function(){return Z("beforeDOMElementCreation",{iconDefinition:t,params:a}),vt({icons:{main:et(N),mask:f?et(f.icon):{found:!1,width:null,height:null,icon:{}}},prefix:P,iconName:F,transform:u(u({},U),n),symbol:o,maskId:m,extra:{attributes:k,styles:C,classes:S}})})}},ho={mixout:function(){return{icon:vo(po)}},hooks:function(){return{mutationObserverCallbacks:function(a){return a.treeCallback=Gt,a.nodeCallback=mo,a}}},provides:function(t){t.i2svg=function(a){var r=a.node,n=r===void 0?O:r,i=a.callback,o=i===void 0?function(){}:i;return Gt(n,o)},t.generateSvgReplacementMutation=function(a,r){var n=r.iconName,i=r.prefix,o=r.transform,l=r.symbol,f=r.mask,c=r.maskId,m=r.extra;return new Promise(function(v,S){Promise.all([tt(n,i),f.iconName?tt(f.iconName,f.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(h){var k=Ie(h,2),w=k[0],C=k[1];v([a,vt({icons:{main:w,mask:C},prefix:i,iconName:n,transform:o,symbol:l,maskId:c,extra:m,watchable:!0})])}).catch(S)})},t.generateAbstractIcon=function(a){var r=a.children,n=a.attributes,i=a.main,o=a.transform,l=a.styles,f=Ce(l);f.length>0&&(n.style=f);var c;return ct(o)&&(c=J("generateAbstractTransformGrouping",{main:i,transform:o,containerWidth:i.width,iconWidth:i.width})),r.push(c||i.icon),{children:r,attributes:n}}}},go={mixout:function(){return{layer:function(a){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=r.classes,i=n===void 0?[]:n;return Fe({type:"layer"},function(){Z("beforeDOMElementCreation",{assembler:a,params:r});var o=[];return a(function(l){Array.isArray(l)?l.map(function(f){o=o.concat(f.abstract)}):o=o.concat(l.abstract)}),[{tag:"span",attributes:{class:["".concat(p.cssPrefix,"-layers")].concat(z(i)).join(" ")},children:o}]})}}}},yo={mixout:function(){return{counter:function(a){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};r.title;var n=r.classes,i=n===void 0?[]:n,o=r.attributes,l=o===void 0?{}:o,f=r.styles,c=f===void 0?{}:f;return Fe({type:"counter",content:a},function(){return Z("beforeDOMElementCreation",{content:a,params:r}),Vi({content:a.toString(),extra:{attributes:l,styles:c,classes:["".concat(p.cssPrefix,"-layers-counter")].concat(z(i))}})})}}}},bo={mixout:function(){return{text:function(a){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=r.transform,i=n===void 0?U:n,o=r.classes,l=o===void 0?[]:o,f=r.attributes,c=f===void 0?{}:f,m=r.styles,v=m===void 0?{}:m;return Fe({type:"text",content:a},function(){return Z("beforeDOMElementCreation",{content:a,params:r}),zt({content:a,transform:u(u({},U),i),extra:{attributes:c,styles:v,classes:["".concat(p.cssPrefix,"-layers-text")].concat(z(l))}})})}}},provides:function(t){t.generateLayersText=function(a,r){var n=r.transform,i=r.extra,o=null,l=null;if(la){var f=parseInt(getComputedStyle(a).fontSize,10),c=a.getBoundingClientRect();o=c.width/f,l=c.height/f}return Promise.resolve([a,zt({content:a.innerHTML,width:o,height:l,transform:n,extra:i,watchable:!0})])}}},nr=new RegExp('"',"ug"),Bt=[1105920,1112319],qt=u(u(u(u({},{FontAwesome:{normal:"fas",400:"fas"}}),Zr),ii),fn),nt=Object.keys(qt).reduce(function(e,t){return e[t.toLowerCase()]=qt[t],e},{}),xo=Object.keys(nt).reduce(function(e,t){var a=nt[t];return e[t]=a[900]||z(Object.entries(a))[0][1],e},{});function So(e){var t=e.replace(nr,"");return Wa(z(t)[0]||"")}function Ao(e){var t=e.getPropertyValue("font-feature-settings").includes("ss01"),a=e.getPropertyValue("content"),r=a.replace(nr,""),n=r.codePointAt(0),i=n>=Bt[0]&&n<=Bt[1],o=r.length===2?r[0]===r[1]:!1;return i||o||t}function wo(e,t){var a=e.replace(/^['"]|['"]$/g,"").toLowerCase(),r=parseInt(t),n=isNaN(r)?"normal":r;return(nt[a]||{})[n]||xo[a]}function Xt(e,t){var a="".concat(oi).concat(t.replace(":","-"));return new Promise(function(r,n){if(e.getAttribute(a)!==null)return r();var i=se(e.children),o=i.filter(function(q){return q.getAttribute(qe)===t})[0],l=X.getComputedStyle(e,t),f=l.getPropertyValue("font-family"),c=f.match(ci),m=l.getPropertyValue("font-weight"),v=l.getPropertyValue("content");if(o&&!c)return e.removeChild(o),r();if(c&&v!=="none"&&v!==""){var S=l.getPropertyValue("content"),h=wo(f,m),k=So(S),w=c[0].startsWith("FontAwesome"),C=Ao(l),P=mt(h,k),F=P;if(w){var N=Fi(k);N.iconName&&N.prefix&&(P=N.iconName,h=N.prefix)}if(P&&!C&&(!o||o.getAttribute(st)!==h||o.getAttribute(lt)!==F)){e.setAttribute(a,F),o&&e.removeChild(o);var L=fo(),A=L.extra;A.attributes[qe]=t,tt(P,h).then(function(q){var I=vt(u(u({},L),{},{icons:{main:q,mask:Ka()},prefix:h,iconName:F,extra:A,watchable:!0})),ee=O.createElementNS("http://www.w3.org/2000/svg","svg");t==="::before"?e.insertBefore(ee,e.firstChild):e.appendChild(ee),ee.outerHTML=I.map(function(le){return ye(le)}).join(`
`),e.removeAttribute(a),r()}).catch(n)}else r()}else r()})}function Eo(e){return Promise.all([Xt(e,"::before"),Xt(e,"::after")])}function ko(e){return e.parentNode!==document.head&&!~li.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(qe)&&(!e.parentNode||e.parentNode.tagName!=="svg")}var Po=function(t){return!!t&&Na.some(function(a){return t.includes(a)})},_o=function(t){if(!t)return[];var a=new Set,r=t.split(/,(?![^()]*\))/).map(function(f){return f.trim()});r=r.flatMap(function(f){return f.includes("(")?f:f.split(",").map(function(c){return c.trim()})});var n=Ae(r),i;try{for(n.s();!(i=n.n()).done;){var o=i.value;if(Po(o)){var l=Na.reduce(function(f,c){return f.replace(c,"")},o);l!==""&&l!=="*"&&a.add(l)}}}catch(f){n.e(f)}finally{n.f()}return a};function Vt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(B){var a;if(t)a=e;else if(p.searchPseudoElementsFullScan)a=e.querySelectorAll("*");else{var r=new Set,n=Ae(document.styleSheets),i;try{for(n.s();!(i=n.n()).done;){var o=i.value;try{var l=Ae(o.cssRules),f;try{for(l.s();!(f=l.n()).done;){var c=f.value,m=_o(c.selectorText),v=Ae(m),S;try{for(v.s();!(S=v.n()).done;){var h=S.value;r.add(h)}}catch(w){v.e(w)}finally{v.f()}}}catch(w){l.e(w)}finally{l.f()}}catch(w){p.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(o.href," (").concat(w.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(w){n.e(w)}finally{n.f()}if(!r.size)return;var k=Array.from(r).join(", ");try{a=e.querySelectorAll(k)}catch{}}return new Promise(function(w,C){var P=se(a).filter(ko).map(Eo),F=pt.begin("searchPseudoElements");ar(),Promise.all(P).then(function(){F(),rt(),w()}).catch(function(){F(),rt(),C()})})}}var Io={hooks:function(){return{mutationObserverCallbacks:function(a){return a.pseudoElementsCallback=Vt,a}}},provides:function(t){t.pseudoElements2svg=function(a){var r=a.node,n=r===void 0?O:r;p.searchPseudoElements&&Vt(n)}}},Jt=!1,Co={mixout:function(){return{dom:{unwatch:function(){ar(),Jt=!0}}}},hooks:function(){return{bootstrap:function(){Yt(Qe("mutationObserverCallbacks",{}))},noAuto:function(){io()},watch:function(a){var r=a.observeMutationsRoot;Jt?rt():Yt(Qe("mutationObserverCallbacks",{observeMutationsRoot:r}))}}}},Kt=function(t){var a={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce(function(r,n){var i=n.toLowerCase().split("-"),o=i[0],l=i.slice(1).join("-");if(o&&l==="h")return r.flipX=!0,r;if(o&&l==="v")return r.flipY=!0,r;if(l=parseFloat(l),isNaN(l))return r;switch(o){case"grow":r.size=r.size+l;break;case"shrink":r.size=r.size-l;break;case"left":r.x=r.x-l;break;case"right":r.x=r.x+l;break;case"up":r.y=r.y-l;break;case"down":r.y=r.y+l;break;case"rotate":r.rotate=r.rotate+l;break}return r},a)},To={mixout:function(){return{parse:{transform:function(a){return Kt(a)}}}},hooks:function(){return{parseNodeAttributes:function(a,r){var n=r.getAttribute("data-fa-transform");return n&&(a.transform=Kt(n)),a}}},provides:function(t){t.generateAbstractTransformGrouping=function(a){var r=a.main,n=a.transform,i=a.containerWidth,o=a.iconWidth,l={transform:"translate(".concat(i/2," 256)")},f="translate(".concat(n.x*32,", ").concat(n.y*32,") "),c="scale(".concat(n.size/16*(n.flipX?-1:1),", ").concat(n.size/16*(n.flipY?-1:1),") "),m="rotate(".concat(n.rotate," 0 0)"),v={transform:"".concat(f," ").concat(c," ").concat(m)},S={transform:"translate(".concat(o/2*-1," -256)")},h={outer:l,inner:v,path:S};return{tag:"g",attributes:u({},h.outer),children:[{tag:"g",attributes:u({},h.inner),children:[{tag:r.icon.tag,children:r.icon.children,attributes:u(u({},r.icon.attributes),h.path)}]}]}}}},Ye={x:0,y:0,width:"100%",height:"100%"};function Qt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill="black"),e}function Oo(e){return e.tag==="g"?e.children:[e]}var Fo={hooks:function(){return{parseNodeAttributes:function(a,r){var n=r.getAttribute("data-fa-mask"),i=n?Oe(n.split(" ").map(function(o){return o.trim()})):Ka();return i.prefix||(i.prefix=V()),a.mask=i,a.maskId=r.getAttribute("data-fa-mask-id"),a}}},provides:function(t){t.generateAbstractMask=function(a){var r=a.children,n=a.attributes,i=a.main,o=a.mask,l=a.maskId,f=a.transform,c=i.width,m=i.icon,v=o.width,S=o.icon,h=Ai({transform:f,containerWidth:v,iconWidth:c}),k={tag:"rect",attributes:u(u({},Ye),{},{fill:"white"})},w=m.children?{children:m.children.map(Qt)}:{},C={tag:"g",attributes:u({},h.inner),children:[Qt(u({tag:m.tag,attributes:u(u({},m.attributes),h.path)},w))]},P={tag:"g",attributes:u({},h.outer),children:[C]},F="mask-".concat(l||Ft()),N="clip-".concat(l||Ft()),L={tag:"mask",attributes:u(u({},Ye),{},{id:F,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[k,P]},A={tag:"defs",children:[{tag:"clipPath",attributes:{id:N},children:Oo(S)},L]};return r.push(A,{tag:"rect",attributes:u({fill:"currentColor","clip-path":"url(#".concat(N,")"),mask:"url(#".concat(F,")")},Ye)}),{children:r,attributes:n}}}},No={provides:function(t){var a=!1;X.matchMedia&&(a=X.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){var r=[],n={fill:"currentColor"},i={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};r.push({tag:"path",attributes:u(u({},n),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var o=u(u({},i),{},{attributeName:"opacity"}),l={tag:"circle",attributes:u(u({},n),{},{cx:"256",cy:"364",r:"28"}),children:[]};return a||l.children.push({tag:"animate",attributes:u(u({},i),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:u(u({},o),{},{values:"1;0;1;1;0;1;"})}),r.push(l),r.push({tag:"path",attributes:u(u({},n),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:a?[]:[{tag:"animate",attributes:u(u({},o),{},{values:"1;0;0;0;0;1;"})}]}),a||r.push({tag:"path",attributes:u(u({},n),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:u(u({},o),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:r}}}},Ro={hooks:function(){return{parseNodeAttributes:function(a,r){var n=r.getAttribute("data-fa-symbol"),i=n===null?!1:n===""?!0:n;return a.symbol=i,a}}}},jo=[ki,ho,go,yo,bo,Io,Co,To,Fo,No,Ro];Ui(jo,{mixoutsTo:M});M.noAuto;var pe=M.config;M.library;M.dom;var ir=M.parse;M.findIconDefinition;M.toHtml;var Lo=M.icon;M.layer;M.text;M.counter;function Mo(e){return e=e-0,e===e}function or(e){return Mo(e)?e:(e=e.replace(/[_-]+(.)?/g,(t,a)=>a?a.toUpperCase():""),e.charAt(0).toLowerCase()+e.slice(1))}function $o(e){return e.charAt(0).toUpperCase()+e.slice(1)}var re=new Map,zo=1e3;function Do(e){if(re.has(e))return re.get(e);const t={};let a=0;const r=e.length;for(;a<r;){const n=e.indexOf(";",a),i=n===-1?r:n,o=e.slice(a,i).trim();if(o){const l=o.indexOf(":");if(l>0){const f=o.slice(0,l).trim(),c=o.slice(l+1).trim();if(f&&c){const m=or(f);t[m.startsWith("webkit")?$o(m):m]=c}}}a=i+1}if(re.size===zo){const n=re.keys().next().value;n&&re.delete(n)}return re.set(e,t),t}function sr(e,t,a={}){if(typeof t=="string")return t;const r=(t.children||[]).map(c=>sr(e,c)),n=t.attributes||{},i={};for(const[c,m]of Object.entries(n))switch(!0){case c==="class":{i.className=m;break}case c==="style":{i.style=Do(String(m));break}case c.startsWith("aria-"):case c.startsWith("data-"):{i[c.toLowerCase()]=m;break}default:i[or(c)]=m}const{style:o,"aria-label":l,...f}=a;return o&&(i.style=i.style?{...i.style,...o}:o),l&&(i["aria-label"]=l,i["aria-hidden"]="false"),e(t.tag,{...f,...i},...r)}var Uo=sr.bind(null,ra.createElement),Zt=(e,t)=>{const a=aa.useId();return e||(t?a:void 0)},Wo=class{constructor(e="react-fontawesome"){this.enabled=!1;let t=!1;try{t=typeof process<"u"&&!1}catch{}this.scope=e,this.enabled=t}log(...e){this.enabled&&console.log(`[${this.scope}]`,...e)}warn(...e){this.enabled&&console.warn(`[${this.scope}]`,...e)}error(...e){this.enabled&&console.error(`[${this.scope}]`,...e)}},Yo="searchPseudoElementsFullScan"in pe?"7.0.0":"6.0.0",Ho=Number.parseInt(Yo)>=7,me="fa",W={beat:"fa-beat",fade:"fa-fade",beatFade:"fa-beat-fade",bounce:"fa-bounce",shake:"fa-shake",spin:"fa-spin",spinPulse:"fa-spin-pulse",spinReverse:"fa-spin-reverse",pulse:"fa-pulse"},Go={left:"fa-pull-left",right:"fa-pull-right"},Bo={90:"fa-rotate-90",180:"fa-rotate-180",270:"fa-rotate-270"},qo={"2xs":"fa-2xs",xs:"fa-xs",sm:"fa-sm",lg:"fa-lg",xl:"fa-xl","2xl":"fa-2xl","1x":"fa-1x","2x":"fa-2x","3x":"fa-3x","4x":"fa-4x","5x":"fa-5x","6x":"fa-6x","7x":"fa-7x","8x":"fa-8x","9x":"fa-9x","10x":"fa-10x"},Y={border:"fa-border",fixedWidth:"fa-fw",flip:"fa-flip",flipHorizontal:"fa-flip-horizontal",flipVertical:"fa-flip-vertical",inverse:"fa-inverse",rotateBy:"fa-rotate-by",swapOpacity:"fa-swap-opacity",widthAuto:"fa-width-auto"};function Xo(e){const t=pe.cssPrefix||pe.familyPrefix||me;return t===me?e:e.replace(new RegExp(`(?<=^|\\s)${me}-`,"g"),`${t}-`)}function Vo(e){const{beat:t,fade:a,beatFade:r,bounce:n,shake:i,spin:o,spinPulse:l,spinReverse:f,pulse:c,fixedWidth:m,inverse:v,border:S,flip:h,size:k,rotation:w,pull:C,swapOpacity:P,rotateBy:F,widthAuto:N,className:L}=e,A=[];return L&&A.push(...L.split(" ")),t&&A.push(W.beat),a&&A.push(W.fade),r&&A.push(W.beatFade),n&&A.push(W.bounce),i&&A.push(W.shake),o&&A.push(W.spin),f&&A.push(W.spinReverse),l&&A.push(W.spinPulse),c&&A.push(W.pulse),m&&A.push(Y.fixedWidth),v&&A.push(Y.inverse),S&&A.push(Y.border),h===!0&&A.push(Y.flip),(h==="horizontal"||h==="both")&&A.push(Y.flipHorizontal),(h==="vertical"||h==="both")&&A.push(Y.flipVertical),k!=null&&A.push(qo[k]),w!=null&&w!==0&&A.push(Bo[w]),C!=null&&A.push(Go[C]),P&&A.push(Y.swapOpacity),Ho?(F&&A.push(Y.rotateBy),N&&A.push(Y.widthAuto),(pe.cssPrefix||pe.familyPrefix||me)===me?A:A.map(Xo)):A}var Jo=e=>typeof e=="object"&&"icon"in e&&!!e.icon;function ea(e){if(e)return Jo(e)?e:ir.icon(e)}function Ko(e){return Object.keys(e)}var ta=new Wo("FontAwesomeIcon"),lr={border:!1,className:"",mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1},Qo=new Set(Object.keys(lr)),Zo=ra.forwardRef((e,t)=>{const a={...lr,...e},{icon:r,mask:n,symbol:i,title:o,titleId:l,maskId:f,transform:c}=a,m=Zt(f,!!n),v=Zt(l,!!o),S=ea(r);if(!S)return ta.error("Icon lookup is undefined",r),null;const h=Vo(a),k=typeof c=="string"?ir.transform(c):c,w=ea(n),C=Lo(S,{...h.length>0&&{classes:h},...k&&{transform:k},...w&&{mask:w},symbol:i,title:o,titleId:v,maskId:m});if(!C)return ta.error("Could not find icon",S),null;const{abstract:P}=C,F={ref:t};for(const N of Ko(a))Qo.has(N)||(F[N]=a[N]);return Uo(P[0],F)});Zo.displayName="FontAwesomeIcon";var ts={prefix:"fas",iconName:"magnifying-glass",icon:[512,512,[128269,"search"],"f002","M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"]},as={prefix:"fas",iconName:"book",icon:[448,512,[128212],"f02d","M384 512L96 512c-53 0-96-43-96-96L0 96C0 43 43 0 96 0L400 0c26.5 0 48 21.5 48 48l0 288c0 20.9-13.4 38.7-32 45.3l0 66.7c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0zM96 384c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0-64-256 0zm32-232c0 13.3 10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0c-13.3 0-24 10.7-24 24zm24 72c-13.3 0-24 10.7-24 24s10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0z"]},rs={prefix:"fas",iconName:"sun",icon:[576,512,[9728],"f185","M178.2-10.1c7.4-3.1 15.8-2.2 22.5 2.2l87.8 58.2 87.8-58.2c6.7-4.4 15.1-5.2 22.5-2.2S411.4-.5 413 7.3l20.9 103.2 103.2 20.9c7.8 1.6 14.4 7 17.4 14.3s2.2 15.8-2.2 22.5l-58.2 87.8 58.2 87.8c4.4 6.7 5.2 15.1 2.2 22.5s-9.6 12.8-17.4 14.3L433.8 401.4 413 504.7c-1.6 7.8-7 14.4-14.3 17.4s-15.8 2.2-22.5-2.2l-87.8-58.2-87.8 58.2c-6.7 4.4-15.1 5.2-22.5 2.2s-12.8-9.6-14.3-17.4L143 401.4 39.7 380.5c-7.8-1.6-14.4-7-17.4-14.3s-2.2-15.8 2.2-22.5L82.7 256 24.5 168.2c-4.4-6.7-5.2-15.1-2.2-22.5s9.6-12.8 17.4-14.3L143 110.6 163.9 7.3c1.6-7.8 7-14.4 14.3-17.4zM207.6 256a80.4 80.4 0 1 1 160.8 0 80.4 80.4 0 1 1 -160.8 0zm208.8 0a128.4 128.4 0 1 0 -256.8 0 128.4 128.4 0 1 0 256.8 0z"]},ns={prefix:"fas",iconName:"square-poll-vertical",icon:[448,512,["poll"],"f681","M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm56 192c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zm184 88c0-13.3 10.7-24 24-24s24 10.7 24 24l0 48c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-48zM224 128c13.3 0 24 10.7 24 24l0 208c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-208c0-13.3 10.7-24 24-24z"]},is={prefix:"fas",iconName:"house",icon:[512,512,[127968,63498,63500,"home","home-alt","home-lg-alt"],"f015","M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z"]},os={prefix:"fas",iconName:"arrow-right",icon:[512,512,[8594],"f061","M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"]},ss={prefix:"fas",iconName:"xmark",icon:[384,512,[128473,10005,10006,10060,215,"close","multiply","remove","times"],"f00d","M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"]},ls={prefix:"fas",iconName:"moon",icon:[512,512,[127769,9214],"f186","M256 0C114.6 0 0 114.6 0 256S114.6 512 256 512c68.8 0 131.3-27.2 177.3-71.4 7.3-7 9.4-17.9 5.3-27.1s-13.7-14.9-23.8-14.1c-4.9 .4-9.8 .6-14.8 .6-101.6 0-184-82.4-184-184 0-72.1 41.5-134.6 102.1-164.8 9.1-4.5 14.3-14.3 13.1-24.4S322.6 8.5 312.7 6.3C294.4 2.2 275.4 0 256 0z"]},fs={prefix:"fas",iconName:"chevron-down",icon:[448,512,[],"f078","M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"]},us={prefix:"fas",iconName:"comment-dots",icon:[512,512,[128172,62075,"commenting"],"f4ad","M256 480c141.4 0 256-107.5 256-240S397.4 0 256 0 0 107.5 0 240c0 54.3 19.2 104.3 51.6 144.5L2.8 476.8c-4.8 9-3.3 20 3.6 27.5s17.8 9.8 27.1 5.8l118.4-50.7C183.7 472.6 218.9 480 256 480zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"]},cs={prefix:"fas",iconName:"star",icon:[576,512,[11088,61446],"f005","M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"]},ds={prefix:"fas",iconName:"arrow-left",icon:[512,512,[8592],"f060","M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"]},ms={prefix:"fas",iconName:"bars",icon:[448,512,["navicon"],"f0c9","M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"]},vs={prefix:"fas",iconName:"gamepad",icon:[640,512,[],"f11b","M448 64c106 0 192 86 192 192S554 448 448 448l-256 0C86 448 0 362 0 256S86 64 192 64l256 0zM192 176c-13.3 0-24 10.7-24 24l0 32-32 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l32 0 0 32c0 13.3 10.7 24 24 24s24-10.7 24-24l0-32 32 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-32 0 0-32c0-13.3-10.7-24-24-24zm240 96a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm64-96a32 32 0 1 0 0 64 32 32 0 1 0 0-64z"]},ps={prefix:"fas",iconName:"grip",icon:[512,512,[58119,"grid-horizontal","grip-horizontal"],"f58d","M88 96c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0zM280 224l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40zm192 0l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40zm0 192l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40zM280 288c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0zM88 416l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40z"]};export{Zo as F,br as a,ps as b,fs as c,ss as d,rs as e,is as f,ls as g,ms as h,ts as i,es as j,us as k,vs as l,ns as m,as as n,ds as o,cs as p,os as q,aa as r};
