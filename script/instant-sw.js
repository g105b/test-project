const CACHE_NAME = "php.gt/instant"

function log(message) {
	console.log(message)

	self.clients.matchAll({
		type: "window",
		includeUncontrolled: true,
	}).then(clients => {
		clients[0].postMessage(message)
	})
}

self.addEventListener("activate", function(event) {
	return self.clients.claim()
})

self.addEventListener("message", (event) => {
	if(event.data.type === "preload") {
		caches.open(CACHE_NAME).then(cache => {
			cache.add(event.data.payload.href).then(() => {
				log({
					response: event.data.id,
					type: "preload",
					payload: {
						href: event.data.payload.href,
						status: "complete",
					},
				})
			})
		})
	}
})

self.addEventListener("fetch", (event) => {
	if(event.request.destination === "document") {
		// Link clicked from browser
	}
	else {
		// Made from fetch/xhr
	}

	event.respondWith(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.match(event.request).then(response => {
// TODO: If the HTTP expires header is valid, don't re-cache.
// cache-control is the preferred header, it specifies how many seconds the cache is valid for.

				// TODO: if(response && cacheValid)
				if(response) {
					return response
				}

				log(`Making SW request to ${event.request.url}`)
				cache.add(event.request.url);
				return fetch(event.request.url);
			}) //TODO: .then( set a custom header which is THIS COMPUTER'S current timestamp )
			// which can be used in the invalidation phase above
		})
	)
})
