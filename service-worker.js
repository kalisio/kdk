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
    "revision": "ee105c7e08149010fa0f424abd31adf0"
  },
  {
    "url": "about/contact.html",
    "revision": "d013befbd3e4815f965c42b3333ca9bc"
  },
  {
    "url": "about/contributing.html",
    "revision": "a42c1cc9092675f6160a817b7712d8f0"
  },
  {
    "url": "about/index.html",
    "revision": "4ed087d0e6f269c8cfeaa1f109edf596"
  },
  {
    "url": "about/license.html",
    "revision": "6fd299e087367e4fa462e1a394db2cce"
  },
  {
    "url": "about/roadmap.html",
    "revision": "83cf678986c5862b211aadc7d19f5d42"
  },
  {
    "url": "api/index.html",
    "revision": "fb9b2699862df9a89e10611e5b45b3c4"
  },
  {
    "url": "api/kano/configuration.html",
    "revision": "f85dc0803cfab9268963679b1ba24a47"
  },
  {
    "url": "api/kano/index.html",
    "revision": "ba4c5b81ba4d525c0ec012cedfba5160"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "36f00f030e357787bace62bfc821242b"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "6292d599f295a4102eca4ff9858df7b1"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "278082c09735fc27adb96839f9c6ba73"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "b96a8d088ddeaa81df457bfcb21a455d"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "05dfe67fc32025ed694cd392dc9ea493"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "a368e8d9a6706f02e4863c8708d5da24"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "6d1c27463595f28c02af7a4b578dcd5b"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "e3172afd0ab4702b225a4937bf2f4d8c"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "d80753a71b9770b1d71133787f3d66f4"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "434c205d65d265dd6bcfd744a7a75919"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "900769ebc82880f37e35401a80eabc1a"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "ee411b67c5be6284d2d6e4724d307c3b"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "d5cd4f347e45be963b39681291e82d22"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "07739daa8256303a74d8702c6dd5df5a"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "5ede36986351f28591160037e8ca29d7"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "62ac7583ff21040845f099f89e51553b"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "87e41481753daf7f5dd3e02f84b9abf9"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "0a4a7660ba2ae231d1bd680b8eaec55b"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "005bc1cf3f0d01fbb145fe428f407540"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "a21f08d112287f2ad27c283a1ea06ced"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "1ff4a3e633de7a93e14d35f16fe8358f"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "8928a697062e80ac54e6925f81fa1b8b"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "902d71129754ce501647efa5995ca741"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "f8d4de2d6fee8b57ce0169e880507ef1"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "9017c8c3cff678772d6b5d35557ef8d1"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "08f1674dd30340e1d3dd575710d6ed38"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "45ea20531b18667cf8f522593738aa31"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "c764f3e6637489e9aa64532bf8af88dc"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "d6a4fbd1f59a3360cc978d706493ec68"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "c199c492e067b18a2b0edb5fbd21a614"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "f6fd5ac1784910f88391aab36b4a2806"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "30c1187401ee16b7b5e8a1a24af4e7de"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "17a0cb3266c6ae0e6be3a27f2065027e"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "87e040b0076f04adfe8dcab7bb4bfd99"
  },
  {
    "url": "architecture/index.html",
    "revision": "bcd234cffa129f3713e488be47a82e9d"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "a2c5f41a43e7509f8ff4f30e5149ea73"
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
    "url": "assets/js/24.9b905883.js",
    "revision": "d526fc98e67dd775002dc637ae846ad3"
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
    "url": "assets/js/app.6baf2a96.js",
    "revision": "b2761bf8c77ec2adb525e52218376ed2"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "8213bacd739f4fe311c037c4f63bb510"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "54cb438735ed3250b9c97abe4fe99b5a"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "9d12b7d0cd66d41e106356f8228ae096"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "5f6456ad0b35514be58733ef801067c7"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "4d448321c3ed4ff6092d19b8906941c6"
  },
  {
    "url": "guides/index.html",
    "revision": "ea792e28a223b9fd067492d8baf374f6"
  },
  {
    "url": "index.html",
    "revision": "b168679a683700642dc77de9fc93d71b"
  },
  {
    "url": "tips.html",
    "revision": "fe6ddbadfe3bc71dda7fe32d90260d2f"
  },
  {
    "url": "tools/browsers.html",
    "revision": "6153b2bb77fe066856ab5c52a32eb65c"
  },
  {
    "url": "tools/cli.html",
    "revision": "c93eb120e9cbaea3c8658eab92203d2c"
  },
  {
    "url": "tools/documentation.html",
    "revision": "622a192373924fd88aafbc5f4774244b"
  },
  {
    "url": "tools/index.html",
    "revision": "65796b0ca56904abb768df3a374713f0"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "0df42035a780eab0fe1f790d6bd189e1"
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
