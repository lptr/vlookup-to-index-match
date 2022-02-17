import{d as O,a as T,r as S,w as P,o as U,c as L,b as W,v as $,e as _,f as V,t as I,F as b,p as H,g as M,h as G,i as k,j as B}from"./vendor.9b26e50c.js";const K=function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))f(o);new MutationObserver(o=>{for(const t of o)if(t.type==="childList")for(const m of t.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&f(m)}).observe(document,{childList:!0,subtree:!0});function a(o){const t={};return o.integrity&&(t.integrity=o.integrity),o.referrerpolicy&&(t.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?t.credentials="include":o.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function f(o){if(o.ep)return;o.ep=!0;const t=a(o);fetch(o.href,t)}};K();var y=`{ ws=explicit }
Formula ::= "="? Expression { ws=implicit }

Expression ::= AddExpression (WS* ('=' | '<>' | '>=' | '<=' | '>' | '<') WS* Expression)? { simplifyWhenOneChildren=true }
AddExpression ::= MulExpression (WS* ('+' | '-') WS* AddExpression)? { simplifyWhenOneChildren=true }
MulExpression ::= UnaryExpression (WS* ('*' | '/') WS* MulExpression)? { simplifyWhenOneChildren=true }
UnaryExpression ::=  UnaryMinus | FunctionCall | ParenExpression | Reference | Literal | Identifier { simplifyWhenOneChildren=true }
UnaryMinus ::= !Number '-' AddExpression { pin=2 }

FunctionCall ::= Identifier FunctionArguments { ws=implicit }
FunctionArguments ::= "(" ( WS* Expression (WS* ARGUMENT_SEPARATOR WS* Expression)* WS* )? ")" { pin=1, ws=implicit }

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
Boolean ::= "TRUE" | "FALSE" | "true" | "false"

Identifier ::= IDENTIFIER_FIRST_CHAR IDENTIFIER_CHAR* | "'" NON_SINGLE_QUTE* "'"

IDENTIFIER_FIRST_CHAR ::= ![0-9] IDENTIFIER_CHAR
IDENTIFIER_CHAR ::= ![\\s!()] !"'" !'"' !ARGUMENT_SEPARATOR CHAR

LETTER ::= [a-zA-Z]
DIGIT ::= [0-9]
CLOSE_PAREN ::= ")"

String           ::= '"' NON_DOUBLE_QUOTE* '"'
NON_SINGLE_QUTE  ::= !"'" CHAR
NON_DOUBLE_QUOTE ::= !'"' CHAR
CHAR             ::= !"$" UNESCAPED
UNESCAPED        ::= [#x20-#x21] | [#x23-#x5B] | [#x5D-#xFFFF]
WS               ::= [#x20#x09#x0A#x0D]+
`;var Q=(c,i)=>{const a=c.__vccOpts||c;for(const[f,o]of i)a[f]=o;return a};const F=c=>(H("data-v-4f54808d"),c=c(),M(),c),X=F(()=>_("h3",null,"Original formula:",-1)),j=F(()=>_("h3",null,"Transformed formula:",-1)),q={class:"unparsed"},z=O({setup(c){const i=";";console.log(y);const a=T.Grammars.Custom.getRules(y).concat(T.Grammars.Custom.getRules(`
ARGUMENT_SEPARATOR ::= "${i}"
`));console.log(a);const f=new T.Parser(a,{});function o(e,r){if(e.type===r)return e;if(e.children.length===1)return o(e.children[0],r);throw new Error(`Expected ${r} got: ${e.type}`)}function t(e){return parseFloat(o(e,"Number").text)}function m(e){return o(e,"Boolean").text.toUpperCase()==="TRUE"}function E(e,r){return r(e,n=>{let s=n.text;const l=n.start;return n.children.slice().reverse().forEach(u=>{s=s.slice(0,u.start-l)+E(u,r)+s.slice(u.end-l)}),s})}function w(e){let r=1,n="";for(let s=e.length-1;s>=0;s--){let l=e.toUpperCase().charCodeAt(s);if(l+=r,l>90?(l=65,r=1):r=0,n=String.fromCharCode(l)+n,!r){n=e.substring(0,s)+n;break}}return r&&(n="A"+n),n}function v(e,r){return E(e,(n,s)=>{if(n.type==="Range"){const l=n.children[0],u=n.children[1];let p="UNKNOWN";const C=E(l,(d,A)=>{if(d.type==="ColumnAddress"){p=d.text;for(let N=0;N<r;N++)p=w(p);return p}else return A(d)}),x=E(u,(d,A)=>d.type==="ColumnAddress"?p:A(d));return`${C}:${x}`}return s(n)})}function D(e,r){if(e.type=="FunctionCall"&&e.children[0].text.toUpperCase()==="VLOOKUP"&&e.children[1].children.length>=3&&e.children[1].children.length<=4){const n=e.children[1].children;console.log("Found VLOOKUP",n);const s=n[0],l=o(n[1],"Reference"),u=t(n[2]),p=n.length===4?m(n[3]):!0,C=v(l,0),x=v(l,u-1),d=p?"":`${i} 0`,A=r(s);return`INDEX(${x}${i} MATCH(${A}${i} ${C}${d}))`}else return r(e)}const h=S(""),R=S(""),g=S("");return P(h,e=>{console.log(e);const r=f.getAST(e);if(console.log(r),r===null)R.value="Failed to parse",g.value=e;else try{R.value=E(r,D),g.value=r.rest}catch(n){console.error(n),R.value="Failed to transform",g.value=n}console.log("Transformed:",R.value)}),h.value="=VLOOKUP(F2;tech!B:F;5;FALSE)",(e,r)=>(U(),L(b,null,[X,W(_("textarea",{class:"input","onUpdate:modelValue":r[0]||(r[0]=n=>h.value=n)},null,512),[[$,h.value]]),j,_("pre",null,[V(I(R.value),1),_("span",q,I(g.value),1)])],64))}});var Z=Q(z,[["__scopeId","data-v-4f54808d"]]);const J=k("<h1>Transform VLOOKUP to INDEX/MATCH!</h1><p> The <code>VLOOKUP</code> formula in Excel and Google Sheets is inefficient, and is prone to break when the target range is restructured. The solution is to use <code>INDEX</code> and <code>MATCH</code>! However, transforming existing formulae is non-trivial and easy to mess up. </p><p> Hence this conveter tool! Take your existing formula, pop it into the box below, and it will convert all your existing <code>VLOOKUP</code> calls to <code>INDEX-MATCH</code>! </p>",3),Y=O({setup(c){return(i,a)=>(U(),L("main",null,[J,G(Z)]))}});B(Y).mount("#app");
