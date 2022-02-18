import{d as P,r as h,w,o as g,c as v,a as F,v as M,b as a,e as V,f as C,t as I,F as W,g as H,h as G,p as k,i as B,j as O,k as K,l as Q,m as X,n as q,q as Y}from"./vendor.3c2c2b95.js";const j=function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))p(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const E of i.addedNodes)E.tagName==="LINK"&&E.rel==="modulepreload"&&p(E)}).observe(document,{childList:!0,subtree:!0});function c(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerpolicy&&(i.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?i.credentials="include":t.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function p(t){if(t.ep)return;t.ep=!0;const i=c(t);fetch(t.href,i)}};j();var $=`{ ws=explicit }
Formula ::= "="? Expression { ws=implicit }

Expression ::= AddExpression (WS* ('=' | '<>' | '>=' | '<=' | '>' | '<') WS* Expression)? { simplifyWhenOneChildren=true }
AddExpression ::= MulExpression (WS* ('+' | '-') WS* AddExpression)? { simplifyWhenOneChildren=true }
MulExpression ::= PowExpression (WS* ('*' | '/') WS* MulExpression)? { simplifyWhenOneChildren=true }
PowExpression ::= UnaryExpression (WS* '^' WS* PowExpression)? { simplifyWhenOneChildren=true }
UnaryExpression ::=  UnaryMinus | FunctionCall | ParenExpression | Reference | Literal | Identifier { simplifyWhenOneChildren=true }
UnaryMinus ::= !Number '-' AddExpression { pin=2 }

FunctionCall ::= Identifier FunctionArguments { ws=implicit }
FunctionArguments ::= "(" ( WS* Expression AdditionalArgument* WS* )? ")" { pin=1, ws=implicit }
AdditionalArgument ::= WS* ARGUMENT_SEPARATOR WS* Expression | EmptyArgument { fragment=true }
EmptyArgument ::= WS* ARGUMENT_SEPARATOR WS*

Literal ::= Number | Boolean | String { ws=implicit }
ParenExpression ::= '(' WS* Expression WS* ')' { pin=3, recoverUntil=CLOSE_PAREN }

Reference ::= GlobalReference | LocalReference
GlobalReference ::= Sheet "!" LocalReference
LocalReference ::= Range | Vector | CellAddress

Sheet ::= Identifier

Range ::= Address ":" Address
Vector ::= ColumnRange | RowRange
ColumnRange ::= ColumnAddress ":" ColumnAddress
RowRange ::= RowAddress ":" RowAddress

Address ::= CellAddress | ColumnAddress | RowAddress
CellAddress ::= ColumnAddress RowAddress
RowAddress ::= "$"? RelativeRowAddress
RelativeRowAddress ::= DIGIT+
ColumnAddress ::= "$"? RelativeColumnAddress
RelativeColumnAddress ::= ( LETTER LETTER | LETTER )

Number ::= "-"? ("0" | [1-9] [0-9]*) ("." [0-9]+)? (("e" | "E") ( "-" | "+" )? ("0" | [1-9] [0-9]*))?
Integer ::= "0" | [1-9] [0-9]*
Boolean ::= ("TRUE" | "FALSE" | "true" | "false") !IDENTIFIER_CHAR

Identifier ::= IDENTIFIER_FIRST_CHAR IDENTIFIER_CHAR* | "'" NON_SINGLE_QUTE* "'"

IDENTIFIER_FIRST_CHAR ::= ![0-9] IDENTIFIER_CHAR
IDENTIFIER_CHAR ::= ![\\s()] !"'" !'"' !SYMBOL !ARGUMENT_SEPARATOR CHAR

LETTER ::= [a-zA-Z]
DIGIT ::= [0-9]
CLOSE_PAREN ::= ")"
SYMBOL ::= "+" | "-" | "*" | "/" | "^" | "." | "," | "\`" | "~" | "!" | "@" | "#" | "$" | "%" | "&" | "?" | "<" | ">" | "=" | "\\\\" | ":" | ";" | "(" | ")" | "[" | "]" | "{" | "}" | "|"

String           ::= '"' NON_DOUBLE_QUOTE* '"'
NON_SINGLE_QUTE  ::= !"'" CHAR
NON_DOUBLE_QUOTE ::= !'"' CHAR
CHAR             ::= !"$" UNESCAPED
UNESCAPED        ::= [#x20-#x21] | [#x23-#x5B] | [#x5D-#xFFFF]
WS               ::= [#x20#x09#x0A#x0D]+
`;var z=(u,l)=>{const c=u.__vccOpts||u;for(const[p,t]of l)c[p]=t;return c};const T=u=>(k("data-v-2fabbd3a"),u=u(),B(),u),J=T(()=>a("h3",null,"Original formula:",-1)),Z=T(()=>a("option",{value:","},[C("Use "),a("code",null,","),C(" as argument separator")],-1)),ee=T(()=>a("option",{value:";"},[C("Use "),a("code",null,";"),C(" as argument separator")],-1)),ne=[Z,ee],re=T(()=>a("h3",null,"Transformed formula:",-1)),oe={class:"result"},te={class:"unparsed"},se={key:0,class:"errors"},le=P({setup(u){const l=h(""),c=h();console.log($);let p;function t(e,r){if(e.type===r)return e;if(e.children.length===1)return t(e.children[0],r);throw new Error(`Expected ${r} got ${e.type}: ${e.text}`)}function i(e){return parseFloat(t(e,"Number").text)}function E(e){return t(e,"Boolean").text.toUpperCase()==="TRUE"}function A(e,r){return r(e,n=>{let o=n.text;const s=n.start;return n.children.slice().reverse().forEach(f=>{o=o.slice(0,f.start-s)+A(f,r)+o.slice(f.end-s)}),o})}function D(e){let r=1,n="";for(let o=e.length-1;o>=0;o--){let s=e.toUpperCase().charCodeAt(o);if(s+=r,s>90?(s=65,r=1):r=0,n=String.fromCharCode(s)+n,!r){n=e.substring(0,o)+n;break}}return r&&(n="A"+n),n}function U(e,r){return A(e,(n,o)=>{if(n.type==="Range"){const s=n.children[0],f=n.children[1];let m="UNKNOWN";const N=A(s,(d,_)=>{if(d.type==="ColumnAddress"){m=d.text;for(let L=0;L<r;L++)m=D(m);return m}else return _(d)}),y=A(f,(d,_)=>d.type==="ColumnAddress"?m:_(d));return`${N}:${y}`}return o(n)})}function b(e,r){if(e.type=="FunctionCall"&&e.children[0].text.toUpperCase()==="VLOOKUP"&&e.children[1].children.length>=3&&e.children[1].children.length<=4){const n=e.children[1].children;console.log("Found VLOOKUP",n);const o=n[0],s=t(n[1],"Reference"),f=i(n[2]),m=n.length===3?!0:n[3].type=="EmptyArgument"?!1:E(n[3]),N=U(s,0),y=U(s,f-1),d=m?"":`${l.value} 0`,_=r(o);return`INDEX(${y}${l.value} MATCH(${_}${l.value} ${N}${d}))`}else return r(e)}const x=h(""),R=h(""),S=h("");return w(l,e=>{const r=O.Grammars.Custom.getRules($).concat(O.Grammars.Custom.getRules(`
ARGUMENT_SEPARATOR ::= "${e}"
`));console.log(r),p=new O.Parser(r,{}),x.value=`=VLOOKUP(F2${e}tech!B:F${e}5${e}FALSE)`}),w(x,e=>{console.log(e);const r=p.getAST(e);console.log(r);let n=[];if(r===null)R.value="",S.value=e,n.push("Failed to parse");else try{R.value=A(r,b),S.value=r.rest,n=n.concat(r.errors)}catch(o){R.value="",S.value=e,console.error(o);let s;o instanceof Error?s=o.message:s=`${o}`,n.push(s)}console.log("Transformed:",R.value),console.log("Errors",n),c.value=n}),l.value=";",(e,r)=>{var n;return g(),v(W,null,[J,F(a("textarea",{class:"input","onUpdate:modelValue":r[0]||(r[0]=o=>x.value=o)},null,512),[[M,x.value]]),a("div",null,[F(a("select",{"onUpdate:modelValue":r[1]||(r[1]=o=>l.value=o)},ne,512),[[V,l.value]])]),re,a("div",oe,[C(I(R.value),1),a("span",te,I(S.value),1)]),((n=c.value)==null?void 0:n.length)?(g(),v("div",se,[a("ul",null,[(g(!0),v(W,null,H(c.value,o=>(g(),v("li",null,I(o),1))),256))])])):G("",!0)],64)}}});var ie=z(le,[["__scopeId","data-v-2fabbd3a"]]);const ae=X("<h1>Transform VLOOKUP to INDEX/MATCH!</h1><p> The <code>VLOOKUP</code> formula in Excel and Google Sheets is inefficient, and is prone to break when the target range is restructured. The solution is to use <code>INDEX</code> and <code>MATCH</code>! However, transforming existing formulae is non-trivial and easy to mess up. </p><p> Hence this conveter tool! Take your existing formula, pop it into the box below, and it will convert all your existing <code>VLOOKUP</code> calls to <code>INDEX-MATCH</code>! </p>",3),ue=P({setup(u){return K({page_path:"/"}),(l,c)=>(g(),v("main",null,[ae,Q(ie)]))}});q(ue).use(Y,{config:{id:"G-3FC267J0K7"}}).mount("#app");
