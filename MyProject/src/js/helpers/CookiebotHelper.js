export default function CookiebotHelper(id = "", config = {}) {
	// Check for ID
	if (!id) {
		console.error("CookiebotHelper requires an ID to be set");
		return;
	}

	// Merge options and defaults
	config = {
		renew: "[data-cookie-renew]",
		declartion: "[data-cookie-declaration]", // selectore for cookie declartion
		langs: [], // custom languge codes [["customCodeFromDoc", "codeExpectedByCbot"]]
		...config,
	};

	window.Cookiebot = window.Cookiebot || []; // Create blank Cookiebot var to prevent erros caused by slow loading
	// Track cookie bot script activation on site
	window.addEventListener(
		"CookiebotOnConsentReady",
		detectedCookieBot,
		false
	);
	window.addEventListener("CookiebotOnDialogInit", detectedCookieBot, false);

	// Add click event for renew buttons
	const $btns_renew = document.querySelectorAll(config.renew);
	if ($btns_renew) {
		$btns_renew.forEach(($btn_renew) => {
			$btn_renew.addEventListener("click", (e) => {
				e.preventDefault();
				window.Cookiebot.renew();
			});
		});
	}

	// Cookie Declaration
	const cookieDeclaration = document.querySelector(config.declartion);
	if (cookieDeclaration) {
		// console.log(cookieDeclaration);
		let script = document.createElement("script");
		script.type = "text/javascript";
		script.id = "CookieDeclaration";
		script.async = false;
		script.src = `https://consent.cookiebot.com/${id}/cd.js`;

		// Update culture from doc lang
		script.dataset.culture = document.documentElement.lang
			? customCultures(config.langs, document.documentElement.lang)
			: "en";

		cookieDeclaration.appendChild(script);
	}
}

// Look for custom cultures and return Cookiebot friendly culture code
function customCultures(langs = [], customLang = "") {
	let ret = null;
	langs.map((lang, i) => {
		if (customLang == lang[0]) {
			ret = lang[1];
		}
	});
	return ret;
}

// Apply a class tot he html tag
function detectedCookieBot() {
	document.getElementsByTagName("html")[0].classList.add("cookiebot");
}
