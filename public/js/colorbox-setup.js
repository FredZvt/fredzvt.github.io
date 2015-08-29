$(function() {

	$('a.colorbox').colorbox({maxWidth:'95%', maxHeight:'95%'});
	
	/* Colorbox resize function */
	var resizeTimer;
	function resizeColorBox()
	{
		if (resizeTimer) clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
				if ($('#cboxOverlay').is(':visible')) {
						$.colorbox.load(true);
				}
		}, 300)
	}

	// Resize Colorbox when resizing window or changing mobile device orientation
	$(window).resize(resizeColorBox);
	window.addEventListener("orientationchange", resizeColorBox, false);
	
});