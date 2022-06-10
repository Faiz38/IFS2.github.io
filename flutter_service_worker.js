'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "c4f49f28e30afcb0e9f5600dac751154",
"assets/assets/360_F_419149934_WSp3kO3EV5sRz72REbTG3C4qU3wag8F2.jpg": "15477312c8bd376a6da483630d01d681",
"assets/assets/506-5060451_smiley-clipart-apple-emoji-smile-hd-png-download.png": "e2e6a4f8bc503900051331fbbcb537cd",
"assets/assets/hand-icon-vector-21679703.jpg": "502e94be1371308cd66571ad2287dcf0",
"assets/assets/icons8-arrow-64.png": "f821f11ae6e4c49387f821fb1470eb5f",
"assets/assets/icons8-cherry-64.png": "f4ccdc832192ca0faf09e438d58a07c7",
"assets/assets/icons8-confused-53.png": "57c0aacae0ddbc97f9340d091ccaa081",
"assets/assets/icons8-happy.gif": "bc6a1bc2d324506e0d5a5a162a16ce43",
"assets/assets/icons8-kitchen-lamp-64.png": "5604ade99fbf04b2410dbd4c23520622",
"assets/assets/icons8-opinion-64.png": "f0fe4b0369efea58a2eb1e6f25a6a093",
"assets/assets/icons8-palm-scan.gif": "f28d99f09fa3d63608f603f6189d4880",
"assets/assets/icons8-palm-scan1.gif": "827b39df66cb2ad189c4af5e9af0b3ed",
"assets/assets/icons8-paper-towel-60.png": "bf79abd1b7bde842dd59c783c19942c8",
"assets/assets/icons8-sad.gif": "265ff0570fa750356b67ab34bdc1b43a",
"assets/assets/icons8-slippery-floor-100.png": "ba567ef4ad2aeddc1a6cc555b8fe9437",
"assets/assets/icons8-smelling-100.png": "d6ad4347b42440fe3c1042f209360b18",
"assets/assets/icons8-soap-dispenser-100.png": "723ea1740dc6802839e8b5c629f78340",
"assets/assets/icons8-toilet-paper-100.png": "cd0f1711fea8d8e0eb5637e54c0764aa",
"assets/assets/Screenshot_1.png": "4071ddba65791c832b239511ae044f99",
"assets/assets/Screenshot_2.png": "003b6c3adf8b318f9ec5dbdd2403a86f",
"assets/assets/Screenshot_3.png": "abe3b822465ce2ce12b5d1e2a65daf86",
"assets/assets/smilling%2520face.png": "29e264faad005cf4070890fe4de42cc3",
"assets/assets/wc-sign-icon-toilet-restroom-washroom-symbol-vector-29223814.jpg": "8cf249ca70e1ca292af30a7eb797a506",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "5d931b0934bb7e4729ddc65fb33ef1e0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "d82a1e71bf7773e0231692a2fe530e46",
"/": "d82a1e71bf7773e0231692a2fe530e46",
"main.dart.js": "3008b6f2ba7c37c5d09d3cf844bf0e37",
"manifest.json": "0b02bd9c0f8a2cb1c72860f759912964",
"version.json": "a5153c5f5890a4c76e35e9c34a2cbb49"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
