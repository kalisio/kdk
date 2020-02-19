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
    "revision": "d16294e253197f6d1391a71015843635"
  },
  {
    "url": "about/contact.html",
    "revision": "0e73367e5f4a12587f04405d3f18f56a"
  },
  {
    "url": "about/contributing.html",
    "revision": "1583829761375e377163a0948fae4e41"
  },
  {
    "url": "about/index.html",
    "revision": "afd15b970afc61281e89863d5d53c2ba"
  },
  {
    "url": "about/license.html",
    "revision": "e52ff5b83cd4385e6e188b5b44406fbb"
  },
  {
    "url": "about/roadmap.html",
    "revision": "5050fe8404112a2a0bbabd35321ee11a"
  },
  {
    "url": "api/index.html",
    "revision": "635c8c40fd03902a68c4b31a403c2bd8"
  },
  {
    "url": "api/kano/configuration.html",
    "revision": "b065fd5c98d6791cd9fd97b8833b5452"
  },
  {
    "url": "api/kano/index.html",
    "revision": "ab81264936858652858d84d55d7807e6"
  },
  {
    "url": "api/kbilling/components.html",
    "revision": "c15e8ca1efa8ae469ba8c35ff1bed29a"
  },
  {
    "url": "api/kbilling/hooks.html",
    "revision": "dda95f7c5489a513ef4f24a1ae502bfe"
  },
  {
    "url": "api/kbilling/index.html",
    "revision": "8f82b67739a343df61eeae4b2811d664"
  },
  {
    "url": "api/kbilling/mixins.html",
    "revision": "1124aec6ce81817a9bd2714490d78da7"
  },
  {
    "url": "api/kbilling/services.html",
    "revision": "bde7f09c2043fb0106d547414bcfd4ff"
  },
  {
    "url": "api/kcore/application.html",
    "revision": "a3310c81ad89dcba7ba541de86536a0c"
  },
  {
    "url": "api/kcore/components.html",
    "revision": "b0de4d3fe5e048f3551aabd21a0a1562"
  },
  {
    "url": "api/kcore/hooks.html",
    "revision": "54d0f65d0b46f9a8cb335c6c71e5c96a"
  },
  {
    "url": "api/kcore/index.html",
    "revision": "379aed267643c2f394879ac9f714a8d2"
  },
  {
    "url": "api/kcore/mixins.html",
    "revision": "d09cd6c6ab9e61dadfe384ac63f40f9d"
  },
  {
    "url": "api/kcore/services.html",
    "revision": "45185dac28b3b63aa1d2d28ae827586e"
  },
  {
    "url": "api/kevent/components.html",
    "revision": "d01310eb729d72aacfae035ff5545f76"
  },
  {
    "url": "api/kevent/hooks.html",
    "revision": "985db1c4848a24089f1dcbd9f3933e4d"
  },
  {
    "url": "api/kevent/index.html",
    "revision": "82b3d56fa25a4c8ca3db10190551cbbe"
  },
  {
    "url": "api/kevent/mixins.html",
    "revision": "4584f90a8b297e5596710734d5706c14"
  },
  {
    "url": "api/kevent/services.html",
    "revision": "373b2436e730ba4761bfa1f58a6bab83"
  },
  {
    "url": "api/kmap/components.html",
    "revision": "113138b6bbfc84a9597ff13470a64624"
  },
  {
    "url": "api/kmap/hooks.html",
    "revision": "6ad29a347ee0bed34bb898933dad3b55"
  },
  {
    "url": "api/kmap/index.html",
    "revision": "ffa5e007fcedd1bc66a45cd16a4b5af0"
  },
  {
    "url": "api/kmap/mixins.html",
    "revision": "c6aec74c0232cbd56485d8a412b0f47d"
  },
  {
    "url": "api/kmap/services.html",
    "revision": "76da20db88becc71a3bb959a22ed83b1"
  },
  {
    "url": "api/knotify/components.html",
    "revision": "4d20d91f39509fff6064305d29825f9c"
  },
  {
    "url": "api/knotify/hooks.html",
    "revision": "a546c892c08ae8b32d96955ec0c0605c"
  },
  {
    "url": "api/knotify/index.html",
    "revision": "ea1c32808221564709866e263d3db15e"
  },
  {
    "url": "api/knotify/mixins.html",
    "revision": "25ab1bfbdc1021c92d6e989ee53cdd08"
  },
  {
    "url": "api/knotify/services.html",
    "revision": "5cafe85fd34fd959a078a7e4366ab8a0"
  },
  {
    "url": "api/kteam/components.html",
    "revision": "f998a0572d6ae21c894eeade546fb9e9"
  },
  {
    "url": "api/kteam/hooks.html",
    "revision": "49d81ad0031b95bab8d76d6f25e3a53f"
  },
  {
    "url": "api/kteam/index.html",
    "revision": "075e238c4dc60ad8b3986e6385a1595a"
  },
  {
    "url": "api/kteam/mixins.html",
    "revision": "85a73a4b62a2755c681a3ac1ceeeab1e"
  },
  {
    "url": "api/kteam/services.html",
    "revision": "5e2089987a901b0878ea4c1696b2eb22"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "4dd04d6e2bf5c16ad035d276f8536522"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "89a3de836cb79b71008cca39c38c13ca"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "61f3c78211e76232dbe42e704e4111f3"
  },
  {
    "url": "architecture/index.html",
    "revision": "44e1d607b6ab9c35aa486039b5b16dcf"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "88504f847aa0d7a29aab699e6cad7e8f"
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
    "url": "assets/js/10.5e7337cb.js",
    "revision": "301f140f00d3daec971248465c85ef63"
  },
  {
    "url": "assets/js/11.1ec47cb4.js",
    "revision": "884ddbd3873dc6201b7a1e78c3209668"
  },
  {
    "url": "assets/js/12.f32f7602.js",
    "revision": "ecd81b2b00c3c9f32dfb2aba46c9ead8"
  },
  {
    "url": "assets/js/13.fe13f64f.js",
    "revision": "e3f2f029d235519d45a40b16b8e11551"
  },
  {
    "url": "assets/js/14.075b810d.js",
    "revision": "f00d25b91359f5f589f3d78e3c89fa8d"
  },
  {
    "url": "assets/js/15.de769027.js",
    "revision": "341a83a6dfeb1f6911a2e2b6ddd20ae7"
  },
  {
    "url": "assets/js/16.ed17ac66.js",
    "revision": "65b1561b78e99c33d54816b3d5e8a817"
  },
  {
    "url": "assets/js/17.58716682.js",
    "revision": "b0fd932ca9b28136a11a110a6c7d8fb4"
  },
  {
    "url": "assets/js/18.dd315581.js",
    "revision": "eb90f36036086fb19677374137e99e17"
  },
  {
    "url": "assets/js/19.42a7c4fe.js",
    "revision": "6029d50536e69d65b4360bdf5e9afd01"
  },
  {
    "url": "assets/js/2.8cf1d135.js",
    "revision": "5f7add8dff67a84530740000c26b3123"
  },
  {
    "url": "assets/js/20.a754b06e.js",
    "revision": "906f3611cdeb9af54244dd6cd4c58f40"
  },
  {
    "url": "assets/js/21.5867f600.js",
    "revision": "811a28aef9d4d95c88b73202408a7ce4"
  },
  {
    "url": "assets/js/22.5a0cc583.js",
    "revision": "680b60a7c3d06635295efa048b444daa"
  },
  {
    "url": "assets/js/23.28108f08.js",
    "revision": "bb45ed1bb1c82a904d7b4d3624c07d6b"
  },
  {
    "url": "assets/js/24.820e7f6b.js",
    "revision": "fcd336ddaea400d1f764c9b69a4e967b"
  },
  {
    "url": "assets/js/25.3c4998d8.js",
    "revision": "ce91ff08740fe03ce3159215a326f9df"
  },
  {
    "url": "assets/js/26.c4b211ed.js",
    "revision": "8410e52e37b893b30a22c741b7e809e5"
  },
  {
    "url": "assets/js/27.427f2258.js",
    "revision": "af9072cbd44ed234ca4616a7522924eb"
  },
  {
    "url": "assets/js/28.35c7f31f.js",
    "revision": "e8d3bfea5e81c7a89a13775c82fb2479"
  },
  {
    "url": "assets/js/29.465d685f.js",
    "revision": "4a3af21f99fcf5ac5c42a4d45a46d508"
  },
  {
    "url": "assets/js/3.370d931a.js",
    "revision": "c9bb941f3a559db18febcf295dafeda1"
  },
  {
    "url": "assets/js/30.6f82b0c5.js",
    "revision": "a71015c6bff60879086c1eb76b241356"
  },
  {
    "url": "assets/js/31.bbb0b84e.js",
    "revision": "54b06f0c44c161735cff2186184d3b70"
  },
  {
    "url": "assets/js/32.76f7d970.js",
    "revision": "5bef9dfe783fcc3628f8031a364654bd"
  },
  {
    "url": "assets/js/33.ed8bd5b1.js",
    "revision": "d533e0c70f9c28e491c047eb5dee47dd"
  },
  {
    "url": "assets/js/34.8f5623ec.js",
    "revision": "60db403bd4173a19ce82e16cd929a334"
  },
  {
    "url": "assets/js/35.dc5d7301.js",
    "revision": "64029f7f4c7464e1c066c21346ab2b35"
  },
  {
    "url": "assets/js/36.083ac90a.js",
    "revision": "fdbed8c9e7488af39cdbb41604b846df"
  },
  {
    "url": "assets/js/37.f2c99586.js",
    "revision": "447c8d3f98a79a2e7227a65ca2b8d4a7"
  },
  {
    "url": "assets/js/38.0a667010.js",
    "revision": "64096e5bd778b4d57d0dc045313a09e2"
  },
  {
    "url": "assets/js/39.c4a68bb4.js",
    "revision": "fd4f7071a85c5b195437269c2fe59f15"
  },
  {
    "url": "assets/js/4.1ef436b9.js",
    "revision": "9e2fb227bfeb97696846e1abf036c86c"
  },
  {
    "url": "assets/js/40.9d6c5bfb.js",
    "revision": "4c7d13f130068b9bab3846ed99dfd48a"
  },
  {
    "url": "assets/js/41.477f0861.js",
    "revision": "118e194e775928684bdb0d5ba7a362e0"
  },
  {
    "url": "assets/js/42.7406a78b.js",
    "revision": "cb42c55e5aa20ca050a388647b2965eb"
  },
  {
    "url": "assets/js/43.f25b565c.js",
    "revision": "e950fe4424005b9a6ba2d034e0ef0967"
  },
  {
    "url": "assets/js/44.9c9def67.js",
    "revision": "96a364914d031ca49a663c8b2a0f1e25"
  },
  {
    "url": "assets/js/45.486ce5a8.js",
    "revision": "2d756c3d820aa7f520daafc228941d18"
  },
  {
    "url": "assets/js/46.d103a9c1.js",
    "revision": "4c55bab6082b47ed98ee9509c7441832"
  },
  {
    "url": "assets/js/47.733122c5.js",
    "revision": "8f670a038c8c8e6e5d82a59b3fa1da32"
  },
  {
    "url": "assets/js/48.b024c6af.js",
    "revision": "7192e63979c3bfdf3e1d95524d6789e5"
  },
  {
    "url": "assets/js/49.20e271ff.js",
    "revision": "cc94bf0ae3d0adbb5fa54487a0aeaa59"
  },
  {
    "url": "assets/js/5.c8c1cb7b.js",
    "revision": "d48379d3cf0ee66070af11b50fc54c21"
  },
  {
    "url": "assets/js/50.fefd8cd0.js",
    "revision": "06bd0a856060c374d602db5819d49cd8"
  },
  {
    "url": "assets/js/51.fdd49ff4.js",
    "revision": "b9b82b3fcf7e36f26ce2263ec14d0f49"
  },
  {
    "url": "assets/js/52.96698ba8.js",
    "revision": "cd3a66ab7999bb090a545aa1859a6574"
  },
  {
    "url": "assets/js/53.f841af47.js",
    "revision": "5331e6f6aa3d0bae9c3e07dac4a88e2e"
  },
  {
    "url": "assets/js/54.2b08d223.js",
    "revision": "f87827d2c00c3305f4786c4cb9223234"
  },
  {
    "url": "assets/js/55.6e1301f2.js",
    "revision": "3cdb383c7f1e833721294661a725bd95"
  },
  {
    "url": "assets/js/56.67784edd.js",
    "revision": "b3278483514f571f5a6fa5c169df7c14"
  },
  {
    "url": "assets/js/57.2c0199cf.js",
    "revision": "19d94199b48b443c2331d41589020921"
  },
  {
    "url": "assets/js/58.8f2f205c.js",
    "revision": "a32c184235d64da7fec4ae9687861ee1"
  },
  {
    "url": "assets/js/59.2b7748c0.js",
    "revision": "e00b1c4a9387eac43dec19acc2efa5b3"
  },
  {
    "url": "assets/js/6.9ff0602d.js",
    "revision": "0aee18ca2862d9b085b8ec933a06bba3"
  },
  {
    "url": "assets/js/60.5ab60d5d.js",
    "revision": "a96b8be835c03a192c92d98aaecc3f99"
  },
  {
    "url": "assets/js/61.60cd746f.js",
    "revision": "54a55d9ee4efc316f5b8439a1165c7cb"
  },
  {
    "url": "assets/js/62.85e71c8f.js",
    "revision": "dd32ea25430c997fdbc5d6b6a91023c4"
  },
  {
    "url": "assets/js/63.d87acabc.js",
    "revision": "6190807dabce941eb7a81b2ea20b716a"
  },
  {
    "url": "assets/js/7.baf28946.js",
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
    "url": "assets/js/app.82ce3535.js",
    "revision": "e39ead567c0ab995bb970f66f54ce236"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "1d01a8cb04adc16eeda8d49a152f11c5"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "3ce6fe9137e4dce9fb1b6fda87a84f1a"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "f908509a2f3d4d43cf4dda0f99f982a4"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "5b28edeff6f08795f74a0870954853b7"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "805e21afb8726902403ae38527a004cc"
  },
  {
    "url": "guides/index.html",
    "revision": "2b863da52fd2172295394677955a9d93"
  },
  {
    "url": "index.html",
    "revision": "b9da1867c33456ac8d4efbe671811c84"
  },
  {
    "url": "tips.html",
    "revision": "b92296860879be5e82bc3afa1818795e"
  },
  {
    "url": "tools/browsers.html",
    "revision": "bfde41f444487749e3468626be015fb2"
  },
  {
    "url": "tools/cli.html",
    "revision": "982a19e9be046412ca2047c04f991cff"
  },
  {
    "url": "tools/documentation.html",
    "revision": "6a196308760ee9d94546a2b974af7f12"
  },
  {
    "url": "tools/index.html",
    "revision": "fd3c51634ddd096f1670f644f104cfd1"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "fdd02956fe8e6db1aedee02c34e8788c"
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
