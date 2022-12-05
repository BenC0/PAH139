import variationCSS from "./progressBar.css";
import * as progressBarHTML from "./progressBar.html"

import hash from "./hash.js";
import peabody from "../genericFunctions/peabody.js"
import gaSendEvent from "../genericFunctions/gaSendEvent.js"
import cookieHandler from "../genericFunctions/cookieFunctions.js"
import watchForChange from "../genericFunctions/watchForChange.js"

export function trackNavigation(label, from, to) {
	gaSendEvent(window.peabody["pah139"]["variant"], `${label}: from ${from} to ${to}`, false)
}

export function getActiveStep(variant = true) {
	let activeStepEl = document.querySelector(`.${variant ? "variant": "original"} .petpro__indicator.active`)
	let activeStep = activeStepEl.getAttribute("data-indicator") || ""
	return activeStep
}

export function updateIndicator(targetStep) {
	let indicators = document.querySelectorAll(`.variant .petpro__indicator`)
	let variantBar = document.querySelector('.variant.progressBar')
	variantBar.setAttribute("currentStep", targetStep)
	indicators.forEach(indicator => {
		if (indicator.getAttribute('data-indicator') == targetStep) {
			indicator.classList.add('active')
		} else {
			indicator.classList.remove('active')
		}
	})
}

export function dropTempCookie(targetStep) {
	cookieHandler.setCookie('tempTargetStep', targetStep)
}

export function updateQuestion(targetStep) {
	let questions = document.querySelectorAll(`.petpro__qbox`)
	questions.forEach(question => {
		if (question.getAttribute('data-qbox') === targetStep.toString()) {
			question.style.display = "block"
		} else {
			question.style.display = "none"
		}
	})
}

export function isValidNavigationPath(from, to) {
	from = parseInt(from)
	to = parseInt(to)

	for (var i = from; i < to; i++) {
		QuestionsPageJS.validatePetLedForm(i)
		if (!QuestionsPageJS.validatePetLedForm(i)) {
			return {
				result: false,
				breakingStep: i
			}
		}
	}

	return {
		result: true
	}
}

export function fromSelectionToQuestion(targetStep, isLanding= false) {
	dropTempCookie(targetStep)
	let backBtn = document.querySelector('.btn.btn-petpro-back.petpro__qbox-btn--back')
	if (!!backBtn) {
		trackNavigation(`${ isLanding ? "Landing ": "" }Navigation Validation Success`, 6, targetStep)
		trackNavigation(`${ isLanding ? "Landing ": "" }Navigation`, 6, targetStep)
		backBtn.click()
	} else {
		trackNavigation(`${ isLanding ? "Landing ": "" }Navigation Validation Error(6)`, 6, targetStep)
	}
}

export function fromQuestionToSelection(isLanding = false) {
	let isValid = isValidNavigationPath(1, 6)
	if (!isValid.result) {
		trackNavigation(`${ isLanding ? "Landing ": "" }Navigation Validation Error(${isValid.breakingStep})`, getActiveStep(), 6)
		selectionNavigation(isValid.breakingStep, true)
	} else {
		trackNavigation(`${ isLanding ? "Landing ": "" }Navigation Validation Success`, getActiveStep(), 6)
		let submit5 = document.querySelector('.petpro__qbox--5 .btn.btn-petpro.petpro__qbox-btn.-js-next-q')
		if (!!submit5) {
			trackNavigation(`${ isLanding ? "Landing ": "" }Navigation`, getActiveStep(), 6)
			submit5.click()
		}
	}
}

export function selectionNavigation(targetStep, forceValid = false, isLanding = false) {
	let activeStep = getActiveStep()
	let isValid = forceValid
	if (!isValid) {
		if (parseInt(targetStep) > parseInt(activeStep)) {
			isValid = isValidNavigationPath(activeStep, targetStep)
		} else if (parseInt(targetStep) < parseInt(activeStep)) {
			isValid = { result: true }
		}
		if (!isValid.result) {
			trackNavigation(`${ isLanding ? "Landing ": "" }Navigation Validation Error(${isValid.breakingStep})`, activeStep, targetStep)
			targetStep = isValid.breakingStep
		} else {
			trackNavigation(`${ isLanding ? "Landing ": "" }Navigation Validation Success`, activeStep, targetStep)
		}
	}
	trackNavigation(`${ isLanding ? "Landing ": "" }Navigation`, activeStep, targetStep)
	targetStep = parseInt(targetStep)
	updateIndicator(targetStep)
	updateQuestion(targetStep)
	hash.set(targetStep)
}

export function changeActiveStep(targetStep, isLanding = false) {
	let activeStep = getActiveStep()
	if (activeStep != targetStep) {
		trackNavigation(`${isLanding ? "Landing ": ""}Navigation Attempt`, activeStep, targetStep)
		if (activeStep == "6" || targetStep == "6") {
			if (activeStep == "6") {
				fromSelectionToQuestion(targetStep, isLanding)
			} else if (targetStep == "6") {
				fromQuestionToSelection(isLanding)
			}
		} else {
			selectionNavigation(targetStep, false, isLanding)
		}
	}
}

export function addDummyBar() {
	let targetNode = document.querySelector('.petpro__form-container .petpro__indicator-panel:first-of-type')
	if (!!targetNode) {
		targetNode.classList.add('original')
		targetNode.insertAdjacentHTML('afterEnd', progressBarHTML)
		let activeStep = getActiveStep(false)
		let currentIndicator = document.querySelector(`.variant .petpro__indicator[data-indicator="${activeStep}"]`)
		currentIndicator.classList.add('active')
	}
}

export function getCurrentTitle(step) {
	return {
		"1": "Pet Name",
		"2": "Pet Type",
		"3": "Pet Breed",
		"4": "Pet Age",
		"5": "Pet Weight",
		"6": "Protection Type",
	}[step] || "Pet Name"
}

export function addTitle(step) {
	let targetNode = document.querySelector('.petpro__form-container')
	targetNode.insertAdjacentHTML('beforeBegin', `<div class="variant title">
		<h1>${getCurrentTitle(step) }</h1>
	</div>`)
}

export function updateTitle(step) {
	let titleEl = document.querySelector('.variant.title h1')
	titleEl.textContent = getCurrentTitle(step) 
}

export function init(title = false) {
	addDummyBar()
	let tempCookie = cookieHandler.checkCookie('tempTargetStep')
	if (tempCookie) {
		let activeStep = cookieHandler.getCookie('tempTargetStep')
		hash.set(activeStep)
		cookieHandler.deleteCookie("tempTargetStep")
	}
	let targetStep = hash.get()
	if (targetStep === "" || targetStep === "NaN") {
		let activeStep = getActiveStep(false)
		hash.set(activeStep)
	} else {
		changeActiveStep(targetStep, true)
	}

	let indicators = document.querySelectorAll('.variant .petpro__indicator')
	indicators.forEach(el => {
		el.addEventListener('click', e => {
			e.preventDefault()
			let step = e.currentTarget.getAttribute("data-indicator")
			trackNavigation("Indicator Click", getActiveStep(), step)
			changeActiveStep(step)
		})
	})

	let targetNode = document.querySelector(".original.petpro__indicator-panel")
	watchForChange(targetNode, _ => {
		let activeStep = getActiveStep(false)
		hash.set(activeStep)
	}, "progressBarObserver")

	if (title) {
		addTitle(targetStep)
		window.addEventListener("hashchange", e => {
			let theHash = hash.get()
			if (theHash == "") {
				theHash = hash.get(e.oldURL)
			}
			if (theHash != "") {
				updateTitle(theHash)
			}
		}, false)
		
	}
}

export const progressBar = {
	init,
}

export default progressBar