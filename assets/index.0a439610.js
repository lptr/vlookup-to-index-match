import{d as O,a as S,r as T,w as D,o as U,c as L,b as P,v as $,e as _,f as V,t as y,F as b,p as H,g as M,h as G,i as k,j as B}from"./vendor.9b26e50c.js";const K=function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))f(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const m of o.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&f(m)}).observe(document,{childList:!0,subtree:!0});function c(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerpolicy&&(o.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?o.credentials="include":t.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function f(t){if(t.ep)return;t.ep=!0;const o=c(t);fetch(t.href,o)}};K();var I=`{ ws=explicit }
Formula ::= "="? Expression { ws=implicit }

Expression ::= AddExpression (WS* ('=' | '<>' | '>=' | '<=' | '>' | '<') WS* Expression)? { simplifyWhenOneChildren=true }
AddExpression ::= MulExpression (WS* ('+' | '-') WS* AddExpression)? { simplifyWhenOneChildren=true }
MulExpression ::= UnaryExpression (WS* ('*' | '/') WS* MulExpression)? { simplifyWhenOneChildren=true }
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
`;var Q=(a,i)=>{const c=a.__vccOpts||a;for(const[f,t]of i)c[f]=t;return c};const F=a=>(H("data-v-634f7850"),a=a(),M(),a),X=F(()=>_("h3",null,"Original formula:",-1)),j=F(()=>_("h3",null,"Transformed formula:",-1)),q={class:"unparsed"},z=O({setup(a){const i=";";console.log(I);const c=S.Grammars.Custom.getRules(I).concat(S.Grammars.Custom.getRules(`
ARGUMENT_SEPARATOR ::= "${i}"
`));console.log(c);const f=new S.Parser(c,{});function t(e,r){if(e.type===r)return e;if(e.children.length===1)return t(e.children[0],r);throw new Error(`Expected ${r} got: ${e.type}`)}function o(e){return parseFloat(t(e,"Number").text)}function m(e){return t(e,"Boolean").text.toUpperCase()==="TRUE"}function E(e,r){return r(e,n=>{let s=n.text;const l=n.start;return n.children.slice().reverse().forEach(d=>{s=s.slice(0,d.start-l)+E(d,r)+s.slice(d.end-l)}),s})}function w(e){let r=1,n="";for(let s=e.length-1;s>=0;s--){let l=e.toUpperCase().charCodeAt(s);if(l+=r,l>90?(l=65,r=1):r=0,n=String.fromCharCode(l)+n,!r){n=e.substring(0,s)+n;break}}return r&&(n="A"+n),n}function N(e,r){return E(e,(n,s)=>{if(n.type==="Range"){const l=n.children[0],d=n.children[1];let p="UNKNOWN";const C=E(l,(u,R)=>{if(u.type==="ColumnAddress"){p=u.text;for(let v=0;v<r;v++)p=w(p);return p}else return R(u)}),x=E(d,(u,R)=>u.type==="ColumnAddress"?p:R(u));return`${C}:${x}`}return s(n)})}function W(e,r){if(e.type=="FunctionCall"&&e.children[0].text.toUpperCase()==="VLOOKUP"&&e.children[1].children.length>=3&&e.children[1].children.length<=4){const n=e.children[1].children;console.log("Found VLOOKUP",n);const s=n[0],l=t(n[1],"Reference"),d=o(n[2]),p=n.length===3?!0:n[3].type=="EmptyArgument"?!1:m(n[3]),C=N(l,0),x=N(l,d-1),u=p?"":`${i} 0`,R=r(s);return`INDEX(${x}${i} MATCH(${R}${i} ${C}${u}))`}else return r(e)}const g=T(""),A=T(""),h=T("");return D(g,e=>{console.log(e);const r=f.getAST(e);if(console.log(r),r===null)A.value="Failed to parse",h.value=e;else try{A.value=E(r,W),h.value=r.rest}catch(n){console.error(n),A.value="Failed to transform",h.value=n}console.log("Transformed:",A.value)}),g.value="=VLOOKUP(F2;tech!B:F;5;FALSE)",(e,r)=>(U(),L(b,null,[X,P(_("textarea",{class:"input","onUpdate:modelValue":r[0]||(r[0]=n=>g.value=n)},null,512),[[$,g.value]]),j,_("pre",null,[V(y(A.value),1),_("span",q,y(h.value),1)])],64))}});var Z=Q(z,[["__scopeId","data-v-634f7850"]]);const J=k("<h1>Transform VLOOKUP to INDEX/MATCH!</h1><p> The <code>VLOOKUP</code> formula in Excel and Google Sheets is inefficient, and is prone to break when the target range is restructured. The solution is to use <code>INDEX</code> and <code>MATCH</code>! However, transforming existing formulae is non-trivial and easy to mess up. </p><p> Hence this conveter tool! Take your existing formula, pop it into the box below, and it will convert all your existing <code>VLOOKUP</code> calls to <code>INDEX-MATCH</code>! </p>",3),Y=O({setup(a){return(i,c)=>(U(),L("main",null,[J,G(Z)]))}});B(Y).mount("#app");
