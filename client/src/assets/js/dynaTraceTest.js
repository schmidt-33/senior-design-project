/*Copyright and licenses see https://www.dynatrace.com/company/trust-center/customers/reports/*/
(function(){if(typeof window!=="undefined"&&window.setTimeout){window.setTimeout=window.setTimeout;}var Promise=self.dT_&&dT_.prm&&dT_.prm()||self.Promise;(function(){function bb(){document.cookie="__dTCookie=1;SameSite=Lax";var Na=-1!==document.cookie.indexOf("__dTCookie");document.cookie="__dTCookie=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";return Na}function ib(){return void 0===ob.dialogArguments?navigator.cookieEnabled||bb():bb()}function fb(){var Na;if(ib()&&!window.dT_){var Wa=(Na={},Na.cfg="app=bba65dfacfe30f59|cors=1|rcdec=1209600000|featureHash=A27SVfgjqrtux|reportUrl=https://bf80140hcs.bf.dynatrace.com/bf|rdnt=1|uxrgce=1|srcss=1|bp=2|srmcrv=10|cuc=6r6n7yfb|mel=100000|dpvc=1|lastModification=1615923510051|dtVersion=10211210226114004|srmcrl=1|tp=500,50,0,1|uxdcw=1500|vs=2|featureHash=A27SVfgjqrtux|agentUri=https://js-cdn.dynatrace.com/jstag/16362cc0dec/ruxitagent_A27SVfgjqrtux_10211210226114004.js|auto=|domain=|rid=RID_|rpid=|app=bba65dfacfe30f59",Na.iCE=ib,Na);window.dT_=Wa}}var ob="undefined"!==typeof window?
window:self,Ua;ob.dT_?(null===(Ua=ob.console)||void 0===Ua?void 0:Ua.log("Duplicate agent injection detected, turning off redundant initConfig."),ob.dT_.di=1):fb()})();}).call(this);
(function(){if(typeof window!=="undefined"&&window.setTimeout){window.setTimeout=window.setTimeout;}var Promise=self.dT_&&dT_.prm&&dT_.prm()||self.Promise;(function(){function bb(){}function ib(p,z,I){void 0===I&&(I=0);var za=-1;z&&(null===p||void 0===p?0:p.indexOf)&&(za=p.indexOf(z,I));return za}function fb(){var p;return!(null===(p=ub.console)||void 0===p||!p.log)}function ob(p,z){if(!z)return"";var I=p+"=";p=ib(z,I);if(0>p)return"";for(;0<=p;){if(0===p||" "===z.charAt(p-1)||";"===z.charAt(p-1))return I=p+I.length,p=ib(z,";",p),0<=p?z.substring(I,p):z.substr(I);p=ib(z,I,p+I.length)}return""}function Ua(p){return ob(p,document.cookie)}function Na(){var p=
0;try{p=Math.round(ub.performance.timeOrigin)}catch(I){}if(0>=p||isNaN(p)||!isFinite(p)){p=ub.dT_;var z=0;try{z=ub.performance.timing.navigationStart}catch(I){}p=0>=z||isNaN(z)||!isFinite(z)?p.gAST():z}fg=p;zg=Wa;return fg}function Wa(){return fg}function ua(){return zg()}function Q(){var p,z=0;if(null===(p=null===ub||void 0===ub?void 0:ub.performance)||void 0===p?0:p.now)try{z=Math.round(ub.performance.now())}catch(I){}return 0>=z||isNaN(z)||!isFinite(z)?(new Date).getTime()-zg():z}function S(p,
z){void 0===z&&(z=document.cookie);return ob(p,z)}function Y(){}function W(p,z){return function(){p.apply(z,arguments)}}function P(p){if(!(this instanceof P))throw new TypeError("Promises must be constructed via new");if("function"!==typeof p)throw new TypeError("not a function");this.X=0;this.Za=!1;this.ba=void 0;this.ja=[];M(p,this)}function da(p,z){for(;3===p.X;)p=p.ba;0===p.X?p.ja.push(z):(p.Za=!0,P.V(function(){var I=1===p.X?z.Mc:z.Nc;if(null===I)(1===p.X?na:Pa)(z.Fa,p.ba);else{try{var za=I(p.ba)}catch(nb){Pa(z.Fa,
nb);return}na(z.Fa,za)}}))}function na(p,z){try{if(z===p)throw new TypeError("A promise cannot be resolved with itself.");if(z&&("object"===typeof z||"function"===typeof z)){var I=z.then;if(z instanceof P){p.X=3;p.ba=z;oa(p);return}if("function"===typeof I){M(W(I,z),p);return}}p.X=1;p.ba=z;oa(p)}catch(za){Pa(p,za)}}function Pa(p,z){p.X=2;p.ba=z;oa(p)}function oa(p){2===p.X&&0===p.ja.length&&P.V(function(){p.Za||P.oa(p.ba)});for(var z=0,I=p.ja.length;z<I;z++)da(p,p.ja[z]);p.ja=null}function ea(p,z,
I){this.Mc="function"===typeof p?p:null;this.Nc="function"===typeof z?z:null;this.Fa=I}function M(p,z){var I=!1;try{p(function(za){I||(I=!0,na(z,za))},function(za){I||(I=!0,Pa(z,za))})}catch(za){I||(I=!0,Pa(z,za))}}function D(){P.V=function(p){if("string"===typeof p)throw Error("Promise polyfill called _immediateFn with string");p()};P.oa=function(){};return P}function Aa(p,z,I,za){"undefined"===typeof za&&(za=ta(z,!0));"boolean"===typeof za&&(za=ta(z,za));if(p===ub)Ve?Ve(z,I,za):Ag&&Ag("on"+z,I);
else if(ii&&ub.dT_.iIO(p,21))ji.call(p,z,I,za);else if(p.addEventListener)if(p===ub.document||p===ub.document.documentElement)ki.call(p,z,I,za);else try{Ve.call(p,z,I,za)}catch(wa){p.addEventListener(z,I,za)}else p.attachEvent&&p.attachEvent("on"+z,I);za=!1;for(var nb=Pe.length;0<=--nb;){var Kb=Pe[nb];if(Kb.object===p&&Kb.event===z&&Kb.I===I){za=!0;break}}za||ub.dT_.apush(Pe,{object:p,event:z,I:I})}function fa(p,z,I,za){for(var nb=Pe.length;0<=--nb;){var Kb=Pe[nb];if(Kb.object===p&&Kb.event===z&&
Kb.I===I){Pe.splice(nb,1);break}}"undefined"===typeof za&&(za=ta(z,!0));"boolean"===typeof za&&(za=ta(z,za));p===ub?gg?gg(z,I,za):Ag&&Ag("on"+z,I):p.removeEventListener?p===ub.document||p===ub.document.documentElement?kj.call(p,z,I,za):gg.call(p,z,I,za):p.detachEvent&&p.detachEvent("on"+z,I)}function ta(p,z){var I=!1;try{var za=ub.dT_;if(Ve&&-1<za.aIOf(Nd,p)){var nb=Object.defineProperty({},"passive",{get:function(){I=!0}});Ve("test",bb,nb)}}catch(Kb){}return I?{passive:!0,capture:z}:z}function U(){for(var p=
Pe,z=p.length;0<=--z;){var I=p[z];fa(I.object,I.event,I.I)}Pe=[];ub.dT_.cx()}function sa(){return Bg?new Bg:nf?new nf("MSXML2.XMLHTTP.3.0"):ub.XMLHttpRequest?new ub.XMLHttpRequest:new ub.ActiveXObject("MSXML2.XMLHTTP.3.0")}function R(){nf=Bg=void 0}function Ja(){for(var p=0,z=0,I=arguments.length;z<I;z++)p+=arguments[z].length;p=Array(p);var za=0;for(z=0;z<I;z++)for(var nb=arguments[z],Kb=0,wa=nb.length;Kb<wa;Kb++,za++)p[za]=nb[Kb];return p}function Qa(p){return"function"===typeof p&&/{\s+\[native code]/.test(Function.prototype.toString.call(p))}
function Ab(p,z){for(var I,za=[],nb=2;nb<arguments.length;nb++)za[nb-2]=arguments[nb];return void 0!==Function.prototype.bind&&Qa(Function.prototype.bind)?(I=Function.prototype.bind).call.apply(I,Ja([p,z],za)):function(){for(var Kb=0;Kb<arguments.length;Kb++);return p.apply(z,(za||[]).concat(Array.prototype.slice.call(arguments)||[]))}}function xb(){if(Cg){var p=new Cg;if(We)for(var z=0,I=If;z<I.length;z++){var za=I[z];void 0!==We[za]&&(p[za]=Ab(We[za],p))}return p}return Cd?new Cd("MSXML2.XMLHTTP.3.0"):
ub.XMLHttpRequest?new ub.XMLHttpRequest:new ub.ActiveXObject("MSXML2.XMLHTTP.3.0")}function qb(p){-1<ub.dT_.io(p,"^")&&(p=p.split("^^").join("^"),p=p.split("^dq").join('"'),p=p.split("^rb").join(">"),p=p.split("^lb").join("<"),p=p.split("^p").join("|"),p=p.split("^e").join("="),p=p.split("^s").join(";"),p=p.split("^c").join(","),p=p.split("^bs").join("\\"));return p}function lb(){return ah}function Ha(p){ah=p}function Fa(p){var z=ub.dT_,I=z.scv("rid");z=z.scv("rpid");I&&(p.rid=I);z&&(p.rpid=z)}function X(p){if(p=
p.xb){p=qb(p);try{ah=new RegExp(p)}catch(z){}}else ah=void 0}function la(p){var z=p,I=Math.pow(2,32);return function(){z=(1664525*z+1013904223)%I;return z/I}}function G(p,z){return isNaN(p)||isNaN(z)?Math.floor(33*Dg()):Math.floor(Dg()*(z-p+1))+p}function ha(p,z){return parseInt(p,z||10)}function Z(p){return document.getElementsByTagName(p)}function L(p){var z=p.length;if("number"===typeof z)p=z;else{z=0;for(var I=2048;p[I-1];)z=I,I+=I;for(var za=7;1<I-z;)za=(I+z)/2,p[za-1]?z=za:I=za;p=p[za]?I:z}return p}
function rb(p){p=encodeURIComponent(p);var z=[];if(p)for(var I=0;I<p.length;I++){var za=p.charAt(I);Cb(z,bh[za]||za)}return z.join("")}function Ba(p){if(!p)return"";var z=ub.crypto||ub.msCrypto;if(z&&-1===ib(navigator.userAgent,"Googlebot"))z=z.getRandomValues(new Uint8Array(p));else{z=[];for(var I=0;I<p;I++)z.push(G(0,32))}p=[];for(I=0;I<z.length;I++){var za=Math.abs(z[I]%32);p.push(String.fromCharCode(za+(9>=za?48:55)))}return p.join("")}function $a(){return 0<=ub.dT_.io(navigator.userAgent,"RuxitSynthetic")}
function ka(p){var z={};p=p.split("|");for(var I=0;I<p.length;I++){var za=p[I].split("=");2===za.length&&(z[za[0]]=decodeURIComponent(za[1].replace(/\+/g," ")))}return z}function Ya(){var p=ia("csu");return(p.indexOf("dbg")===p.length-3?p.substr(0,p.length-3):p)+"_"+ia("app")+"_Store"}function K(p,z,I){z=z||{};var za=0;for(p=p.split("|");za<p.length;za++){var nb=p[za],Kb=nb,wa=ib(nb,"=");-1===wa?z[Kb]="1":(Kb=nb.substring(0,wa),z[Kb]=nb.substring(wa+1,nb.length))}!I&&(I=z,za=I.spc)&&(p=document.createElement("textarea"),
p.innerHTML=za,I.spc=p.value);return z}function Ka(p){var z;return null!==(z=uc[p])&&void 0!==z?z:ch[p]}function Ia(p){p=Ka(p);return"false"===p||"0"===p?!1:!!p}function H(p){var z=Ka(p);z=ha(z);isNaN(z)&&(z=ch[p]);return z}function ia(p){return String(Ka(p)||"")}function Ea(p,z){uc[p]=String(z)}function eb(p){uc=p;p=Eh;for(var z in p)p.hasOwnProperty(z)&&p[z]&&(uc[z]=p[z]);return uc}function vb(p){uc[p]=0>ib(uc[p],"#"+p.toUpperCase())?uc[p]:""}function vc(p){var z=p.agentUri;z&&-1<ib(z,"_")&&(z=
/([a-zA-Z]*)[0-9]{0,4}_([a-zA-Z_0-9]*)_[0-9]+/g.exec(z))&&z.length&&2<z.length&&(p.csu=z[1],p.featureHash=z[2])}function Qb(p){var z=p.domain||"";var I=(I=location.hostname)&&z?I===z||-1!==I.indexOf("."+z,I.length-("."+z).length):!0;if(!z||!I){p.domainOverride||(p.domainOverride=location.hostname+","+z,delete p.domain);var za=Bb();za&&(p.domain=za);I||Cb(Jf,{type:"dpi",severity:"Warning",text:'Configured domain "'+z+'" is invalid for current location "'+location.hostname+'". Agent will use "'+p.domain+
'" instead.'})}}function Vb(p,z){Qb(p);uc.pVO&&(p.pVO=uc.pVO);z||(z=p.bp||ch.bp,p.bp2&&(z=2),p.bp=String(z))}function mc(){return uc}function gc(p){return ch[p]===Ka(p)}function Ca(){var p=ub.dT_;return!p.bcv("coo")||p.bcv("cooO")||p.iSM()}function Oa(p,z){if(Ca()&&(!Bc().overloadPrevention||$a()))return p.apply(this,z||[])}function F(p,z){try{var I=Dd;I&&I.setItem(p,z)}catch(za){}}function ma(p,z){Oa(F,[p,z])}function ba(p){try{var z=Dd;if(z)return z.getItem(p)}catch(I){}return null}function Ta(p){try{var z=
Dd;z&&z.removeItem(p)}catch(I){}}function La(p){document.cookie=p+'="";path=/'+(ia("domain")?";domain="+ia("domain"):"")+"; expires=Thu, 01 Jan 1970 00:00:01 GMT;"}function Va(p,z,I){var za=1,nb=0;do document.cookie=p+'=""'+(z?";domain="+z:"")+";path="+I.substr(0,za)+"; expires=Thu, 01 Jan 1970 00:00:01 GMT;",za=I.indexOf("/",za),nb++;while(-1!==za&&5>nb)}function Bb(){var p=document.domain||"";if(!p)return"";p=p.split(".").reverse();var z=p.length;if(1>=z)return"";for(var I=p[0],za="",nb=1;nb<=z;nb++)if(Ua("dTValidationCookie")){za=
I;break}else{p[nb]&&(I=p[nb]+"."+I);var Kb="dTValidationCookie=dTValidationCookieValue;path=/;domain="+I;Kb+=Hb();document.cookie=Kb}Va("dTValidationCookie",za,"/");return za}function Xa(p,z,I,za){dh=!0;z||0===z?(z=String(z).replace(/[;\n\r]/g,"_"),p=p+"="+z+";path=/"+(ia("domain")?";domain="+ia("domain"):""),I&&(p+=";expires="+I.toUTCString()),p+=Hb(),za&&"https:"===location.protocol&&(p+=";Secure"),document.cookie=p):La(p);dh=!1}function Hb(){var p=ia("cssm");return"n"===p||"s"===p||"l"===p?";SameSite="+
Fh[p]:""}function qa(p,z,I,za){Oa(Xa,[p,z,I,za])}function Da(p){return 2<(null===p||void 0===p?void 0:p.split("$").length)?!1:/^[0-9A-Za-z_=:\$\+\/\.\-\*%\|]*$/.test(p)}function db(){var p=Ua("dtCookie");p||((p=ba("dtCookie"))&&Da(p)?pb(p):p="");return Da(p)?p:""}function pb(p){qa("dtCookie",p,void 0,Ia("ssc"))}function Fb(p){return 32===p.length||12>=p.length?p:""}function Ib(p){p=p.replace("-2D","-");if(!isNaN(Number(p))){var z=ha(p);if(-99<=z&&99>=z)return p}return""}function Zb(p){var z={sessionId:"",
ob:"",Ea:0},I=ib(p,"|"),za=p;-1!==I&&(za=p.substring(0,I));I=ib(za,"$");-1!==I?(z.sessionId=Fb(za.substring(I+1)),z.ob=Ib(za.substring(0,I))):z.sessionId=Fb(za);return z}function kc(p){var z={sessionId:"",ob:"",Ea:0};p=p.split("v"===p.charAt(0)?"_":"=");if(2<p.length&&0===p.length%2){var I=Number(p[1]);if(isNaN(I)||3>I)return z;I={};for(var za=2;za<p.length;za++)I[p[za]]=p[za+1],za++;I.sn?z.sessionId=Fb(I.sn):z.sessionId="hybrid";I.srv&&(z.ob=Ib(I.srv));p=Number(I.ol);1===p&&(I=$a(),za=Bc(),I||(ma("dtDisabled",
"true"),za.disabled=!0,za.overloadPrevention=!0));0<=p&&2>=p&&(z.Ea=p)}return z}function hc(){try{Eg.apply(ub.parent,arguments)}catch(p){}}function Dc(){try{lj.apply(ub.top,arguments)}catch(p){}}function ad(p){var z=Array.prototype.slice.call(arguments,1);try{Xe.apply(p,z)}catch(I){}}function jd(p){var z=Array.prototype.slice.call(arguments,1);try{of.apply(p,z)}catch(I){}}function zc(){var p=ub.dT_;Promise=D();Bg=ub.XMLHttpRequest;nf=ub.ActiveXObject;var z;Cg=ub.XMLHttpRequest;Cd=ub.ActiveXObject;
var I=null===(z=ub.XMLHttpRequest)||void 0===z?void 0:z.prototype;if(I){We={};z=0;for(var za=If;z<za.length;z++){var nb=za[z];void 0!==I[nb]&&(We[nb]=I[nb])}}Ve=ub.addEventListener;gg=ub.removeEventListener;ki=ub.document.addEventListener;kj=ub.document.removeEventListener;hg=ub.setTimeout;Gh=ub.setInterval;ig||(Fg=ub.clearTimeout,Hh=ub.clearInterval);p=p.iCE?p.iCE():navigator.cookieEnabled;I=1===kc(S("dtAdkSettings")).Ea;fb();if(p){if(I||!("complete"!==document.readyState||ub.performance&&ub.performance.timing))return!1}else return!1;
return!0}function Ac(){return Ed()}function Ec(p,z){function I(){delete jg[Kb];p.apply(this,arguments)}for(var za=[],nb=2;nb<arguments.length;nb++)za[nb-2]=arguments[nb];if("apply"in hg){za.unshift(I,z);var Kb=hg.apply(ub,za)}else Kb=hg(I,z);jg[Kb]=!0;return Kb}function Lc(p){delete jg[p];"apply"in Fg?Fg.call(ub,p):Fg(p)}function Cb(p){for(var z=[],I=1;I<arguments.length;I++)z[I-1]=arguments[I];p.push.apply(p,z)}function Fd(p){Cb(pf,p)}function ud(p){for(var z=pf.length;z--;)if(pf[z]===p){pf.splice(z,
1);break}}function ic(){return pf}function Nb(p,z){return Gh(p,z)}function md(p){Hh(p)}function $b(p,z){if(!Kf||!eh)return"";p=new Kf([p],{type:z});return eh(p)}function Db(p,z){return Ih?new Ih(p,z):void 0}function Zc(p){"function"===typeof p&&Cb(ce,p)}function Ce(){return ce}function ed(){return fh}function Wd(p){return function(){for(var z=[],I=0;I<arguments.length;I++)z[I]=arguments[I];if("number"!==typeof z[0]||!jg[z[0]])try{return p.apply(this,z)}catch(za){return p(z[0])}}}function Qe(){return Jf}
function Hc(){zg=Na;ub.performance&&(Ed=function(){return Math.round(zg()+Q())});if(!Ed||isNaN(Ed())||0>=Ed()||!isFinite(Ed()))Ed=function(){return(new Date).getTime()}}function Sc(){ig&&(ub.clearTimeout=Fg,ub.clearInterval=Hh,ig=!1)}function Gd(p){if(p=p||db()){var z=p.charAt(0);return"v"===z||"="===z?kc(p):Zb(p)}return{sessionId:"",ob:"",Ea:0}}function kd(p){return Gd(p).ob}function Ye(p){return Gd(p).sessionId}function ld(){return Lf}function Xd(){t(function(){Ye()||pb(-1*G(2,21)+"$"+Ba(32));Lf=
kd()||""})}function pd(){return kg}function Hd(){var p=document.cookie,z=H("vs"),I=rc(p);2<=z&&-1===I?I=0:1===z&&-1<I&&(I=-1);Yd(Zd(!0,p),void 0,I,p)}function qd(p,z){var I=document.cookie;z=Zd(z,I);for(var za=!1,nb=0;nb<z.length;nb++){var Kb=z[nb];Kb.frameId===kg&&(Kb.H=p,za=!0)}za||Cb(z,{frameId:kg,H:p,Db:-1,visitId:""});Yd(z,void 0,void 0,I)}function Yd(p,z,I,za){var nb=H("pcl");nb=p.length-nb;0<nb&&p.splice(0,nb);if(p){nb=[];for(var Kb=0;Kb<p.length;Kb++)if("-"!==p[Kb].H){0<Kb&&0<nb.length&&Cb(nb,
"p");var wa=Lf;wa&&(Cb(nb,wa),Cb(nb,"$"));Cb(nb,p[Kb].frameId);Cb(nb,"h");Cb(nb,String(p[Kb].H))}nb.length||(Gg&&(Id(!0,"a",!1,za),yb(!1)),Lf=kd()||"",Cb(nb,Lf),Cb(nb,"$"),Cb(nb,kg),Cb(nb,"h-"));p=z||Od(za);Cb(nb,"v");Cb(nb,p);p=null!==I&&void 0!==I?I:rc(za);0<=p&&(Cb(nb,"e"),Cb(nb,String(p)));p=nb.join("")}else p="";p||(Gg&&(Id(!0,"a",!1,za),yb(!1)),Lf=kd()||"",I=null!==I&&void 0!==I?I:rc(za),p=Lf+"$"+kg+"h-v"+(z||Od(za)+(0<=I?"e"+I:"")));qa("dtPC",p||"-",void 0,Ia("ssc"))}function Zd(p,z){void 0===
z&&(z=document.cookie);var I=S("dtPC",z);z=[];if(I&&"-"!==I){var za=I.split("p");var nb="";var Kb=null;for(I=0;I<za.length;I++){var wa=za[I],yc=p;var Tc=ib(wa,"$");var $d=ib(wa,"h"),yd=ib(wa,"v"),Pd=ib(wa,"e");Tc=wa.substring(Tc+1,$d);$d=-1!==yd?wa.substring($d+1,yd):wa.substring($d+1);nb=nb||-1!==yd?-1!==Pd?wa.substring(yd+1,Pd):wa.substring(yd+1):"";Kb=Kb||-1!==Pd?wa.substring(Pd+1):null;wa=null;yc||(yc=ha(Tc.split("_")[0]),yd=Ed()%gh,yd<yc&&(yd+=gh),yc=yc+9E5>yd);yc&&(wa={frameId:Tc,H:"-"===$d?
"-":ha($d),Db:-1,visitId:""});(Tc=wa)&&z.push(Tc)}for(I=0;I<z.length;I++){z[I].visitId=nb;p=z[I];za=ha(Kb||"");isNaN(za)&&(za=ha(ba(Mf)||""));if(isNaN(za)||-1>za||za>H("mel"))za=2<=H("vs")?0:-1;p.Db=za}}return z}function nd(p,z){try{ub.localStorage&&ub.localStorage.setItem(p,z)}catch(I){}}function Re(p){try{if(ub.localStorage)return ub.localStorage.getItem(p)}catch(z){}return null}function Mc(p){try{ub.localStorage&&ub.localStorage.removeItem(p)}catch(z){}}function Od(p){return Jd(p)||Id(!0,"c",!1,
p)}function Jd(p){if(Za(p)<=Ed())return Id(!0,"t",!1,p);var z=rd(p);if(!z)return Id(!0,"c",!1,p);var I=hh.exec(z);if(!I||3!==I.length||32!==I[1].length||isNaN(ha(I[2])))return Id(!0,"i",!1,p);ma(De,z);return z}function Qd(p,z){var I=Ed();z=Ra(z).wc;p&&(z=I);N(I+Ee+"|"+z);w()}function rd(p){var z,I;return null!==(I=null===(z=Zd(!0,p)[0])||void 0===z?void 0:z.visitId)&&void 0!==I?I:ba(De)}function de(p,z){if(p&&(p=rd(z))&&(p=hh.exec(p))&&3===p.length&&isFinite(Number(p[2])))return p[1]+"-"+(Number(p[2])+
1);p=Ba(32);p=p.replace(/[0-9]/g,function(I){I=.1*ha(I);return String.fromCharCode(Math.floor(25*I+65))});return p+"-0"}function se(p,z){var I=Zd(!1,z),za=2<=H("vs")?0:-1;Yd(I,p,za,z);ma(De,p);ma(Mf,String(za));Qd(!0)}function ae(p,z,I,za){return Id(z,I,za)}function je(p,z,I,za){return Id(p,z,I,za)}function Id(p,z,I,za){p&&(Nf=!0);p=rd(za);I=de(I);se(I);for(za=0;za<te.length;za++)te[za](I,Nf,z,p);return I}function Fe(p){te.push(p)}function w(p){ec&&Lc(ec);ec=Ec(C,Za(p)-Ed())}function C(){var p=document.cookie;
if(Za(p)<=Ed()&&Ca()){var z="t"+(Ed()-Za(p)),I=rd(p),za=de(!1,p);se(za,p);for(p=0;p<te.length;p++)te[p](za,Nf,z,I);return!0}t(w);return!1}function N(p){qa("rxvt",p,void 0,Ia("ssc"));ma("rxvt",p)}function pa(p,z){(z=S(p,z))||(z=ba(p)||"");return z}function va(){var p=Jd()||"";ma(De,p);p=pa("rxvt");N(p);v()}function Ra(p){var z={Bd:0,wc:0};if(p=pa("rxvt",p))try{var I=p.split("|");2===I.length&&(z.Bd=parseInt(I[0],10),z.wc=parseInt(I[1],10))}catch(za){}return z}function Za(p){p=Ra(p);return Math.min(p.Bd,
p.wc+Ze)}function hb(p){Ee=p}function yb(p){void 0===p&&(p=!0);Gg=p}function wb(){var p=Nf;Nf=!1;return p}function Lb(){C()||Qd(!1)}function tc(){var p,z;if(-1!==rc(void 0)&&2<=H("vs")){var I=rc();I>=H("mel")?Id(!1,"e"+I,!0):(I++,Yd(Zd(!1),"",I),ma(Mf,String(I)),null===(z=null===(p=ub.MobileAgent)||void 0===p?void 0:p.incrementActionCount)||void 0===z?void 0:z.call(p))}}function rc(p){p=Zd(!0,p);if(1<=p.length&&!isNaN(p[0].Db))return p[0].Db;p=ba(Mf)||"";p=ha(p);return isNaN(p)?2<=H("vs")?0:-1:p}
function v(){Mc(Mf);Mc(De);Mc("rxvt")}function t(p){Ca()?p():(Rd||(Rd=[]),Cb(Rd,p))}function u(p){return Oa(p)}function B(){if(Ia("coo")&&!Ca()){for(var p=0;p<Rd.length;p++)Ec(Rd[p],0);Rd=[];Ea("cooO",!0)}}function J(){if(Ia("coo")&&Ca()){Ea("cooO",!1);La("dtCookie");La("dtPC");La("dtLatC");La("dtSa");La("dtAdk");La("rxVisitor");La("rxvt");try{Ta(Mf);Ta(De);Ta("rxvt");v();var p=Dd;p&&(p.removeItem("rxVisitor"),p.removeItem("dtCookie"));(p=Hg)&&p.removeItem(Ya())}catch(z){}}}function xa(p){return document.cookie?
document.cookie.split(p+"=").length-1:0}function Sa(p){var z=xa(p);if(1<z){var I=ia("domain")||ub.location.hostname,za=ub.location.hostname,nb=ub.location.pathname,Kb=0,wa=0;$e.push(p);do{var yc=za.substr(Kb);if(yc!==I||"/"!==nb){Va(p,yc===I?"":yc,nb);var Tc=xa(p);Tc<z&&($e.push(yc),z=Tc)}Kb=za.indexOf(".",Kb)+1;wa++}while(0!==Kb&&10>wa&&1<z);ia("domain")&&1<z&&Va(p,"",nb)}}function kb(){Sa("dtPC");Sa("dtCookie");Sa("dtLatC");Sa("rxvt");0<$e.length&&Cb(Jf,{severity:"Error",type:"dcn",text:"Duplicate cookie name"+
(1!==$e.length?"s":"")+" detected: "+$e.join(", ")});Fd(function(p,z,I,za){0<$e.length&&!z&&(p.av(za,"dCN",$e.join(",")),$e=[]);0<ke.length&&!z&&(p.av(za,"eCC",ke.join(",")),ke=[])})}function zb(p,z){if(!p||!p.length)return-1;if(p.indexOf)return p.indexOf(z);for(var I=p.length;I--;)if(p[I]===z)return I;return-1}function sb(p){p&&(null===p||void 0===p?0:p.configurable)&&p.set&&p.get&&Object.defineProperty(document,"cookie",{get:function(){return p.get.call(document)},set:function(z){var I=z.split("=")[0];
p.set.call(document,z);dh?1<xa(I)&&$e.push(I):-1<zb(Ig,I)&&(ke.push(I),-1===zb(le,I)&&(Cb(le,I),Cb(Jf,{severity:"Error",type:"ecm",text:"Invalid modification of agent cookie "+I+" detected. Modifying Dynatrace cookies may result in missing or invalid data."})))}})}function Eb(){var p=Ua("rxVisitor");p&&45===(null===p||void 0===p?void 0:p.length)||(p=Re("rxVisitor")||ba("rxVisitor"),45!==(null===p||void 0===p?void 0:p.length)&&(li=!0,p=String(Ed()),p+=Ba(45-p.length)));Ic(p);return p}function Ic(p){if(Ia("dpvc")||
Ia("pVO"))ma("rxVisitor",p);else{var z=new Date;z.setFullYear(z.getFullYear()+2);Oa(nd,["rxVisitor",p])}qa("rxVisitor",p,z,Ia("ssc"))}function vd(){return li}function nc(p){var z=Ua("rxVisitor");La("rxVisitor");Ta("rxVisitor");Mc("rxVisitor");Ea("pVO",!0);Ic(z);p&&Oa(nd,["dt-pVO","1"]);va()}function cc(){Mc("dt-pVO");Ia("pVO")&&(Ea("pVO",!1),Eb());Ta("rxVisitor");va()}function Gb(p,z,I,za,nb){var Kb=document.createElement("script");Kb.setAttribute("src",p);z&&Kb.setAttribute("defer","defer");I&&(Kb.onload=
I);za&&(Kb.onerror=za);nb&&Kb.setAttribute("id",nb);Kb.setAttribute("crossorigin","anonymous");p=document.getElementsByTagName("script")[0];p.parentElement.insertBefore(Kb,p)}function jc(p,z){return fc+"/"+(z||qf)+"_"+p+"_"+(H("buildNumber")||Bc().version)+".js"}function bd(p,z){void 0===z&&(z=[]);if(!p||"object"!==typeof p&&"function"!==typeof p)return!1;var I="number"!==typeof z?z:[],za=null,nb=[];switch("number"===typeof z?z:5){case 0:za="Array";nb=["push"];break;case 1:za="Boolean";break;case 2:za=
"Number";break;case 3:za="String";break;case 4:za="Function";break;case 5:za="Object";break;case 6:za="Date";nb=["getTime"];break;case 7:za="Error";nb=["name","message"];break;case 8:za="Element";break;case 9:za="HTMLElement";break;case 10:za="HTMLImageElement";nb=["complete"];break;case 11:za="PerformanceEntry";break;case 12:za="PerformanceTiming";break;case 13:za="PerformanceResourceTiming";break;case 14:za="PerformanceNavigationTiming";break;case 15:za="CSSRule";nb=["cssText","parentStyleSheet"];
break;case 16:za="CSSStyleSheet";nb=["cssRules","insertRule"];break;case 17:za="Request";nb=["url"];break;case 18:za="Response";nb=["ok","status","statusText"];break;case 19:za="Set";nb=["add","entries","forEach"];break;case 20:za="Map";nb=["set","entries","forEach"];break;case 21:za="Worker";nb=["addEventListener","postMessage","terminate"];break;case 22:za="XMLHttpRequest",nb=["open","send","setRequestHeader"]}z=za;if(!z)return!1;nb=nb.length?nb:I;try{var Kb=!!ub[z]&&p instanceof ub[z],wa=Object.prototype.toString.call(p);
if(!I.length&&(Kb||wa==="[object "+z+"]"))return!0}catch(yc){}for(I=0;I<nb.length;I++)if(Kb=nb[I],"string"!==typeof Kb&&"number"!==typeof Kb&&"symbol"!==typeof Kb||!(Kb in p))return!1;return!!nb.length}function Nc(){var p,z=ub.dT_;ub.dT_=(p={},p.di=0,p.version="10211210226114004",p.cfg=z?z.cfg:"",p.iCE=z?z.iCE:function(){return navigator.cookieEnabled},p.ica=1,p.disabled=!1,p.overloadPrevention=!1,p.gx=sa,p.cx=R,p.mp=hc,p.mtp=Dc,p.mi=ad,p.mw=jd,p.gAST=ed,p.ww=Db,p.stu=$b,p.nw=Ac,p.apush=Cb,p.st=Ec,p.si=Nb,
p.aBPSL=Fd,p.rBPSL=ud,p.gBPSL=ic,p.aBPSCC=Zc,p.gBPSCC=Ce,p.buildType="dynatrace",p.gSSV=ba,p.sSSV=ma,p.rSSV=Ta,p.rvl=Mc,p.pn=ha,p.iVSC=Da,p.p3SC=kc,p.pLSC=Zb,p.io=ib,p.dC=La,p.sC=qa,p.esc=rb,p.gSId=kd,p.gDtc=Ye,p.gSC=db,p.sSC=pb,p.gC=Ua,p.cRN=G,p.cRS=Ba,p.gEL=L,p.gEBTN=Z,p.cfgO=mc,p.pCfg=ka,p.pCSAA=K,p.cFHFAU=vc,p.sCD=Vb,p.bcv=Ia,p.ncv=H,p.scv=ia,p.stcv=Ea,p.rplC=eb,p.cLSCK=Ya,p.gFId=pd,p.gBAU=jc,p.iS=Gb,p.eWE=t,p.oEIE=u,p.oEIEWA=Oa,p.eA=B,p.dA=J,p.gcSId=ld,p.iNV=vd,p.gVID=Eb,p.dPV=nc,p.ePV=cc,p.sVIdUP=
yb,p.sVTT=hb,p.sVID=se,p.rVID=Jd,p.gVI=Od,p.gNVIdN=je,p.gNVId=ae,p.gARnVF=wb,p.cAUV=Lb,p.uVT=Qd,p.aNVL=Fe,p.gPC=Zd,p.cPC=qd,p.sPC=Yd,p.clB=Sc,p.ct=Lc,p.aRI=Fa,p.iXB=X,p.gXBR=lb,p.sXBR=Ha,p.de=qb,p.cCL=fb,p.gEC=rc,p.iEC=tc,p.rnw=Q,p.gto=ua,p.ael=Aa,p.rel=fa,p.sup=ta,p.cuel=U,p.iAEPOO=Ca,p.iSM=$a,p.aIOf=zb,p.gxwp=xb,p.iIO=bd,p.prm=D,p.cI=md,p.gidi=Qe,p.iDCV=gc,p.gCF=S,p)}function Jc(){try{if(!zc())return!1;Nc();try{Hg=ub.localStorage,Dd=ub.sessionStorage}catch(rf){}Hc();fh=Ed();pf=[];Jf=[];jg={};ig||
(ub.clearTimeout=Wd(Fg),ub.clearInterval=Wd(Hh),ig=!0);var p=Math.random(),z=Math.random();zd=0!==p&&0!==z&&p!==z;if(-1!==ib(navigator.userAgent,"Googlebot")){var I=performance.getEntriesByType("navigation")[0];p=1;if(I){for(var za in I)if("number"===typeof I[za]&&I[za]){var nb=I[za];p=1===p?nb:p+nb}var Kb=Math.floor(1E4*p)}else Kb=p;Dg=la(Kb)}else zd?Dg=Math.random:Dg=la(Ed());kg=fh%gh+"_"+ha(G(0,1E3)+"");var wa;ch=(wa={},wa.ade="",wa.aew=!0,wa.agentLocation="",wa.agentUri="",wa.uana="data-dtname,data-dtName",
wa.app="",wa.async=!1,wa.ase=!1,wa.auto=!1,wa.bp1=!1,wa.bp2=!1,wa.bp=1,wa.bs=!1,wa.buildNumber=0,wa.csprv=!0,wa.cepl=16E3,wa.cls=!0,wa.ccNcss=!1,wa.cg=!1,wa.coo=!1,wa.cooO=!1,wa.cssm="0",wa.cors=!1,wa.csu="",wa.cuc="",wa.cux=!1,wa.dataDtConfig="",wa.debugName="",wa.dvl=500,wa.dASXH=!1,wa.disableCookieManager=!1,wa.disableLogging=!1,wa.dmo=!1,wa.doel=!1,wa.dpch=!1,wa.dpvc=!1,wa.disableXhrFailures=!1,wa.domain="",wa.domainOverride="",wa.doNotDetect="",wa.ds=!0,wa.dsndb=!1,wa.dsss=!1,wa.dssv=!0,wa.eni=
!0,wa.euf=!1,wa.evl="",wa.extblacklist="",wa.exteventsoff=!1,wa.fau=!0,wa.fa=!1,wa.featureHash="",wa.ffi=!1,wa.hvt=216E5,wa.lastModification=0,wa.lupr=!0,wa.imm=!1,wa.iqvn=!1,wa.initializedModules="",wa.ign="",wa.instr="",wa.iub="",wa.lab=!1,wa.legacy=!1,wa.lt=!0,wa.lzwd=!1,wa.lzwe=!1,wa.mb="",wa.md="",wa.mdp="",wa.mdl="",wa.mdn=5E3,wa.bismepl=2E3,wa.mel=200,wa.mepp=10,wa.moa=30,wa.mrt=3,wa.mpl=1024,wa.mmds=2E4,wa.msl=3E4,wa.mhl=4E3,wa.ncw=!1,wa.ntd=!1,wa.oat=180,wa.ote=!1,wa.owasp=!1,wa.perfbv=1,
wa.prfSmpl=0,wa.pcl=20,wa.pt=!0,wa.pui=!1,wa.pVO=!1,wa.raxeh=!0,wa.rdnt=0,wa.reportUrl="dynaTraceMonitor",wa.restoreTimeline=!1,wa.rid="",wa.ridPath="",wa.rpid="",wa.rcdec=12096E5,wa.rt=1E4,wa.rtl=0,wa.rtp=2,wa.rtt=1E3,wa.rtu=200,wa.rx_visitID="",wa.sl=100,wa.spc="",wa.srbbv=1,wa.srbw=!0,wa.srad=!0,wa.srmr=100,wa.srms="1,1,,,",wa.srsr=1E5,wa.srtbv=3,wa.srtd=1,wa.srtr=500,wa.srvr="",wa.srvi=0,wa.srwo=!1,wa.srre="",wa.ssc=!1,wa.st=3E3,wa.svNB=!1,wa.syntheticConfig=!1,wa.tal=0,wa.tp="500,50,3",wa.tt=
100,wa.tvc=3E3,wa.uam=!1,wa.uxdce=!1,wa.uxdcw=1500,wa.uxrgce=!0,wa.uxrgcm="100,25,300,3;100,25,300,3",wa.usrvd=!0,wa.vcfi=!0,wa.vcit=1E3,wa.vct=50,wa.vcx=50,wa.vs=1,wa.xb="",wa.chw="",wa.xt=0,wa.srcss=!1,wa.srmcrl=1,wa.srmcrv=10,wa.nosr=!1,wa.bisaoi=!1,wa.bisCmE="",wa.mcepsl=100,wa.erjdw=!0,wa.fvdi=!1,wa.srif=!1,wa.srmt=!0,wa.vscl=0,wa.dsa=!1,wa.exp=!1,wa.vrt=!1,wa.peti=!1,wa);a:{var yc=Bc().cfg;uc={reportUrl:"dynaTraceMonitor",initializedModules:"",csu:"dtagent",dataDtConfig:"string"===typeof yc?
yc:""};Bc().cfg=uc;uc.csu="ruxitagentjs";var Tc=uc.dataDtConfig;Tc&&-1===ib(Tc,"#CONFIGSTRING")&&(K(Tc,uc),vb("domain"),vb("auto"),vb("app"),vc(uc));var $d=Z("script"),yd=L($d),Pd=-1===ib(uc.dataDtConfig||"","#CONFIGSTRING")?uc:null;if(0<yd)for(Kb=0;Kb<yd;Kb++)b:{I=void 0;var mi=$d[Kb];za=Pd;if(mi.attributes){var af=uc.csu+"_bootstrap.js";nb=/.*\/jstag\/.*\/.*\/(.*)_bs(_dbg)?.js$/;wa=za;var Ob=mi.src,Of=null===Ob||void 0===Ob?void 0:Ob.indexOf(af),mj=mi.attributes.getNamedItem("data-dtconfig");if(mj){yc=
void 0;Tc=Ob;var ee=mj.value;p={};uc.legacy="1";z=/([a-zA-Z]*)_([a-zA-Z_0-9]*)_([0-9]+)/g;Tc&&(yc=z.exec(Tc),null===yc||void 0===yc?0:yc.length)&&(p.csu=yc[1],p.featureHash=yc[2],p.agentLocation=Tc.substr(0,ib(Tc,yc[1])-1),p.buildNumber=yc[3]);if(ee){K(ee,p,!0);var sf=p.agentUri;!Tc&&sf&&(yc=z.exec(sf),null===yc||void 0===yc?0:yc.length)&&(p.csu=yc[1])}Qb(p);I=p;if(!za)wa=I;else if(!I.syntheticConfig){Pd=I;break b}}I||(I=uc);if(0<Of){var ue=Of+af.length+5;I.app=Ob.length>ue?Ob.substr(ue):"Default%20Application"}else if(Ob){var Ge=
nb.exec(Ob);Ge&&(I.app=Ge[1])}Pd=wa}else Pd=za}if(Pd)for(var ih in Pd)Pd.hasOwnProperty(ih)&&($d=ih,uc[$d]=Pd[$d]);if(uc.rx_visitID){var ve=uc.rx_visitID;ve&&(Bc().rx_visitID=ve)}var He=Ya();try{var Ie=(Pd=Hg)&&Pd.getItem(He);if(Ie){var lg=ka(Ie),Je=K(lg.config||""),tf=uc.lastModification||"0",Ad=ha((Je.lastModification||lg.lastModification||"0").substr(0,13)),Se="string"===typeof tf?ha(tf.substr(0,13)):tf;if(!tf||Ad>=Se)if(Je.csu=lg.name,Je.featureHash=lg.featureHash,Je.agentUri&&vc(Je),Vb(Je,!0),
X(Je),Fa(Je),Ad>(uc.lastModification||0)){var Jg=uc.auto,Kg=uc.legacy;uc=eb(Je);uc.auto=Jg;uc.legacy=Kg}}}catch(rf){}Vb(uc);try{var Lg=uc.ign;if(Lg&&(new RegExp(Lg)).test(ub.location.href)){document.dT_=ub.dT_=void 0;var me=!1;break a}}catch(rf){}if($a()){var Kd=navigator.userAgent,ni=ib(Kd,"RuxitSynthetic")+14+5,oi=Kd.substring(ni);if(-1!==ib(oi," c")){var Jh=oi.split(" ");for(He=0;He<Jh.length;He++){var Uc=Jh[He];if("c"===Uc.charAt(0)){var mg=Uc.substr(1),jh=mg.indexOf("="),uf=mg.substring(0,jh),
fe=mg.substring(jh+1);uf&&fe&&(Eh[uf]=fe)}}}eb(uc)}me=!0}if(!me)return!1;kb();try{xd=Bc().disabled||!!ba("dtDisabled")}catch(rf){}var we;if(!(we=ia("agentLocation")))a:{var pi=ia("agentUri");if(pi||document.currentScript){var Ke=pi||document.currentScript.src;if(Ke){me=Ke;var Te=-1===ib(me,"_bs")&&-1===ib(me,"_bootstrap")&&-1===ib(me,"_complete")?1:2,vf=Ke.lastIndexOf("/");for(me=0;me<Te&&-1!==vf;me++)Ke=Ke.substr(0,vf),vf=Ke.lastIndexOf("/");we=Ke;break a}}var Kh=location.pathname;we=Kh.substr(0,
Kh.lastIndexOf("/"))}fc=we;qf=ia("csu")||"ruxitagentjs";"true"===Ua("dtUseDebugAgent")&&0>qf.indexOf("dbg")&&(qf=ia("debugName")||qf+"dbg");if(!Ia("auto")&&!Ia("legacy")&&!xd){var Pf=ia("agentUri")||jc(ia("featureHash")),ng;if(!(ng=Ia("async")||"complete"===document.readyState)){var Mg=ub.navigator.userAgent,Ng=Mg.indexOf("MSIE ");ng=0<Ng?9>=parseInt(Mg.substring(Ng+5,Mg.indexOf(".",Ng)),10):!1}ng?Gb(Pf,Ia("async"),void 0,void 0,"dtjsagent"):(document.write('<script id="dtjsagentdw" type="text/javascript" src="'+
Pf+'">\x3c/script>'),document.getElementById("dtjsagentdw")||Gb(Pf,Ia("async"),void 0,void 0,"dtjsagent"))}Ua("dtCookie")&&Ea("cooO",!0);Xd();Ea("pVO",!!Re("dt-pVO"));t(Eb);Ee=18E5;Ze=H("hvt")||216E5;Oa(Hd);Oa(qd,[1]);le=[];Ig="dtCookie dtLatC rxvt dtAdk dtAdkSettings dtPC".split(" ");if(Ia("cg"))try{sb(Object.getOwnPropertyDescriptor(Document.prototype,"cookie")||Object.getOwnPropertyDescriptor(HTMLDocument.prototype,"cookie"))}catch(rf){}}catch(rf){return!1}return!0}function Bc(){return ub.dT_}
var ub="undefined"!==typeof window?window:self,fg,zg,kh=setTimeout;P.prototype["catch"]=function(p){return this.then(null,p)};P.prototype.then=function(p,z){var I=new this.constructor(Y);da(this,new ea(p,z,I));return I};P.prototype["finally"]=function(p){var z=this.constructor;return this.then(function(I){return z.resolve(p()).then(function(){return I})},function(I){return z.resolve(p()).then(function(){return z.reject(I)})})};P.all=function(p){return new P(function(z,I){function za(yc,Tc){try{if(Tc&&
("object"===typeof Tc||"function"===typeof Tc)){var $d=Tc.then;if("function"===typeof $d){$d.call(Tc,function(yd){za(yc,yd)},I);return}}nb[yc]=Tc;0===--Kb&&z(nb)}catch(yd){I(yd)}}if(!p||"undefined"===typeof p.length)throw new TypeError("Promise.all accepts an array");var nb=Array.prototype.slice.call(p);if(0===nb.length)return z([]);for(var Kb=nb.length,wa=0;wa<nb.length;wa++)za(wa,nb[wa])})};P.resolve=function(p){return p&&"object"===typeof p&&p.constructor===P?p:new P(function(z){z(p)})};P.reject=
function(p){return new P(function(z,I){I(p)})};P.race=function(p){return new P(function(z,I){for(var za=0,nb=p.length;za<nb;za++)p[za].then(z,I)})};P.V="function"===typeof setImmediate&&function(p){setImmediate(p)}||function(p){kh(p,0)};P.oa=function(p){"undefined"!==typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",p)};var Ve,gg,ki,kj,Ag=ub.attachEvent,ii=ub.Worker,ji=ii&&ii.prototype.addEventListener,Pe=[],Nd=["touchstart","touchend","scroll"],Bg,nf,Cg,Cd,If="abort getAllResponseHeaders getResponseHeader open overrideMimeType send setRequestHeader".split(" "),
We,ah,Dg,zd,bh=new (function(){return function(){this["!"]="%21";this["~"]="%7E";this["*"]="%2A";this["("]="%28";this[")"]="%29";this["'"]="%27";this.$="%24";this[";"]="%3B";this[","]="%2C"}}()),Eh={},ch,uc={},Sd,Fh=(Sd={},Sd.l="Lax",Sd.s="Strict",Sd.n="None",Sd),dh=!1,Xe=ub.postMessage,of=ub.Worker&&ub.Worker.prototype.postMessage,Eg=ub.parent.postMessage,lj=ub.top.postMessage,Ih=ub.Worker,Kf=ub.Blob,eh=ub.URL&&ub.URL.createObjectURL,Fg,Hh,hg,Gh,ig=!1,pf,ce=[],Jf=[],fh,Hg,Dd,jg={},Ed,Lf,kg,gh=6E8,
Mf="rxec",De="rxvisitid",hh=/([A-Z]+)-([0-9]+)/,te=[],Ee,Ze,Nf=!1,ec,Gg=!1,Rd=[],$e=[],ke=[],Ig=[],le=[],li=!1,xd,fc,qf;(function(p){var z,I;p=p||0>(null===(z=navigator.userAgent)||void 0===z?void 0:z.indexOf("RuxitSynthetic"));if(!ub.dT_||!ub.dT_.cfg||"string"!==typeof ub.dT_.cfg||"initialized"in ub.dT_&&ub.dT_.initialized)null===(I=ub.console)||void 0===I?void 0:I.log("InitConfig not found or agent already initialized! This is an injection issue."),ub.dT_&&(ub.dT_.di=3);else if(p&&!Jc()){try{delete ub.dT_}catch(za){ub.dT_=
void 0}fb()&&ub.console.log("JsAgent initCode initialization failed!")}})(!1)})();}).call(this);