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
    "revision": "766389e9078a6bb65bb2758f35cb8dad"
  },
  {
    "url": "about/contact.html",
    "revision": "20b2ee37a2e65e4967261548bfe4b519"
  },
  {
    "url": "about/contributing.html",
    "revision": "c6c60b7d13d5358a8aebc467e6008f3c"
  },
  {
    "url": "about/index.html",
    "revision": "1ef2851f2c3c5529cb982e5a5edbca77"
  },
  {
    "url": "about/license.html",
    "revision": "72eb97ca336669fd5d8651584cbd6547"
  },
  {
    "url": "about/roadmap.html",
    "revision": "d0087210d49fecdd1a527d41b2fbd16a"
  },
  {
    "url": "api/core/application.html",
    "revision": "ed53dfca597ea257613581ea6c0b8f14"
  },
  {
    "url": "api/core/components.html",
    "revision": "56f1f222b0e8a593999d931cdc5b5714"
  },
  {
    "url": "api/core/hooks.html",
    "revision": "2f9f7cea42df404dbaf72d788d058a8b"
  },
  {
    "url": "api/core/index.html",
    "revision": "4bfa29acbcf944d005a470bb818556d9"
  },
  {
    "url": "api/core/mixins.html",
    "revision": "4b6efa3f429f1f3df7872e7afec703d0"
  },
  {
    "url": "api/core/services.html",
    "revision": "291184c111d33f4c0a751fb5cc1e6372"
  },
  {
    "url": "api/index.html",
    "revision": "1dd88be10188c5cfd4b83170f7399030"
  },
  {
    "url": "api/map/components.html",
    "revision": "33d63a4642abd6edf47b3e15e304fbf1"
  },
  {
    "url": "api/map/hooks.html",
    "revision": "0373aaf13e5f6b24349455d9cc07ffbd"
  },
  {
    "url": "api/map/index.html",
    "revision": "59288dc3cf2f77d5ee1ef5453bfd563a"
  },
  {
    "url": "api/map/mixins.html",
    "revision": "5f6626116a31e3418b1695d5ed29b5bb"
  },
  {
    "url": "api/map/services.html",
    "revision": "acdca02b5e50046dacbc715d97edf08a"
  },
  {
    "url": "architecture/component-view.html",
    "revision": "2894599b17e4905d8b478af933e2d1a3"
  },
  {
    "url": "architecture/data-model-view.html",
    "revision": "4a9d463290479d90a2b9d836419782a0"
  },
  {
    "url": "architecture/global-architecture.html",
    "revision": "7b8d147465533b441a4a4f3a75704e73"
  },
  {
    "url": "architecture/index.html",
    "revision": "ed091adaac8313dddfcbfff44e4d52a8"
  },
  {
    "url": "architecture/main-concepts.html",
    "revision": "ff0fe646e7065212dc4ca0fe5c7c1320"
  },
  {
    "url": "assets/css/0.styles.be5e49f6.css",
    "revision": "fae068808c1c3a8f81a1b90be35d1766"
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
    "url": "assets/img/cd-pipeline-android.aac6a2e0.svg",
    "revision": "aac6a2e0ae4e0a08d62434fc4f9e700c"
  },
  {
    "url": "assets/img/cd-pipeline-app.f5ae4922.svg",
    "revision": "f5ae4922e9e2a5263b805ee8a1cd1779"
  },
  {
    "url": "assets/img/cd-pipeline-env.e2075fb1.svg",
    "revision": "e2075fb1bb069e7f46ea7f0a880df06b"
  },
  {
    "url": "assets/img/cd-pipeline-global.bf86d245.svg",
    "revision": "bf86d245695e16937bf9f6e08c38b0ad"
  },
  {
    "url": "assets/img/cd-pipeline-ios.b4f66a54.svg",
    "revision": "b4f66a5494f77e98899d44a066515ed0"
  },
  {
    "url": "assets/img/cd-pipeline-travis.5e40ee62.svg",
    "revision": "5e40ee62f8c213080bcd46106366ccbd"
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
    "url": "assets/img/kano-layout.702937a9.png",
    "revision": "702937a910e38ce3e140ae86cbfd5b3c"
  },
  {
    "url": "assets/img/kano-weather.2b6d4bbf.png",
    "revision": "2b6d4bbfa0992bbbbaae5745b2a7db4b"
  },
  {
    "url": "assets/img/kdk-workspace.d228efd0.png",
    "revision": "d228efd0427f5ee0027e9557bf11f9c8"
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
    "url": "assets/js/10.93a92c36.js",
    "revision": "cbe1295172933a91f31266eea14f2533"
  },
  {
    "url": "assets/js/11.81aa82d0.js",
    "revision": "6d3a2d298f47a8937a15a1e596dd8a95"
  },
  {
    "url": "assets/js/12.a5c8561f.js",
    "revision": "19af770094585849d5a12c638596522e"
  },
  {
    "url": "assets/js/13.87b25d90.js",
    "revision": "4b76d3ade1e0c68a6eebf4a9134999ef"
  },
  {
    "url": "assets/js/14.948cf861.js",
    "revision": "189716fec593c115d742ceddce526bff"
  },
  {
    "url": "assets/js/15.547ddd67.js",
    "revision": "a9c731d7f6037e5d35f963962cb38761"
  },
  {
    "url": "assets/js/16.0f7a0353.js",
    "revision": "3935c50b0aa6e56c3031fee043a00da8"
  },
  {
    "url": "assets/js/17.679d2804.js",
    "revision": "3eca56f5abe5a91773d02add2b6cbeb7"
  },
  {
    "url": "assets/js/18.47510013.js",
    "revision": "ac4e62640faf47235e5122d3870ff08c"
  },
  {
    "url": "assets/js/19.cb9c5d44.js",
    "revision": "ee5f308cee57a8628584568dd16242a7"
  },
  {
    "url": "assets/js/2.b6b1e5f6.js",
    "revision": "dccf2d97691fa7565f0de9a34c61a00e"
  },
  {
    "url": "assets/js/20.7c3f5b7f.js",
    "revision": "22174c21794587816b6923dc6f1b1d3c"
  },
  {
    "url": "assets/js/21.33304ee3.js",
    "revision": "119ee5d6bc02101a3911977191d2fbe8"
  },
  {
    "url": "assets/js/22.d9698293.js",
    "revision": "53d11eb2b62f527e7f3ac3d54c2c7629"
  },
  {
    "url": "assets/js/23.0f92e8c8.js",
    "revision": "a1cd6eef61d3862dcd31814ab55d1499"
  },
  {
    "url": "assets/js/24.fbf5b821.js",
    "revision": "fb7e49e8d63f00edd3986e2eb4c5b3dd"
  },
  {
    "url": "assets/js/25.c3637cba.js",
    "revision": "f491c0cf9570ee1a10e0e0ee9abd5bcd"
  },
  {
    "url": "assets/js/26.0465a379.js",
    "revision": "c3374c35b09bacc505ef3ea47fc854dc"
  },
  {
    "url": "assets/js/27.fe824156.js",
    "revision": "9462cd278897497233a51fb889745c50"
  },
  {
    "url": "assets/js/28.4bb691e9.js",
    "revision": "868a5bc57c1478f1ded259a75d1c866b"
  },
  {
    "url": "assets/js/29.2e649c50.js",
    "revision": "a0c5b27a5238f535eb03266f0436db9d"
  },
  {
    "url": "assets/js/3.90d7e4b4.js",
    "revision": "2794e71c5fff42d16980b60380c428ae"
  },
  {
    "url": "assets/js/30.50c64b45.js",
    "revision": "52de02c2549855f6bfff35ed95faba70"
  },
  {
    "url": "assets/js/31.e849e831.js",
    "revision": "a64a5c8e6b42aa95853960182ecc0cf9"
  },
  {
    "url": "assets/js/32.d528932a.js",
    "revision": "1f70bb649935f8fbf6b717f57d03fbb8"
  },
  {
    "url": "assets/js/33.20fe54a8.js",
    "revision": "2c7da6f4a5822f43b229c94ddbe1db9f"
  },
  {
    "url": "assets/js/34.4a5d1f34.js",
    "revision": "739016aa8b82edea18e4aab71a20b6ca"
  },
  {
    "url": "assets/js/35.000c15ec.js",
    "revision": "344cc04e951b9f6b6de61c6b094e97b0"
  },
  {
    "url": "assets/js/36.59b5063d.js",
    "revision": "4d8ccdf4c516b23ff59ed3819a341300"
  },
  {
    "url": "assets/js/37.898fef00.js",
    "revision": "170ae389db2293adc042bde60a81ba9a"
  },
  {
    "url": "assets/js/38.18781633.js",
    "revision": "0a9480f96e27232426ed655f6e59c3de"
  },
  {
    "url": "assets/js/39.c0b8cd54.js",
    "revision": "bae247b1c50407463b5c69397d41e9ca"
  },
  {
    "url": "assets/js/4.9b2aa8f1.js",
    "revision": "7b5ef58b06180fa8953a3f2b0001eee8"
  },
  {
    "url": "assets/js/40.9ec37978.js",
    "revision": "17a9706428da919a7b46b093c1ef20d8"
  },
  {
    "url": "assets/js/41.3959747d.js",
    "revision": "8c33c3c9c66a437a21e671f8c164ffb7"
  },
  {
    "url": "assets/js/5.5d65e049.js",
    "revision": "154447add5dd6bb9745642aec26fa4e0"
  },
  {
    "url": "assets/js/6.55f7ec7b.js",
    "revision": "6906af280bd1997835f954043d7d6d0f"
  },
  {
    "url": "assets/js/7.e08ea544.js",
    "revision": "b5ef1210fbcd3167f3f195f1d07943f1"
  },
  {
    "url": "assets/js/8.04e78328.js",
    "revision": "e919587d4ad3d4867e89a6392ede102e"
  },
  {
    "url": "assets/js/9.580734d2.js",
    "revision": "cd0eec6a2951c0fa29ddaff0aed59e10"
  },
  {
    "url": "assets/js/app.a3bb8b75.js",
    "revision": "f816a90e920b645c2c72da80340d7c79"
  },
  {
    "url": "guides/basics/step-by-step.html",
    "revision": "75dab4479bba0610cdec2e900af0a366"
  },
  {
    "url": "guides/development/configure.html",
    "revision": "c6b8b4939fec6319789e3dfc3e6554ad"
  },
  {
    "url": "guides/development/deploy.html",
    "revision": "88bd462d75eb7a2768df84acc84eeaf3"
  },
  {
    "url": "guides/development/develop.html",
    "revision": "df43429a72b0e4a532ba4a2b2bfdf471"
  },
  {
    "url": "guides/development/publish.html",
    "revision": "d8853df628241659d7f2327de1c45f55"
  },
  {
    "url": "guides/development/setup.html",
    "revision": "03def761a670b09a59f57c9c66a59220"
  },
  {
    "url": "guides/index.html",
    "revision": "82e8e064be41874caca029dd19b89863"
  },
  {
    "url": "index.html",
    "revision": "10e2a6e57ec73d9a69182f9d9f20d6d4"
  },
  {
    "url": "tips.html",
    "revision": "8d53715ab09014e56738abc856b71cd8"
  },
  {
    "url": "tools/browsers.html",
    "revision": "b3c99eb5f4b7f9373584f50adb2f1b7b"
  },
  {
    "url": "tools/cli.html",
    "revision": "434e7dc5d32ba561823ab331fee8fab5"
  },
  {
    "url": "tools/documentation.html",
    "revision": "f4b12209cd2d5abe6d674be80d3a7bd7"
  },
  {
    "url": "tools/index.html",
    "revision": "325c51a395c9e7d675bc35485bb511ed"
  },
  {
    "url": "tools/infrastructure.html",
    "revision": "f3364766391347e9b5f0baec36690f0c"
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
