import{_ as p,C as c,o as e,c as i,b as t,w as s,Z as l,Q as a,H as n,a as r}from"./chunks/framework.70a39c86.js";const q=JSON.parse('{"title":"Services","description":"","frontmatter":{},"headers":[],"relativePath":"api/core/services.md","filePath":"api/core/services.md"}'),E={name:"api/core/services.md"},h=a("",7),d=a("",9),u=a("",8),A=a("",16),f=a("",7),m=a("",17),k=a("",9),y=a("",9),C=a("",8),g=a("",7),b=a("",24),v=a("",9);function T(D,_,F,P,B,w){const o=c("Mermaid");return e(),i("div",null,[h,(e(),t(l,null,{default:s(()=>[n(o,{id:"mermaid-23",class:"eita",graph:"graph%20TB%0A%20%20beforeAll%7Bnone%20before%20all%7D%0A%20%20afterAll%7Bafter%20all%7D%0A%20%20afterAll%20--%3E%20hook1(%22discard('passwords')%22)%0A%20%20hook1%20--%20Email%2FName%20extracted%20from%20profile%20--%3E%20hook2(%22serialize('profile')%22)%0A%20%20beforeAll%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook3(%22serialize('OAuth2%20profile')%22)%0A%20%20hook3%20--%20Email%2FName%20extracted%20from%20provider%20--%3E%20hook4(%22serialize('profile')%22)%0A%20%20hook4%20--%20Email%2FName%20set%20in%20profile%20--%3E%20hook5(%22serialize('clearPassword')%22)%0A%20%20hook5%20--%20Clear%20password%20saved%20--%3E%20hook6(%22hashPassword%22)%0A%20%20hook6%20--%20Password%20hashed%20--%3E%20hook7(%22enforcePasswordPolicy%22)%0A%20%20hook7%20--%20Clear%20password%20validated%20--%3E%20hook8(%22discard('clearPassword')%22)%0A%20%20hook8%20--%20Clear%20password%20removed%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20hook9(updateAbilities)%0A%20%20hook9%20--%20Abilities%20initialized%20in%20cache%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook10(populatePreviousObject)%0A%20%20hook10%20--%20Previous%20user%20as%20params%20--%3E%20hook11(storePreviousPassword)%0A%20%20hook11%20--%20Previous%20password%20list%20updated%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20hook12(populatePreviousObject)%0A%20%20hook12%20--%20Previous%20user%20as%20params%20--%3E%20hook13(storePreviousPassword)%0A%20%20hook13%20--%20Previous%20password%20list%20updated%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20afterAll%0A%20%20beforeAll%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20afterAll%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%2Chook10%2Chook11%2Chook12%2Chook13%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[r(" Loading... ")]),_:1})),d,(e(),t(l,null,{default:s(()=>[n(o,{id:"mermaid-57",class:"eita",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%20If%20new%20device%20--%3E%20CREATE%0A%20%20UPDATE%20--%20If%20existing%20device%20--%3E%20UPDATE_DEVICE%5B%5BUPDATE%20DEVICE%3Cbr%2F%3E-pusher%20service-%5D%5D%0A%20%20UPDATE_DEVICE%20--%3E%20after%0A%20%20before%20--%3E%20hook1(%22disallow('external')%22)%0A%20%20hook1%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20CREATE_DEVICE%5B%5BCREATE%20DEVICE%3Cbr%2F%3E-pusher%20service-%5D%5D%0A%20%20CREATE_DEVICE%20--%3E%20PATCH_USER%5B%5BPATCH%20USER%3Cbr%2F%3E-users%20service-%5D%5D%0A%20%20PATCH_USER%20--%3E%20after%0A%20%20before%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20REMOVE_DEVICE%5B%5BREMOVE%20DEVICE%3Cbr%2F%3E-pusher%20service-%5D%5D%0A%20%20REMOVE_DEVICE%20--%3E%20%20PATCH_USER%5B%5BPATCH%20USER%3Cbr%2F%3E-users%20service-%5D%5D%0A%20%20PATCH_USER%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%2CCREATE_DEVICE%2CREMOVE_DEVICE%2CUPDATE_DEVICE%2CPATCH_USER%20operationClass%0A"})]),fallback:s(()=>[r(" Loading... ")]),_:1})),u,(e(),t(l,null,{default:s(()=>[n(o,{id:"mermaid-88",class:"eita",graph:"graph%20TB%0A%20%20before%7B%22disallow('external')%22%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CCREATE%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[r(" Loading... ")]),_:1})),A,(e(),t(l,null,{default:s(()=>[n(o,{id:"mermaid-218",class:"eita",graph:"graph%20TB%0A%20%20before%7B%22disallow('external')%22%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%20Resource%20as%20data%2Fparams%20--%3E%20hook1(populatePushObject)%0A%20%20hook1%20--%20Resource%20as%20params%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%20If%20user%20device%20--%3E%20CREATE_ENDPOINT%5BCREATE%20ENDPOINT%5D%0A%20%20CREATE%20--%20If%20resource%20topic%20--%3E%20CREATE_TOPIC%5BCREATE%20TOPIC%5D%0A%20%20CREATE%20--%20If%20subscriptions%20--%3E%20SUBSCRIBE%5BSUBSCRIBE%5D%0A%20%20CREATE%20--%20If%20message%3Cbr%2F%3E-device%20or%20topic-%20--%3E%20PUBLISH%5BPUBLISH%5D%0A%20%20CREATE_ENDPOINT%20--%3E%20after%0A%20%20CREATE_TOPIC%20--%3E%20PATCH%5B%5BPATCH%20RESOURCE%3Cbr%2F%3E-resource%20service-%5D%5D%0A%20%20PATCH%20--%3E%20after%0A%20%20SUBSCRIBE%20--%3E%20after%0A%20%20PUBLISH%20--%3E%20after%0A%20%20before%20--%20Resource%20id%20as%20query%2Fparams%20--%3E%20hook2(populatePushObject)%0A%20%20hook2%20--%20Resource%20as%20params%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%20If%20user%20device%20--%3E%20REMOVE_ENDPOINT%5BREMOVE%20ENDPOINT%5D%0A%20%20REMOVE%20--%20If%20resource%20topic%20--%3E%20REMOVE_TOPIC%5BREMOVE%20TOPIC%5D%0A%20%20REMOVE%20--%20If%20subscriptions%20--%3E%20UNSUBSCRIBE%5BUNSUBSCRIBE%5D%0A%20%20REMOVE_ENDPOINT%20--%3E%20after%0A%20%20REMOVE_TOPIC%20--%3E%20PATCH%5B%5BPATCH%20RESOURCE%3Cbr%2F%3E-resource%20service-%5D%5D%0A%20%20PATCH%20--%3E%20after%0A%20%20UNSUBSCRIBE%20--%3E%20after%0A%20%20before%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%20If%20device%20--%3E%20UPDATE_ENDPOINT%5BUPDATE%20ENDPOINT%5D%0A%20%20UPDATE_ENDPOINT%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A%20%20classDef%20snsOperationClass%20fill%3A%2363c5da%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20CREATE_ENDPOINT%2CCREATE_TOPIC%2CSUBSCRIBE%2CPUBLISH%2CREMOVE_ENDPOINT%2CREMOVE_TOPIC%2CUNSUBSCRIBE%2CUPDATE_ENDPOINT%20snsOperationClass%0A"})]),fallback:s(()=>[r(" Loading... ")]),_:1})),f,(e(),t(l,null,{default:s(()=>[n(o,{id:"mermaid-242",class:"eita",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%20If%20reset%2Fchange%20password%20--%3E%20hook1(populateAccountUser)%0A%20%20hook1%20--%3E%20hook2(enforcePasswordPolicy)%0A%20%20hook2%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[r(" Loading... ")]),_:1})),m,(e(),t(l,null,{default:s(()=>[n(o,{id:"mermaid-309",class:"eita",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%20Subject%20service%20as%20data%2Fparams%3Cbr%2F%3EResource%20as%20data%2Fparams%20--%3E%20hook1(populateSubjects)%0A%20%20hook1%20--%20Authorisation%20subjects%20as%20params%20--%3E%20hook2(populateResource)%0A%20%20hook2%20--%20Authorisation%20resource%20as%20params%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20PATCH%5B%5BPATCH%20SUBJECT%3Cbr%2F%3E-subject%20service-%5D%5D%0A%20%20PATCH%20--%3E%20after%0A%20%20before%20--%20Subject%20service%20as%20query%2Fparams%3Cbr%2F%3EResource%20id%20as%20query%2Fparams%20--%3E%20hook3(populateSubjects)%0A%20%20hook3%20--%20Authorisation%20subjects%20as%20params%20--%3E%20hook4(populateResource)%0A%20%20hook4%20--%20Authorisation%20resource%20as%20params%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20PATCH%5B%5BPATCH%20SUBJECT%3Cbr%2F%3E-subject%20service-%5D%5D%0A%20%20PATCH%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[r(" Loading... ")]),_:1})),k,(e(),t(l,null,{default:s(()=>[n(o,{id:"mermaid-341",class:"eita",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20after%0A%20%20before%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20after%0A%20%20before%20--%20Optional%20resource%20as%20data%2Fparams%20--%3E%20hook2(populateTagResource)%0A%20%20hook2%20--%20Tag%20resource%20as%20params%20--%3E%20hook3(addTagIfNew)%0A%20%20hook3%20--%20Created%20or%20patched%20tag%3Cbr%2F%3Eby%20recursive%20call%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20hook4(tagResource)%0A%20%20hook4%20--%20Updated%20resource%20--%3E%20after%0A%20%20before%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20hook5(%22updateOrgResource('tags')%22)%0A%20%20hook5%20--%20Updated%20tagged%20members%20--%3E%20after%0A%20%20before%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20hook6(%22updateOrgResource('tags')%22)%0A%20%20hook6%20--%20Updated%20tagged%20members%20--%3E%20after%0A%20%20before%20--%20Optional%20resource%20as%20query%2Fparams%20--%3E%20hook7(populateTagResource)%0A%20%20hook7%20--%20Tag%20resource%20as%20params%20--%3E%20hook8(removeTagIfUnused)%0A%20%20hook8%20--%20Removed%20or%20patched%20tag%3Cbr%2F%3Eby%20recursive%20call%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20hook9(untagResource)%0A%20%20hook9%20--%20Updated%20resource%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[r(" Loading... ")]),_:1})),y,(e(),t(l,null,{default:s(()=>[n(o,{id:"mermaid-373",class:"eita",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20after%0A%20%20before%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20after%20%20%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20before%20--%3E%20hook5(disallow)%0A%20%20hook5%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20after%0A%20%20before%20--%3E%20hook6(disallow)%0A%20%20hook6%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20after%0A%20%20before%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[r(" Loading... ")]),_:1})),C,(e(),t(l,null,{default:s(()=>[n(o,{id:"mermaid-404",class:"eita",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20hook1(disallow)%0A%20%20hook1%20---%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20after%0A%20%20before%20--%3E%20hook2(disallow)%0A%20%20hook2%20---%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20after%20%20%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20before%20--%3E%20hook3(disallow)%0A%20%20hook3%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20after%0A%20%20before%20--%3E%20hook4(disallow)%0A%20%20hook4%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20after%0A%20%20before%20--%3E%20hook5(disallow)%0A%20%20hook5%20---%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[r(" Loading... ")]),_:1})),g,(e(),t(l,null,{default:s(()=>[n(o,{id:"mermaid-432",class:"eita",graph:"graph%20TB%0A%20%20before%7B%22disallow('external')%22%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20after%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20before%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CCREATE%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[r(" Loading... ")]),_:1})),b,(e(),t(l,null,{default:s(()=>[n(o,{id:"mermaid-530",class:"eita",graph:"graph%20TB%0A%20%20before%7Bnone%20before%20all%7D%0A%20%20after%7Bnone%20after%20all%7D%0A%20%20before%20--%3E%20FIND%5BFIND%5D%0A%20%20FIND%20--%3E%20after%0A%20%20before%20--%3E%20GET%5BGET%5D%0A%20%20GET%20--%3E%20after%0A%20%20before%20--%3E%20CREATE%5BCREATE%5D%0A%20%20CREATE%20--%3E%20after%0A%20%20before%20--%3E%20UPDATE%5BUPDATE%5D%0A%20%20UPDATE%20--%3E%20hook1(%22updateOrgResource('groups')%22)%0A%20%20hook1%20--%20Updated%20authorization%3Cbr%2F%3Escopes%20on%20members%20--%3E%20after%0A%20%20before%20--%3E%20PATCH%5BPATCH%5D%0A%20%20PATCH%20--%3E%20hook2(%22updateOrgResource('groups')%22)%0A%20%20hook2%20--%20Updated%20authorization%3Cbr%2F%3Escopes%20on%20members%20--%3E%20after%0A%20%20before%20--%3E%20REMOVE%5BREMOVE%5D%0A%20%20REMOVE%20--%3E%20after%0A%20%20linkStyle%20default%20stroke-width%3A2px%2Cfill%3Anone%2Cstroke%3Ablack%0A%20%20classDef%20hookClass%20fill%3A%23f96%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20hook1%2Chook2%2Chook3%2Chook4%2Chook5%2Chook6%2Chook7%2Chook8%2Chook9%20hookClass%0A%20%20classDef%20operationClass%20fill%3A%239c6%2Cstroke%3A%23333%2Cstroke-width%3A2px%0A%20%20class%20FIND%2CGET%2CCREATE%2CUPDATE%2CPATCH%2CREMOVE%20operationClass%0A"})]),fallback:s(()=>[r(" Loading... ")]),_:1})),v])}const R=p(E,[["render",T]]);export{q as __pageData,R as default};
