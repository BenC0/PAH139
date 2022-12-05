/* Function to set a cookie. */
export function setCookie(cname, cvalue) {
	document.cookie = cname + "=" + cvalue + ";path=/";
}

/* function to retrieve a cookie value */
export function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

/* Function to delete a cookie. */
export function deleteCookie(cname, cvalue) {
	document.cookie = cname + "=0;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
}

/* Function to check a cookie exists */
export function checkCookie(cookieName = false) {
	/* If cookieName is not false and exists */
	if (!!cookieName) {
		/* Return result of getCookie not equal to an empty string */
		return getCookie(cookieName) !== "";
	}
}

/* Group functions together in `cookieHandler` object for exporting the module */
const cookieHandler = {
	"setCookie"		: setCookie,
	"getCookie"		: getCookie,
	"checkCookie"	: checkCookie,
	"deleteCookie"	: deleteCookie,
}

export default cookieHandler