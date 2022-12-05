export function set(step) {
	window.location.hash = step
	return window.location.hash
}

export function get(url = false) {
	let theHash = !url ? [window.location.hash] : (url.match(/#.*$/g) || ["1"])
	return theHash[0].replace("#", "")
}

export function handler() {
	let theHash = hash.get()
}

export const hash = {
	get,
	set,
	handler,
}

export default hash