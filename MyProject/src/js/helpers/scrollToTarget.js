const globaloffset = parseInt(
	getComputedStyle(document.body)
		.getPropertyValue("--navbar-height")
		.replace("px")
);

export default function scrollToTarget($el, offset = 0, instant = false) {
	// get current scroll pos
	const currentPos = document.documentElement.scrollTop;

	// get el pos + offset
	const el_pos = $el.getBoundingClientRect().top + window.scrollY + offset;

	// Check scroll direction (if up add global nav bar offset)
	const newScrollPos = el_pos < currentPos ? el_pos - globaloffset : el_pos;

	// Only scroll if greater than given threshold
	if (Math.abs(currentPos - newScrollPos) > 150) {
		window.scrollTo({
			left: 0,
			top: newScrollPos,
			behavior: instant ? "instant" : "smooth",
		});
	}
}
