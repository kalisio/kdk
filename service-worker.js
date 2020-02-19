/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "0e989a9828d775cddb7362f521c609ea"
  },
  {
    "url": "about/contact.html",
    "revision": "074382c46dac0d2fe7eaccee999cad9e"
  },
  {
    "url": "about/contributing.html",
    "revision": "eb8619917efcea81a4edb00c07d92e51"
  },
  {
    "url": "about/index.html",
    "revision": "e3142577a4dc0f79ea55be391a63a88e"
  },
  {
    "url": "about/license.html",
    "revision": "5c630560b7056547c3c3268a51c4451b"
  },
  {
    "url": "about/roadmap.html",
    "revision": "861d02117a1974a81537358f0bfa5a2a"
  },
  {
    "url": "api/index.html",
    "revision": "b27df894bde6c9854002f190f8eb9db3"
  },
  {
    "url": "api/kano/configuration.html",
    "revision": "043e60e7af5631469d1070badaaf49a5"
  },
  {
    "url": "api/kano/index.html",
    "revision": "18bf74b40daab3a1c8968ceb47a70020"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "bc57b8e366559394edfe01376e012095"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "1da7b16b21fb592dd1834ea52e42eca4"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "5e2ceadc35b7c72a52179c1e8c976393"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "12e6c235461d1f5a532c452a235933a7"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "89abddd51161abbb29937c8990a895de"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "35e3e8421f004262162889861b7ad2fa"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "01046412e2220f271a4416596e03755e"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "365e1981e4a6fa8caebe3dacbc1e965d"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "65dc6c78599bccf88a564c3d15929444"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "48d93d2ef3f7739ef1ec1d7cd6fb9e32"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "8f1dc225a6df857dd3763aa151922d55"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "c2c45b8970d4ebd53f858b0aba633d14"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "0f2a6af8c102f557e2c1fdd7207c26dc"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "4287618c9ef5e7fd39061fa3d41dc6ef"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "fe4a235152539444e590411a83959a91"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "bdb9918c8321ca6775bc983d78315214"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "f80718a74d2a77c5c680571a26d103ec"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "07d5cefdedc239f0d49a93b45998a25e"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "4e21271547dee92af930e6f68d92ac5c"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "a59a1813edc4a32100e2bfdea7e3e075"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "30b6fc87afcccf27de9984b52628b06d"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "59db688669073f82e4460c4ec0c88749"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "aea77d5d381bb118163423d6a0597eb3"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "66b4b09535c376dcdeb1bc3db10589fd"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "d722f06de51cf440ceff945736ee6728"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "1e19136eb428efee599778e17380f0e3"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "75c956bde6d2c148cf188ed7800b7183"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "c551479d54d3766f7780ee7f72089ccc"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "92e1f5e709cc342b3825e44c8747d48e"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "aad25dafb64e4c4907221075f6635f4e"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "627c4adf91182062cf337cc5ded3501e"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "9c67dffb8302b5a03c4ce9ca35ea1ebf"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "5f028c7d0739c660b3514449bca0ddb1"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "93bef5a4ab4743f2e52159f477863981"
  },
  {
    "url": "architecture/index.html",
    "revision": "cdb8ed7fcc98a1548de7cd52cc19aeb7"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "9a5eea261235b15293ea337aa1707f5c"
  },
  {
    "url": "assets/css/0.styles.1bc60b28.css",
    "revision": "dddc7c0257a7b9d7f4a81f34694ba431"
  },
  {
    "url": "assets/img/aggregated-feature-data-model.688823b1.png",
    "revision": "688823b1d38b25a2bf17ca95920def55"
  },
  {
    "url": "assets/img/aktnmap-layout.7dce3192.png",
    "revision": "7dce31929edd640a0491536514cbe7b9"
  },
  {
    "url": "assets/img/application-hooks.e15ca2e0.svg",
    "revision": "e15ca2e0e0ce1b30ac2716348e14cc33"
  },
  {
    "url": "assets/img/authorisations-hooks.223455bf.png",
    "revision": "223455bfff7bf51dddf7721b4a40d5f6"
  },
  {
    "url": "assets/img/catalog-data-model.998b319c.png",
    "revision": "998b319c85f0c564838fe6886a1aa5b3"
  },
  {
    "url": "assets/img/cd-pipeline.79fa1089.svg",
    "revision": "79fa1089efa2822bd40f57e6c9e6c20f"
  },
  {
    "url": "assets/img/component-view.de49f2d5.png",
    "revision": "de49f2d54005249f92b47c78e46776cc"
  },
  {
    "url": "assets/img/domain-model.0547d09f.svg",
    "revision": "0547d09ff803394e1f2d859c04728556"
  },
  {
    "url": "assets/img/editor-lifecycle.174bae43.png",
    "revision": "174bae432562fed4c258bc985253d0ac"
  },
  {
    "url": "assets/img/feature-data-model.de64ed49.png",
    "revision": "de64ed4936ffd7dc5ee67482f140cbba"
  },
  {
    "url": "assets/img/feature-hooks.c545f93a.png",
    "revision": "c545f93a07bb3da5d461aaf310813751"
  },
  {
    "url": "assets/img/global-architecture.62f2e9b2.svg",
    "revision": "62f2e9b23f59d325b00376982b49ea43"
  },
  {
    "url": "assets/img/groups-data-model.437e9630.svg",
    "revision": "437e963022b899ff09e989224a42ba90"
  },
  {
    "url": "assets/img/hooks-diagram-template.bf7579e1.png",
    "revision": "bf7579e1f6e36a2f9585242446149c20"
  },
  {
    "url": "assets/img/item-collections.59bf2c4c.png",
    "revision": "59bf2c4c802c8fc5c68c359ecfa95398"
  },
  {
    "url": "assets/img/kano-3D.65e359f9.png",
    "revision": "65e359f95783bb99097fc5b763ec4151"
  },
  {
    "url": "assets/img/kano-components.ad92b7e2.png",
    "revision": "ad92b7e2f4bf02c26bb9e24b67f19b11"
  },
  {
    "url": "assets/img/kano-iframe.635774e6.png",
    "revision": "635774e6d41e536e4a35188fed1c7e20"
  },
  {
    "url": "assets/img/kano-layout.702937a9.png",
    "revision": "702937a910e38ce3e140ae86cbfd5b3c"
  },
  {
    "url": "assets/img/kano-weather.2b6d4bbf.png",
    "revision": "2b6d4bbfa0992bbbbaae5745b2a7db4b"
  },
  {
    "url": "assets/img/layers-panel.def38fe5.png",
    "revision": "def38fe54ce12f8b11b1d523eeacbaec"
  },
  {
    "url": "assets/img/marker-cluster-2D.63ae3032.png",
    "revision": "63ae3032f9266059c3d95ccb402b0608"
  },
  {
    "url": "assets/img/marker-cluster-3D.e8927429.png",
    "revision": "e892742919b7d249bada3f31153e11fa"
  },
  {
    "url": "assets/img/organizations-data-model.0d40de04.svg",
    "revision": "0d40de04d4ac06c438ad08de62bdbf6b"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/img/storage-hooks.f7cd9bef.png",
    "revision": "f7cd9befe2f959dfbe39b009dcda2ea0"
  },
  {
    "url": "assets/img/tags-hooks.19298e57.png",
    "revision": "19298e5708cae740717b9063f3f8868c"
  },
  {
    "url": "assets/img/timeseries.370f7197.png",
    "revision": "370f7197130302dce62fdcd4d3be49ea"
  },
  {
    "url": "assets/img/users-data-model.e037f5f6.svg",
    "revision": "e037f5f6dd66241e355c8f7b559237e4"
  },
  {
    "url": "assets/img/users-hooks.506d5935.png",
    "revision": "506d59353934862bbe3bb0fb5210ffdc"
  },
  {
    "url": "assets/js/10.66c70130.js",
    "revision": "301f140f00d3daec971248465c85ef63"
  },
  {
    "url": "assets/js/11.ffd02718.js",
    "revision": "884ddbd3873dc6201b7a1e78c3209668"
  },
  {
    "url": "assets/js/12.d8a3decb.js",
    "revision": "ecd81b2b00c3c9f32dfb2aba46c9ead8"
  },
  {
    "url": "assets/js/13.b6a0dca6.js",
    "revision": "e3f2f029d235519d45a40b16b8e11551"
  },
  {
    "url": "assets/js/14.83103004.js",
    "revision": "f00d25b91359f5f589f3d78e3c89fa8d"
  },
  {
    "url": "assets/js/15.e8cb14b5.js",
    "revision": "341a83a6dfeb1f6911a2e2b6ddd20ae7"
  },
  {
    "url": "assets/js/16.d47a3498.js",
    "revision": "65b1561b78e99c33d54816b3d5e8a817"
  },
  {
    "url": "assets/js/17.9c63b253.js",
    "revision": "b0fd932ca9b28136a11a110a6c7d8fb4"
  },
  {
    "url": "assets/js/18.9c92b614.js",
    "revision": "eb90f36036086fb19677374137e99e17"
  },
  {
    "url": "assets/js/19.de281704.js",
    "revision": "d25b7ebffe65c606b5321f9db0204040"
  },
  {
    "url": "assets/js/2.5a02008f.js",
    "revision": "5f7add8dff67a84530740000c26b3123"
  },
  {
    "url": "assets/js/20.a754b06e.js",
    "revision": "906f3611cdeb9af54244dd6cd4c58f40"
  },
  {
    "url": "assets/js/21.d410e4f8.js",
    "revision": "811a28aef9d4d95c88b73202408a7ce4"
  },
  {
    "url": "assets/js/22.75760490.js",
    "revision": "680b60a7c3d06635295efa048b444daa"
  },
  {
    "url": "assets/js/23.a26d0cec.js",
    "revision": "bb45ed1bb1c82a904d7b4d3624c07d6b"
  },
  {
    "url": "assets/js/24.95619677.js",
    "revision": "fcd336ddaea400d1f764c9b69a4e967b"
  },
  {
    "url": "assets/js/25.3ab8c5bb.js",
    "revision": "ce91ff08740fe03ce3159215a326f9df"
  },
  {
    "url": "assets/js/26.9a3e58cd.js",
    "revision": "8410e52e37b893b30a22c741b7e809e5"
  },
  {
    "url": "assets/js/27.cd006a75.js",
    "revision": "af9072cbd44ed234ca4616a7522924eb"
  },
  {
    "url": "assets/js/28.4f2ca1a9.js",
    "revision": "e8d3bfea5e81c7a89a13775c82fb2479"
  },
  {
    "url": "assets/js/29.2dc91ed5.js",
    "revision": "4a3af21f99fcf5ac5c42a4d45a46d508"
  },
  {
    "url": "assets/js/3.f20e68ca.js",
    "revision": "c9bb941f3a559db18febcf295dafeda1"
  },
  {
    "url": "assets/js/30.ac9a41b8.js",
    "revision": "a71015c6bff60879086c1eb76b241356"
  },
  {
    "url": "assets/js/31.338c7f89.js",
    "revision": "54b06f0c44c161735cff2186184d3b70"
  },
  {
    "url": "assets/js/32.d583b226.js",
    "revision": "5bef9dfe783fcc3628f8031a364654bd"
  },
  {
    "url": "assets/js/33.da5e9c05.js",
    "revision": "d533e0c70f9c28e491c047eb5dee47dd"
  },
  {
    "url": "assets/js/34.df7f0661.js",
    "revision": "60db403bd4173a19ce82e16cd929a334"
  },
  {
    "url": "assets/js/35.683c001d.js",
    "revision": "64029f7f4c7464e1c066c21346ab2b35"
  },
  {
    "url": "assets/js/36.29bf74d8.js",
    "revision": "fdbed8c9e7488af39cdbb41604b846df"
  },
  {
    "url": "assets/js/37.e012cf59.js",
    "revision": "447c8d3f98a79a2e7227a65ca2b8d4a7"
  },
  {
    "url": "assets/js/38.ddddd7f2.js",
    "revision": "64096e5bd778b4d57d0dc045313a09e2"
  },
  {
    "url": "assets/js/39.49e6e1ad.js",
    "revision": "fd4f7071a85c5b195437269c2fe59f15"
  },
  {
    "url": "assets/js/4.61f7f1f4.js",
    "revision": "9e2fb227bfeb97696846e1abf036c86c"
  },
  {
    "url": "assets/js/40.b1ff9557.js",
    "revision": "4c7d13f130068b9bab3846ed99dfd48a"
  },
  {
    "url": "assets/js/41.6d1cb3c4.js",
    "revision": "118e194e775928684bdb0d5ba7a362e0"
  },
  {
    "url": "assets/js/42.746ced75.js",
    "revision": "cb42c55e5aa20ca050a388647b2965eb"
  },
  {
    "url": "assets/js/43.ec2148ea.js",
    "revision": "e950fe4424005b9a6ba2d034e0ef0967"
  },
  {
    "url": "assets/js/44.79a08e7f.js",
    "revision": "96a364914d031ca49a663c8b2a0f1e25"
  },
  {
    "url": "assets/js/45.da68ebc6.js",
    "revision": "2d756c3d820aa7f520daafc228941d18"
  },
  {
    "url": "assets/js/46.b35a4b2a.js",
    "revision": "4c55bab6082b47ed98ee9509c7441832"
  },
  {
    "url": "assets/js/47.c7d86c56.js",
    "revision": "8f670a038c8c8e6e5d82a59b3fa1da32"
  },
  {
    "url": "assets/js/48.f5947937.js",
    "revision": "7192e63979c3bfdf3e1d95524d6789e5"
  },
  {
    "url": "assets/js/49.2c4afce6.js",
    "revision": "cc94bf0ae3d0adbb5fa54487a0aeaa59"
  },
  {
    "url": "assets/js/5.ef0fb9e3.js",
    "revision": "d48379d3cf0ee66070af11b50fc54c21"
  },
  {
    "url": "assets/js/50.a413680d.js",
    "revision": "06bd0a856060c374d602db5819d49cd8"
  },
  {
    "url": "assets/js/51.36b5bc47.js",
    "revision": "b9b82b3fcf7e36f26ce2263ec14d0f49"
  },
  {
    "url": "assets/js/52.0d640114.js",
    "revision": "cd3a66ab7999bb090a545aa1859a6574"
  },
  {
    "url": "assets/js/53.faba1134.js",
    "revision": "5331e6f6aa3d0bae9c3e07dac4a88e2e"
  },
  {
    "url": "assets/js/54.da7bb675.js",
    "revision": "f87827d2c00c3305f4786c4cb9223234"
  },
  {
    "url": "assets/js/55.52c96378.js",
    "revision": "3cdb383c7f1e833721294661a725bd95"
  },
  {
    "url": "assets/js/56.60bf3e5d.js",
    "revision": "b3278483514f571f5a6fa5c169df7c14"
  },
  {
    "url": "assets/js/57.c827cf2e.js",
    "revision": "19d94199b48b443c2331d41589020921"
  },
  {
    "url": "assets/js/58.e7ef077c.js",
    "revision": "a32c184235d64da7fec4ae9687861ee1"
  },
  {
    "url": "assets/js/59.3e1eba9a.js",
    "revision": "e00b1c4a9387eac43dec19acc2efa5b3"
  },
  {
    "url": "assets/js/6.37b6127d.js",
    "revision": "0aee18ca2862d9b085b8ec933a06bba3"
  },
  {
    "url": "assets/js/60.1cd2b08e.js",
    "revision": "a96b8be835c03a192c92d98aaecc3f99"
  },
  {
    "url": "assets/js/61.35f403ea.js",
    "revision": "54a55d9ee4efc316f5b8439a1165c7cb"
  },
  {
    "url": "assets/js/62.33ccc611.js",
    "revision": "b9f9820be3678694b544dff1bfac624c"
  },
  {
    "url": "assets/js/63.d87acabc.js",
    "revision": "6190807dabce941eb7a81b2ea20b716a"
  },
  {
    "url": "assets/js/7.9411fea4.js",
    "revision": "4883a2818efd951afd8512400df3a93d"
  },
  {
    "url": "assets/js/8.6d13a580.js",
    "revision": "2d33e68c7d04be80307c20c2d95d55d4"
  },
  {
    "url": "assets/js/9.7f76fe0a.js",
    "revision": "0d37970e12c0788b8f7475bbdb1422fd"
  },
  {
    "url": "assets/js/app.d58460b3.js",
    "revision": "3561ab540977e4cb3681e04d15304cab"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "7fe08b066d4b3bd2160391961e34dbba"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "03bb9c0ad707fc5651840d3f2e4ba5c2"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "f8065cecbf1761378aec6f3844b7176e"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "d14a017630f332142855297199e37df9"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "d57eae9cffb434383cfc7cd55afe866c"
  },
  {
    "url": "guides/index.html",
    "revision": "e3fc2cf43c0effc66c3511234e1d6ec9"
  },
  {
    "url": "index.html",
    "revision": "f1e887c0e639330b3d527503c7a0dfa7"
  },
  {
    "url": "tips.html",
    "revision": "fa95aaf19c030eff32a289d586596bde"
  },
  {
    "url": "tools/browsers.html",
    "revision": "32f6fc9e86c415865e27fdc36e4921fe"
  },
  {
    "url": "tools/cli.html",
    "revision": "f0b00bbe02915e0967d43783ce8d099d"
  },
  {
    "url": "tools/documentation.html",
    "revision": "4642abefcd273163cfbdf07ad52170b4"
  },
  {
    "url": "tools/index.html",
    "revision": "c1b269de8b44cebb4e51c6c152642aa5"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "019927167a0d4f7a3da59a715144d6f4"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
