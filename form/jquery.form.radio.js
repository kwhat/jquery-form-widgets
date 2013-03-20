/*
 * jQuery Form Radio @VERSION
 *
 * Copyright 2013, AUTHORS.txt
 * Released under the MIT license.
 *
 * http://code.google.com/p/jquery-form-widgets/
 *
 * Depends:
 *
 */

(function( $, undefined ) {
	$.widget ('form.radio', $.form.checkbox, {
		options: {
			icons: {
				selected: 'ui-icon-bullet',
				deselected: 'ui-icon-radio-off'
			}
		},
		_create: function() {
			this._super();

			//Watch this.element for changes.
			this._on({
				change: function(event) {
					//Make sure every radio button knows a change occured.
					$.each($('input[name=' + this.element.attr('name') + ']').not(this.element), function(index, value) {
						$(this).radio('selected', false);
					});
				}
			});
		}
	});
})( jQuery );
