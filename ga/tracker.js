if (window._gat && location.host === 'demos.flesler.com') {
	var pageTracker = _gat._getTracker("UA-2357772-4");

	// Basic initialization
	pageTracker._initData();
	pageTracker._trackPageview();
// Absolute URLs won't work without the custom domain
} else if (location.host === 'flesler.github.io') {
	location.href = location.href.replace('flesler.github.io/demos', 'demos.flesler');
}