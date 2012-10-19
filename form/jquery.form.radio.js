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
		},
		_select: function() {
			this._super();

			//Notify other radio buttons that a change occured.
			$('input[name=' + this.element.attr('name') + ']')
					.not(this.element)
					.change();
		}
	});
})( jQuery );
