(function() {
	const preloadNodeList = document.querySelectorAll("[data-instant-preload]");
	const preloadQueue = [];
	const preloadMap = new Map();
	let activeSW = null;
	let postMessage = null;
	let cache = null;

	let preloadUidCallbackObj = {};

	function init() {
		navigator.serviceWorker.register("/instant-sw.js")
			.then(registration => {
				registration.update();
				registration.onupdatefound = function() {
					console.log("SW updated");
					activeSW = registration.active;
				}

				postMessage = (data) => {
					activeSW && activeSW.postMessage(data);
				}

				if(registration.active) {
					activeSW = registration.active;
				}
				instantReady();
			})
			.catch(err => {
				console.error("Registration failed:", err);
			});

		navigator.serviceWorker.onmessage = function(e) {
				console.log("SW Message: ", e.data);
			};
	}

	function instantReady() {
		preloadNodeList.forEach(preload);
		preloadProcessQueue();
	}

	function preload(el) {
		if(!(el instanceof HTMLAnchorElement)) {
			el.querySelectorAll("a").forEach(preload);
			return;
		}

		preloadQueue.push(el);
		// let uid = Math.random().toString(16).slice(2);
		// preloadUidCallbackObj[uid] = el;
		// cache.add(el.href).then(() => {
		// 	console.log(`Cached ${el.href}`);
		// });
	}

	function preloadProcessQueue() {
		let el = preloadQueue.shift();
		if(!el) {
			return;
		}

		cache.match(el.href).then(response => {
			if(response === undefined) {
				console.log(`There's no response for ${el.href}`);
				// TODO: Make the request, cache.add the response
				return;
			}

			console.log(`Found response for ${el.href}`, response);
			console.log("DATE:" , response.headers.get("date"), response.headers, response.headers.get("expires"));
		});
	}

	caches.open("php.gt/instant").then(c => {
		cache = c;
		init();
	})
})();
