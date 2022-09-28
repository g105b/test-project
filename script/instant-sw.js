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
	// if(event.data.type === "preload") {
	// 	caches.open("instant").then(cache => {
	// 		cache.add(event.data.payload.href).then(() => {
	// 			preloadUidMap[event.data.payload.href] = event.data.payload.uid
	// 		})
	// 	})
	// }
})

self.addEventListener("fetch", (event) => {
	if(event.request.destination === "document") {
		log(`Fetching ${event.request.url} (${event.request.method}) (${event.request.redirect})`)
	}

	event.respondWith(
		caches.open("php.gt/instant").then(function(cache) {
			return cache.match(event.request).then(response => {
// TODO: If the HTTP expires header is valid, don't re-cache.
// cache-control is the preferred header, it specifies how many seconds the cache is valid for.
				cache.add(event.request.url)

				// TODO: if(response && cacheValid)
				if(response) {
					return response
				}

				return fetch(event.request)
			}) //TODO: .then( set a custom header which is THIS COMPUTER'S current timestamp )
			// which can be used in the invalidation phase above
		})
	)
})
