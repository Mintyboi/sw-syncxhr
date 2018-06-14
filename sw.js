console.log("[sw.js] initialized!!!");

self.addEventListener('install', (event) => {
    console.log('[sw.js] installing…');
    self.skipWaiting();
});

var messages = [];
self.addEventListener('fetch', function (e) {
    console.log('fetch:' + e.request.url);
    var urlobj = new URL(e.request.url);

    console.log(urlobj.searchParams.get("user"));
    console.log(urlobj.searchParams.get("id"));
    
    if (urlobj.searchParams.get("action") === "timeout") {
        var result = (messages.length > 0) ? messages : null;
        // console.log("Gotten back results" + e);

        e.respondWith(new Promise(function (accept, reject) {
            setTimeout(function () {
                //  console.log("sw.js: sending back to worker.js msg:" + result + " length:" + messages.length);
                accept(new Response(result));
                //  messages = []; // Do not clear the messsages for now, it voids the result in worker.js!!!
            }, 1000);
        }));
    } else {
        e.respondWith(fetch(e.request));
    }
});

self.onmessage = function (event) {
    console.log("[sw.js] receive from syncxhr.html data:" + event.data);
    messages.push(event.data);
    console.log(messages.length);
}

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
    console.log("[sw.js] is activated!");
});