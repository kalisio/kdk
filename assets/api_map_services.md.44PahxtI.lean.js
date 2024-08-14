import{_ as r,c as h,b as a,w as s,ak as t,V as o,m as p,E as k,o as e,J as n,a as l}from"./chunks/framework.MC2QjGNi.js";const d="/kdk/assets/catalog-data-model.7zPWNOze.png",c="/kdk/assets/feature-data-model.vC9bR4rq.png",g="/kdk/assets/aggregated-feature-data-model.UMhZZZS4.png",E="/kdk/assets/alert-data-model.wy0clQGT.png",D=JSON.parse('{"title":"Services","description":"","frontmatter":{},"headers":[],"relativePath":"api/map/services.md","filePath":"api/map/services.md"}'),u={name:"api/map/services.md"},y=o("",94),f=o("",25),m=p("p",null,"These are mainly hooks to convert from/to JS/MongoDB data types.",-1);function b(F,v,C,A,q,B){const i=k("Mermaid");return e(),h("div",null,[y,(e(),a(t,null,{default:s(()=>[n(i,{id:"mermaid-781",class:"mermaid",graph:"graph%20TB%0A%20%20beforeAll%7BmarshallTimeQuery%7D%0A%20%20afterAll%7Bafter%20all%7D%0A%20%20afterAll%20--%3E%20hook12(unprocessTime)%0A%20%20hook12%20--%3E%20hook13(simplifyEvents)%0A%20%20hook13%20--%3E%20hook14(simplifyEvents)%0A%20%20hook14%20--%3E%20hook15(skipEvents)%0A%20%20beforeAll%20--%3E%20hook2(marshallComparisonQuery)%0A%20%20hook2%20--%3E%20hook3(marshallSortQuery)%0A%20%20hook3%20--%3E%20hook4(marshallSpatialQuery)%0A%20%20hook4%20--%3E%20hook5(aggregateFeaturesQuery)%0A%20%20hook5%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20hook6(asGeoJson)%0A%20%20hook6%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook7(processTime)%0A%20%20hook7%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook8(processTime)%0A%20%20hook8%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook9(processTime)%0A%20%20hook9%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook10(marshallComparisonQuery)%0A%20%20hook10%20--%3E%20hook11(marshallSpatialQuery)%0A%20%20hook11%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20afterAll%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%2Chook10%2Chook11%2Chook12%2Chook13%2Chook14%2Chook15%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[l(" Loading... ")]),_:1})),f,(e(),a(t,null,{default:s(()=>[n(i,{id:"mermaid-961",class:"mermaid",graph:"graph%20TB%0A%20%20beforeAll%7Bbefore%20all%7D%0A%20%20afterAll%7Bafter%20all%7D%0A%20%20afterAll%20--%3E%20hook1(unprocessTime)%0A%20%20hook1%20--%3E%20hook2(convertToJson)%0A%20%20beforeAll%20--%3E%20hook3(marshallSpatialQuery)%0A%20%20hook3%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook4(processTime)%0A%20%20hook4%20--%3E%20hook5(convertToString)%0A%20%20hook5%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20hook6(registerAlert)%0A%20%20hook6%20--%20Alert%20CRON%20task%20created%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook7(disallow)%0A%20%20hook7%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook8(processTime)%0A%20%20hook8%20--%3E%20hook9(convertToString)%0A%20%20hook9%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook10(unregisterAlert)%0A%20%20hook10%20--%20Alert%20CRON%20task%20deleted%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20afterAll%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%2Chook10%2Chook11%2Chook12%2Chook13%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[l(" Loading... ")]),_:1})),m])}const T=r(u,[["render",b]]);export{D as __pageData,T as default};
