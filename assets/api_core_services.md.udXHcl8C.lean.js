import{_ as n,c as h,b as o,w as e,ak as t,V as a,E as c,o as s,J as r,a as l}from"./chunks/framework.MC2QjGNi.js";const x=JSON.parse('{"title":"Services","description":"","frontmatter":{},"headers":[],"relativePath":"api/core/services.md","filePath":"api/core/services.md"}'),p={name:"api/core/services.md"},k=a("",7),d=a("",8),E=a("",8),u=a("",7),A=a("",17),g=a("",9),f=a("",9),m=a("",8),C=a("",7),b=a("",11),v=a("",13),T=a("",9);function y(_,D,F,P,w,B){const i=c("Mermaid");return s(),h("div",null,[k,(s(),o(t,null,{default:e(()=>[r(i,{id:"mermaid-23",class:"mermaid",graph:"graph%20TB%0A%20%20beforeAll%7Bnone%20before%20all%7D%0A%20%20afterAll%7Bafter%20all%7D%0A%20%20afterAll%20--%3E%20hook1(%22discard('passwords')%22)%0A%20%20hook1%20--%20Email%2FName%20extracted%20from%20profile%20--%3E%20hook2(%22serialize('profile')%22)%0A%20%20beforeAll%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook4(%22serialize('profile')%22)%0A%20%20hook4%20--%20Email%2FName%20set%20in%20profile%20--%3E%20hook5(%22serialize('clearPassword')%22)%0A%20%20hook5%20--%20Clear%20password%20saved%20--%3E%20hook6(%22hashPassword%22)%0A%20%20hook6%20--%20Password%20hashed%20--%3E%20hook7(%22enforcePasswordPolicy%22)%0A%20%20hook7%20--%20Clear%20password%20validated%20--%3E%20hook8(%22discard('clearPassword')%22)%0A%20%20hook8%20--%20Clear%20password%20removed%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20hook9(updateAbilities)%0A%20%20hook9%20--%20Abilities%20initialized%20in%20cache%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook10(populatePreviousObject)%0A%20%20hook10%20--%20Previous%20user%20as%20params%20--%3E%20hook11(storePreviousPassword)%0A%20%20hook11%20--%20Previous%20password%20list%20updated%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook12(populatePreviousObject)%0A%20%20hook12%20--%20Previous%20user%20as%20params%20--%3E%20hook13(storePreviousPassword)%0A%20%20hook13%20--%20Previous%20password%20list%20updated%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20hook3(sendNewSubscriptionEmail)%0A%20%20hook3%20--%3E%20Email%20sent%20if%20new%20subscription%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20afterAll%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%2Chook10%2Chook11%2Chook12%2Chook13%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:e(()=>[l(" Loading... ")]),_:1})),d,(s(),o(t,null,{default:e(()=>[r(i,{id:"mermaid-54",class:"mermaid",graph:"graph%20TB%0A%20%20before%7B%22disallow('external')%22%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CCREATE%2CREMOVE%20operationClass%0A"})]),fallback:e(()=>[l(" Loading... ")]),_:1})),E,(s(),o(t,null,{default:e(()=>[r(i,{id:"mermaid-83",class:"mermaid",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20hook1(%22disallow('external')%22)%0A%20%20hook1%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20hook2(deleteExpiredSubscriptions)%0A%20%20hook2%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CCREATE%2CREMOVE%20operationClass%0A"})]),fallback:e(()=>[l(" Loading... ")]),_:1})),u,(s(),o(t,null,{default:e(()=>[r(i,{id:"mermaid-107",class:"mermaid",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%20If%20reset%2Fchange%20password%20--%3E%20hook1(populateAccountUser)%0A%20%20hook1%20--%3E%20hook2(enforcePasswordPolicy)%0A%20%20hook2%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:e(()=>[l(" Loading... ")]),_:1})),A,(s(),o(t,null,{default:e(()=>[r(i,{id:"mermaid-174",class:"mermaid",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%20Subject%20service%20as%20data%2Fparams%3Cbr%2F%3EResource%20as%20data%2Fparams%20--%3E%20hook1(populateSubjects)%0A%20%20hook1%20--%20Authorisation%20subjects%20as%20params%20--%3E%20hook2(populateResource)%0A%20%20hook2%20--%20Authorisation%20resource%20as%20params%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20PATCH%5B%5BPATCH%20SUBJECT%3Cbr%2F%3E-subject%20service-%5D%5D%0A%20%20PATCH%20--%3E%20after%0A%20%20before%20--%20Subject%20service%20as%20query%2Fparams%3Cbr%2F%3EResource%20id%20as%20query%2Fparams%20--%3E%20hook3(populateSubjects)%0A%20%20hook3%20--%20Authorisation%20subjects%20as%20params%20--%3E%20hook4(populateResource)%0A%20%20hook4%20--%20Authorisation%20resource%20as%20params%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20PATCH%5B%5BPATCH%20SUBJECT%3Cbr%2F%3E-subject%20service-%5D%5D%0A%20%20PATCH%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:e(()=>[l(" Loading... ")]),_:1})),g,(s(),o(t,null,{default:e(()=>[r(i,{id:"mermaid-206",class:"mermaid",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20after%0A%20%20before%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20after%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20before%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20hook5(%22updateOrgResource('tags')%22)%0A%20%20hook5%20--%20Updated%20tagged%20resources%20--%3E%20after%0A%20%20before%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20hook6(%22updateOrgResource('tags')%22)%0A%20%20hook6%20--%20Updated%20tagged%20resources%20--%3E%20after%0A%20%20before%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20hook9(%22updateOrgResource('tags')%22)%0A%20%20hook9%20--%20Updated%20tagged%20resources%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:e(()=>[l(" Loading... ")]),_:1})),f,(s(),o(t,null,{default:e(()=>[r(i,{id:"mermaid-238",class:"mermaid",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20after%0A%20%20before%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20after%20%20%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20before%20--%3E%20hook5(disallow)%0A%20%20hook5%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20after%0A%20%20before%20--%3E%20hook6(disallow)%0A%20%20hook6%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20after%0A%20%20before%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:e(()=>[l(" Loading... ")]),_:1})),m,(s(),o(t,null,{default:e(()=>[r(i,{id:"mermaid-269",class:"mermaid",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20hook1(disallow)%0A%20%20hook1%20---%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20after%0A%20%20before%20--%3E%20hook2(disallow)%0A%20%20hook2%20---%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20after%20%20%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20before%20--%3E%20hook3(disallow)%0A%20%20hook3%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20after%0A%20%20before%20--%3E%20hook4(disallow)%0A%20%20hook4%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20after%0A%20%20before%20--%3E%20hook5(disallow)%0A%20%20hook5%20---%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:e(()=>[l(" Loading... ")]),_:1})),C,(s(),o(t,null,{default:e(()=>[r(i,{id:"mermaid-297",class:"mermaid",graph:"graph%20TB%0A%20%20before%7B%22disallow('external')%22%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20after%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20before%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CCREATE%2CREMOVE%20operationClass%0A"})]),fallback:e(()=>[l(" Loading... ")]),_:1})),b,(s(),o(t,null,{default:e(()=>[r(i,{id:"mermaid-352",class:"mermaid",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20after%0A%20%20before%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20after%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20hook1(createOrganisationServices)%0A%20%20hook1%20--%3E%20hook2(createOrganisationAuthorisations)%0A%20%20hook2%20--%20Updated%20resources%2Fservices%20--%3E%20after%0A%20%20before%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20after%0A%20%20before%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20after%0A%20%20before%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20hook3(%22removeOrganisationResources('groups')%22)%0A%20%20hook3%20--%3E%20hook4(%22removeOrganisationResources('tags')%22)%0A%20%20hook4%20--%3E%20hook5(removeOrganisationAuthorisations)%0A%20%20hook5%20--%3E%20hook6(removeOrganisationServices)%0A%20%20hook6%20--%20Updated%20resources%2Fservices%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:e(()=>[l(" Loading... ")]),_:1})),v,(s(),o(t,null,{default:e(()=>[r(i,{id:"mermaid-396",class:"mermaid",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20after%0A%20%20before%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20after%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20before%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20hook5(%22updateOrgResource('tags')%22)%0A%20%20hook5%20--%20Updated%20tagged%20resources%20--%3E%20after%0A%20%20before%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20hook6(%22updateOrgResource('tags')%22)%0A%20%20hook6%20--%20Updated%20tagged%20resources%20--%3E%20after%0A%20%20before%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20hook9(%22updateOrgResource('tags')%22)%0A%20%20hook9%20--%20Updated%20tagged%20resources%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:e(()=>[l(" Loading... ")]),_:1})),T])}const R=n(p,[["render",y]]);export{x as __pageData,R as default};