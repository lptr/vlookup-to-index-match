import{d as w,r as v,w as O,o as F,c as W,a as I,v as D,b as a,e as M,f as _,t as U,F as V,p as b,g as H,h as T,i as G,j as B,k}from"./vendor.dd16060c.js";const K=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))u(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&u(d)}).observe(document,{childList:!0,subtree:!0});function p(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerpolicy&&(s.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?s.credentials="include":o.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function u(o){if(o.ep)return;o.ep=!0;const s=p(o);fetch(o.href,s)}};K();var L=`{ ws=explicit }
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
Boolean ::= "TRUE" | "FALSE" | "true" | "false"

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
`;var Q=(c,t)=>{const p=c.__vccOpts||c;for(const[u,o]of t)p[u]=o;return p};const C=c=>(b("data-v-c6497e4a"),c=c(),H(),c),X=C(()=>a("h3",null,"Original formula:",-1)),Y=C(()=>a("option",{value:","},[_("Use "),a("code",null,","),_(" as argument separator")],-1)),j=C(()=>a("option",{value:";"},[_("Use "),a("code",null,";"),_(" as argument separator")],-1)),q=[Y,j],z=C(()=>a("h3",null,"Transformed formula:",-1)),Z={class:"result"},J={class:"unparsed"},ee=w({setup(c){const t=v("");console.log(L);let p;function u(e,r){if(e.type===r)return e;if(e.children.length===1)return u(e.children[0],r);throw new Error(`Expected ${r} got: ${e.type}`)}function o(e){return parseFloat(u(e,"Number").text)}function s(e){return u(e,"Boolean").text.toUpperCase()==="TRUE"}function d(e,r){return r(e,n=>{let l=n.text;const i=n.start;return n.children.slice().reverse().forEach(m=>{l=l.slice(0,m.start-i)+d(m,r)+l.slice(m.end-i)}),l})}function P(e){let r=1,n="";for(let l=e.length-1;l>=0;l--){let i=e.toUpperCase().charCodeAt(l);if(i+=r,i>90?(i=65,r=1):r=0,n=String.fromCharCode(i)+n,!r){n=e.substring(0,l)+n;break}}return r&&(n="A"+n),n}function N(e,r){return d(e,(n,l)=>{if(n.type==="Range"){const i=n.children[0],m=n.children[1];let E="UNKNOWN";const x=d(i,(f,R)=>{if(f.type==="ColumnAddress"){E=f.text;for(let y=0;y<r;y++)E=P(E);return E}else return R(f)}),S=d(m,(f,R)=>f.type==="ColumnAddress"?E:R(f));return`${x}:${S}`}return l(n)})}function $(e,r){if(e.type=="FunctionCall"&&e.children[0].text.toUpperCase()==="VLOOKUP"&&e.children[1].children.length>=3&&e.children[1].children.length<=4){const n=e.children[1].children;console.log("Found VLOOKUP",n);const l=n[0],i=u(n[1],"Reference"),m=o(n[2]),E=n.length===3?!0:n[3].type=="EmptyArgument"?!1:s(n[3]),x=N(i,0),S=N(i,m-1),f=E?"":`${t.value} 0`,R=r(l);return`INDEX(${S}${t.value} MATCH(${R}${t.value} ${x}${f}))`}else return r(e)}const h=v(""),A=v(""),g=v("");return O(t,e=>{const r=T.Grammars.Custom.getRules(L).concat(T.Grammars.Custom.getRules(`
ARGUMENT_SEPARATOR ::= "${e}"
`));console.log(r),p=new T.Parser(r,{}),h.value=`=VLOOKUP(F2${e}tech!B:F${e}5${e}FALSE)`}),O(h,e=>{console.log(e);const r=p.getAST(e);if(console.log(r),r===null)A.value="Failed to parse",g.value=e;else try{A.value=d(r,$),g.value=r.rest}catch(n){console.error(n),A.value="Failed to transform",g.value=n}console.log("Transformed:",A.value)}),t.value=";",(e,r)=>(F(),W(V,null,[X,I(a("textarea",{class:"input","onUpdate:modelValue":r[0]||(r[0]=n=>h.value=n)},null,512),[[D,h.value]]),a("div",null,[I(a("select",{"onUpdate:modelValue":r[1]||(r[1]=n=>t.value=n)},q,512),[[M,t.value]])]),z,a("div",Z,[_(U(A.value),1),a("span",J,U(g.value),1)])],64))}});var ne=Q(ee,[["__scopeId","data-v-c6497e4a"]]);const re=B("<h1>Transform VLOOKUP to INDEX/MATCH!</h1><p> The <code>VLOOKUP</code> formula in Excel and Google Sheets is inefficient, and is prone to break when the target range is restructured. The solution is to use <code>INDEX</code> and <code>MATCH</code>! However, transforming existing formulae is non-trivial and easy to mess up. </p><p> Hence this conveter tool! Take your existing formula, pop it into the box below, and it will convert all your existing <code>VLOOKUP</code> calls to <code>INDEX-MATCH</code>! </p>",3),oe=w({setup(c){return(t,p)=>(F(),W("main",null,[re,G(ne)]))}});k(oe).mount("#app");
