/*
 * jQuery Form Datebox @VERSION
 *
 * Copyright 2012, AUTHORS.txt
 * Released under the MIT license.
 *
 * http://code.google.com/p/jquery-form-widgets/
 *
 * Depends:
 *	jquery.form.inputbox.js
 *	jquery.ui.datepicker.js
 */

(function( $, undefined ) {
	$.widget('form.datebox', $.form.inputbox, {
		options: {
			datepicker: {
				'altField': this.element
			},
			icons: {
				primary: 'ui-icon-calendar'
			}
		},
		_create: function() {
			//Call super._create()
			this._super();

			this._on(this.ui_widget, {
				click: 'dropdown'
			});
		},
		dropdown: function() {
		   //console.debug($.datepicker._dialogDatepicker);
		   var self = this;

			this.ui_widget.datepicker(
				'dialog',
				new Date(this.val()),
				function(date) {
					self.val(date);
					self._refresh();
				},
				this.options.datepicker,
				[	// FIXME this needs to account for displaying above the widget when there is no room.
					this.ui_widget.offset().left + this.ui_widget.outerWidth() - this.element.datepicker('widget').outerWidth(),
					this.ui_widget.offset().top + this.ui_widget.outerHeight() - 1
				]
			);
		}
	});
})( jQuery );
