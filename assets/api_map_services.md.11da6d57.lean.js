import{_ as r,C as c,o as a,c as i,b as e,w as s,Z as o,Q as p,k as E,H as l,a as t}from"./chunks/framework.70a39c86.js";const y="/kdk/assets/catalog-data-model.882b6b27.png",u="/kdk/assets/feature-data-model.f5a2643d.png",d="/kdk/assets/aggregated-feature-data-model.2e5f6728.png",h="/kdk/assets/alert-data-model.f0f002cb.png",D=JSON.parse('{"title":"Services","description":"","frontmatter":{},"headers":[],"relativePath":"api/map/services.md","filePath":"api/map/services.md"}'),g={name:"api/map/services.md"},f=p("",79),m=p("",14),F=E("p",null,"These are mainly hooks to convert from/to JS/MongoDB data types.",-1);function b(C,q,v,k,A,B){const n=c("Mermaid");return a(),i("div",null,[f,(a(),e(o,null,{default:s(()=>[l(n,{id:"mermaid-536",class:"eita",graph:"graph%20TB%0A%20%20beforeAll%7BmarshallTimeQuery%7D%0A%20%20afterAll%7Bafter%20all%7D%0A%20%20afterAll%20--%3E%20hook1(unprocessTime)%0A%20%20beforeAll%20--%3E%20hook2(marshallComparisonQuery)%0A%20%20hook2%20--%3E%20hook3(marshallSortQuery)%0A%20%20hook3%20--%3E%20hook4(marshallSpatialQuery)%0A%20%20hook4%20--%3E%20hook5(aggregateFeaturesQuery)%0A%20%20hook5%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20hook6(asGeoJson)%0A%20%20hook6%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook7(processTime)%0A%20%20hook7%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook8(processTime)%0A%20%20hook8%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook9(processTime)%0A%20%20hook9%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook10(marshallComparisonQuery)%0A%20%20hook10%20--%3E%20hook11(marshallSpatialQuery)%0A%20%20hook11%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20afterAll%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%2Chook10%2Chook11%2Chook12%2Chook13%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[t(" Loading... ")]),_:1})),m,(a(),e(o,null,{default:s(()=>[l(n,{id:"mermaid-653",class:"eita",graph:"graph%20TB%0A%20%20beforeAll%7Bbefore%20all%7D%0A%20%20afterAll%7Bafter%20all%7D%0A%20%20afterAll%20--%3E%20hook1(unprocessTime)%0A%20%20hook1%20--%3E%20hook2(convertToJson)%0A%20%20beforeAll%20--%3E%20hook3(marshallSpatialQuery)%0A%20%20hook3%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook4(processTime)%0A%20%20hook4%20--%3E%20hook5(convertToString)%0A%20%20hook5%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20hook6(registerAlert)%0A%20%20hook6%20--%20Alert%20CRON%20task%20created%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook7(disallow)%0A%20%20hook7%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook8(processTime)%0A%20%20hook8%20--%3E%20hook9(convertToString)%0A%20%20hook9%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook10(unregisterAlert)%0A%20%20hook10%20--%20Alert%20CRON%20task%20deleted%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20afterAll%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%2Chook10%2Chook11%2Chook12%2Chook13%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[t(" Loading... ")]),_:1})),F])}const T=r(g,[["render",b]]);export{D as __pageData,T as default};
