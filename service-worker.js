const CACHE_NAME = 'image-generator-v5';
const urlsToCache = [
    './index.html',
    './style.css',
    './app.js',
    './imagegen.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    'https://cdn.jsdelivr.net/npm/web-txt2img@0.3.1/dist/index.js',
    'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js',
    'https://huggingface.co/schmuell/sd-turbo-ort-web/resolve/main/unet/model.onnx',
    'https://huggingface.co/schmuell/sd-turbo-ort-web/resolve/main/text_encoder/model.onnx',
    'https://huggingface.co/schmuell/sd-turbo-ort-web/resolve/main/vae_decoder/model.onnx'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    function(response) {
                        if (!response || response.status !== 200 && response.type === 'basic') {
                            return response;
                        }

                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});
