// Todo: Rewrite without jQuery. I'm being super lazy.
( function ( $ ) {
	/**
	 * Check if an image is in the viewport
	 * @ignore
	 * @param {jQuery.Object} $el
	 * @return {Boolean} whether in the viewport or not.
	 */
	function isElementInViewport( $el ) {
		var rect = $el[0].getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= $( window ).height() &&
			rect.right <= $( window ).width()
		);
	}

	/**
	 * Check any images with the class pending to see if they are in view yet and if so
	 * force a load with a query string parameter.
	 * @ignore
	 */
	function checkImagesHandler() {
		$( 'img.pending' ).each( function () {
			var $img = $( this );
			if ( isElementInViewport( $img ) ) {
				// Note if you have images using a query string this method will not work
				$img.attr( 'src', $img.attr( 'data-src' ) ).removeClass( 'pending' );
			}
		} );
	}

	// If ServiceWorkers are installed and the experiment flag is on
	if ( 'serviceWorker' in navigator ) {
		navigator.serviceWorker.register( './worker.js' ).then( function ( reg ) {
			$( '.good-browser' ).show();
		}, function () {
			$( '.error' ).show();
		} );
		$( function () {
			// Mark all images in page that can be lazy loaded later.
			$( 'img' ).addClass( 'pending' );
			// In production you'll probably want to debounce this
			$( window ).on( 'resize scroll', checkImagesHandler );
			checkImagesHandler();
		} );
	} else {
		$( '.poop-browser' ).show();
	}
}( jQuery ) );
