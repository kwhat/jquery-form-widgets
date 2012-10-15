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
			icons: {
				primary: 'ui-icon-calendar'
			}
		},
		_create: function() {
			var self = this;

			//Call super._create()
			self._super();

			self.ux_element.bind({
				'mouseup.form.datebox': function() {
					//self.element.datepicker('show');
					self.element.datepicker(
						'dialog',
						new Date(self.val()),
						null,
						{
							'altField': self.element,
							onClose: function() {
								self.refresh();
							}
						},
						[
							self.ux_element.offset().left + self.ux_element.outerWidth() - self.element.datepicker('widget').outerWidth(),
							self.ux_element.offset().top + self.ux_element.outerHeight() - 1
						]
					);
				}
			});
		},
		_destroy: function() {
			//Call super._destroy()
			this._super();

			this.ux_element.unbind('.form.datebox');
		}
	});
})( jQuery );
