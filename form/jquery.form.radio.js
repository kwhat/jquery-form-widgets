/*
 * jQuery Form Radio @VERSION
 *
 * Copyright 2012, AUTHORS.txt
 * Released under the MIT license.
 *
 * http://code.google.com/p/jquery-form-widgets/
 *
 * Depends:
 *
 */

(function( $, undefined ) {
	$.widget ('form.radio', $.form.checkbox, {
	//$.widget ('form.radio', {
		options: {
			icons: {
				selected: 'ui-icon-bullet',
				deselected: 'ui-icon-radio-off'
			}
		}
	});
})( jQuery );
