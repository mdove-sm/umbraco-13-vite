import Player from "@vimeo/player";

export default function loadVideo(url, link, $player, callback) {
	let playerId = "player_" + Math.floor(Math.random() * 100 + 1);
	let playerHost = url.indexOf("vimeo") != -1 ? "vimeo" : "yt";

	// prettier-ignore
	var iframeHTML = `
		<iframe sandbox="allow-scripts allow-same-origin" id="${playerId}" src="${url}&playsinline=0${!Cookiebot?.consent?.statistics ? "&dnt=1" : ""}" frameborder="0" allow="autoplay; fullscreen" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
	`;

	checkPrivacy(url, $player, callback);

	function checkPrivacy(url, $player, callback) {
		switch (playerHost) {
			case "vimeo":
				if (!Cookiebot?.consent?.preferences) {
					// console.log("VIM FAIL");
					showPrivacy(link, $player, true, false, callback);
				} else {
					// console.log("VIM PASS");
					createVimeo(url, $player, callback);
				}
				break;
			case "yt":
				if (
					!Cookiebot?.consent?.preferences ||
					!Cookiebot?.consent?.marketing
				) {
					// console.log("YT FAIL");
					showPrivacy(link, $player, true, true, callback);
				} else {
					// console.log("YT Pass");
					createYT(url, $player, callback);
				}
				break;
		}
	}

	function createYT(url, $player, callback) {
		window.dataLayer = window.dataLayer || [];
		// console.log(iframeHTML);
		$player.innerHTML = iframeHTML;

		const $iframe = $player.querySelector("iframe");

		if (!window.ytReady) {
			window.dataLayer.push({
				event: "videoYouTubeInit",
			});
			window.ytReady = true;
		}

		if (callback) callback();
	}

	function createVimeo(url, $player, callback) {
		window.dataLayer = window.dataLayer || [];
		$player.innerHTML = iframeHTML;

		let player = new Player($player.querySelector("iframe"));
		let title = "N/A";

		player
			.getVideoTitle()
			.then(function (t) {
				title = t;
			})
			.catch(function (error) {
				title = url;
			});
		const percentages = [25, 50, 75, 100];
		const percentagesReached = [];

		player.on("play", function (data) {
			if (data == undefined) return;

			window.dataLayer.push({
				event: "videoUpdate",
				action: "Start playing",
				title: title,
			});
			// console.log(window.dataLayer);
		});

		player.on("timeupdate", function (data) {
			let currentPercent = Math.ceil(data.percent * 100);
			for (var i = 0; i < percentages.length; i++) {
				if (
					currentPercent >= percentages[i] &&
					!percentagesReached.includes(percentages[i])
				) {
					percentagesReached.push(percentages[i]);
					window.dataLayer.push({
						event: "videoUpdate",
						action:
							currentPercent == 100
								? "Reached the end"
								: "Reached " + currentPercent + "%",
						title: title,
						video_percent: currentPercent,
					});
					// console.log(window.dataLayer);
				}
			}
		});

		if (callback) callback();
	}

	function showPrivacy(
		link,
		$player,
		preferences = true,
		marketing = false,
		callback
	) {
		// console.log("showPrivacy()");
		// prettier-ignore
		const linkShort =
			playerHost == "vimeo" ? link.split("?")[0] : link.split("&")[0];
		const msg = `
			<p>You must accept <a href="javascript: Cookiebot.renew()">${
				preferences ? "preference" : ""
			}${preferences && marketing ? " and " : ""}${
			marketing ? "marketing" : ""
		} cookies</a> and refresh your browser to view this video.</p>
			<p>View the video at it's source: <a href="${link}" target="_blank" aria-label="View the video at it's source: ${linkShort} - Opens in a new window">${linkShort}</a></p>
		`;
		$player.innerHTML = `
			<div class="video__privWarn">
				<svg width="50" height="46" viewBox="0 0 50 46" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M21.2945 2.16198C22.0576 0.808436 23.4383 0 25.0008 0C26.5634 0 27.9442 0.808494 28.7072 2.16198L49.4549 39.08C50.1907 40.379 50.1816 41.9687 49.4276 43.2497C48.6645 44.5669 47.2839 45.3481 45.7575 45.3481H4.25048C2.72434 45.3481 1.35266 44.5668 0.580383 43.2497C-0.182686 41.9506 -0.191772 40.3881 0.544048 39.08L21.2945 2.16198ZM3.58957 41.4869C3.72583 41.7231 3.98018 41.8684 4.24362 41.8593H45.7584C46.0219 41.8684 46.2762 41.7231 46.4125 41.4869C46.5397 41.2689 46.5397 41.0054 46.4216 40.7874L25.6642 3.86943C25.4734 3.52424 25.1373 3.48789 25.001 3.48789C24.8648 3.48789 24.5286 3.52422 24.3379 3.86943L3.58047 40.7874C3.40788 41.0963 3.5078 41.3506 3.58957 41.4869ZM26.7442 27.3247V13.3715C26.7442 12.4085 25.963 11.6273 25 11.6273C24.0371 11.6273 23.2559 12.4085 23.2559 13.3715V27.3247C23.2559 28.2877 24.0371 29.0689 25 29.0689C25.963 29.0689 26.7442 28.2877 26.7442 27.3247ZM22.6745 35.4641C22.6745 36.745 23.7192 37.7897 25 37.7897C26.2809 37.7897 27.3256 36.745 27.3256 35.4641C27.3256 34.1833 26.2809 33.1386 25 33.1386C23.7192 33.1386 22.6745 34.1833 22.6745 35.4641Z" fill="white" style="fill:white;fill-opacity:1;"/>
				</svg>
				${msg}
			</div>
		`;
		if (callback) callback();
		window.addEventListener(
			"CookiebotOnAccept",
			() => {
				checkPrivacy(url, $player, callback);
			},
			{ once: true },
			false
		);
	}
}
