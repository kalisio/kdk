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

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "_old_/guides/DEPLOY.html",
    "revision": "115e1fc31f6473bd450018350eea718d"
  },
  {
    "url": "_old_/guides/guides/DEPLOY.html",
    "revision": "d6acb38aabaa1cf3bd11ea167fb67030"
  },
  {
    "url": "404.html",
    "revision": "e8c4a7baa18c70885cb3137c94698fd0"
  },
  {
    "url": "about/introduction.html",
    "revision": "b491101a068892de5f066fc0eafe51dc"
  },
  {
    "url": "about/license.html",
    "revision": "cc665842e099bf53d2f438d959c54f97"
  },
  {
    "url": "about/roadmap.html",
    "revision": "e90b66b9ecb8b8323112c3514e6763c5"
  },
  {
    "url": "assets/css/0.styles.c934418d.css",
    "revision": "18309ff288b175bd55a7ee313c41f97b"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.88396eb5.js",
    "revision": "024ed880b363ac802b6e46e2dbe64891"
  },
  {
    "url": "assets/js/11.4a20fb4c.js",
    "revision": "ddb2bca06000895b8b2aa70201a40585"
  },
  {
    "url": "assets/js/12.46010239.js",
    "revision": "049db37a97d1e91ed34907c00fa16ac6"
  },
  {
    "url": "assets/js/13.9e4a2558.js",
    "revision": "4c45ddc962ad0e9ccd1aacfcae4380c9"
  },
  {
    "url": "assets/js/14.c547f725.js",
    "revision": "d2b23acf423bcb473a08a5763066f63e"
  },
  {
    "url": "assets/js/15.789421de.js",
    "revision": "cee3e1416b8458bae0b036aab7d6ecb9"
  },
  {
    "url": "assets/js/16.d1ec927e.js",
    "revision": "df37f51c2f0e61f24799bb994f0b1c31"
  },
  {
    "url": "assets/js/17.abfd2da6.js",
    "revision": "91f63889f7e03c9b21df2c56f3eb7fb9"
  },
  {
    "url": "assets/js/18.9adffba3.js",
    "revision": "9aef12701809f5f436a54437f0bc9183"
  },
  {
    "url": "assets/js/2.5aa537bf.js",
    "revision": "c912d2e93a77975f67d618bcfe7445b1"
  },
  {
    "url": "assets/js/3.31d62cbf.js",
    "revision": "ae14af1a3e4ce796f8425d0687490a04"
  },
  {
    "url": "assets/js/4.838ad483.js",
    "revision": "c1c708a717f550930066aade5d6ac4b1"
  },
  {
    "url": "assets/js/5.e9f13824.js",
    "revision": "019b3c927fb28457e51fdf773c0c16fe"
  },
  {
    "url": "assets/js/6.56add541.js",
    "revision": "898840e673181d99952dd6d91a087c7d"
  },
  {
    "url": "assets/js/7.9c598c12.js",
    "revision": "4065fdde6321cccda1652cf35d5328a7"
  },
  {
    "url": "assets/js/8.fcaa0820.js",
    "revision": "b7deb513e06d749547ff01ddb233810b"
  },
  {
    "url": "assets/js/9.c903ca2f.js",
    "revision": "1ee9961fd154afe30cd8a0fef5efed1b"
  },
  {
    "url": "assets/js/app.1d706e3e.js",
    "revision": "d0c4a19a4823a23b412f73a5790dd4cd"
  },
  {
    "url": "CONTRIBUTING.html",
    "revision": "bd7346ab66145dee3cfcaef115f6c43d"
  },
  {
    "url": "development/architecture.html",
    "revision": "381929978531ff0288d8f20c4f92a95b"
  },
  {
    "url": "index.html",
    "revision": "36dde45573e5c445f5f788c868bc4dc7"
  },
  {
    "url": "LICENSE.html",
    "revision": "6ec965c6730a1388a5e6289f066aa76f"
  },
  {
    "url": "modules/kbilling.html",
    "revision": "827d1cde0ab714d01aff032bcad749c7"
  },
  {
    "url": "modules/kcore.html",
    "revision": "e83c117c1a1490d2c5a8120d6f7bb67b"
  },
  {
    "url": "modules/kevent.html",
    "revision": "0023cb7b08de50aa1024e6301b02aff6"
  },
  {
    "url": "modules/kmap.html",
    "revision": "a3f5112c61a557184c7f81114ad3bc3e"
  },
  {
    "url": "modules/knotify.html",
    "revision": "944a9140528ce3243bd8d7a60019e581"
  },
  {
    "url": "modules/kteam.html",
    "revision": "6d176ee247799147e00841aaf2d277ff"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
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
