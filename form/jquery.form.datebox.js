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

			self.ui_widget.bind({
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
							self.ui_widget.offset().left + self.ui_widget.outerWidth() - self.element.datepicker('widget').outerWidth(),
							self.ui_widget.offset().top + self.ui_widget.outerHeight() - 1
						]
					);
				}
			});
		},
		_destroy: function() {
			//Call super._destroy()
			this._super();

			this.ui_widget.unbind('.form.datebox');
		}
	});
})( jQuery );
