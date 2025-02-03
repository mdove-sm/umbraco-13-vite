import "../scss/modules.scss";
(async function () {
	console.log("HELLO MODULES");

	if (document.getElementById("mod1")) {
		import(`./modules/mod1.js`).then((module) => {
			module.default();
		});
	}

	if (document.getElementById("mod2")) {
		import(`./modules/mod2.js`).then((module) => {
			module.default();
		});
	}
})();
