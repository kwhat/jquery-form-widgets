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
		options: {
			icons: {
				selected: 'ui-icon-bullet',
				deselected: 'ui-icon-radio-off'
			}
		},
		_change:function() {
			//Make sure every radio button knows a change occured.
			$('input[name=' + this.element.attr('name') + ']')
				.change();

			this._super();
		}
		/*
		_create: function() {
			this._super();

			this._off(this.ui_widget, 'click');
			this._on(this.ui_widget, {
				click: function() {
					this.element.click();


				}
			});
		}
		*/
	});
})( jQuery );
