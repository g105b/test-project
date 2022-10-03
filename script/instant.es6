(function() {
	const preloadNodeList = document.querySelectorAll("[data-instant-preload]")
	const preloadQueue = []
	let activeSW = null
	let postMessage = null
	let swCallback = {}

	function init() {
		navigator.serviceWorker.register("/instant-sw.js")
			.then(registration => {
				registration.update()
				registration.onupdatefound = function() {
					console.log("SW updated")
					activeSW = registration.active
				}

				postMessage = (data, callback) => {
					data.id = Math.random().toString(16).slice(2)

					if(callback) {
						swCallback[data.id] = callback
					}
					activeSW && activeSW.postMessage(data)
				}

				if(registration.active) {
					activeSW = registration.active
				}
				instantReady()
			})
			.catch(err => {
				console.error("Registration failed:", err)
			})

		navigator.serviceWorker.onmessage = function(e) {
			if(e.data.response) {
				if(swCallback[e.data.response]) {
					swCallback[e.data.response](e.data)
				}
			}
			console.log("SW Message: ", e.data)
		}
	}

	function instantReady() {
		preloadNodeList.forEach(preload)
		preloadProcessQueue()
	}

	function preload(el) {
		if(!(el instanceof HTMLAnchorElement)) {
			el.querySelectorAll("a").forEach(preload)
			return
		}

		preloadQueue.push(el)
	}

	function preloadProcessQueue() {
		let el = preloadQueue.shift()
		if(!el) {
			return
		}


		let sessionStorageKey = `preload-${el.href}`
		if(sessionStorage[sessionStorageKey]) {
			preloadProcessQueue();
			return
		}
		sessionStorage[sessionStorageKey] = +(new Date())

		postMessage({
			type: "preload",
			payload: {
				href: el.href,
			}
		}, preloadProcessQueue)
	}

	init()
})()
