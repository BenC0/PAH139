export default function watchForChange(
		targetNode = null,
		callback = (mutationsList, observer) => { console.log(mutationsList, observer) },
		observationClass = "observing",
		config = { attributes: true, childList: true, subtree: true }
	) {
	if (targetNode !== null) {
		if (!targetNode.classList.contains(observationClass)) {
			const observer = new MutationObserver(callback);
			targetNode.classList.add(observationClass)
			observer.observe(targetNode, config);
		}
	}
}