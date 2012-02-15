/*
 * jQuery UX Datebox @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://code.google.com/p/jquery-ux-forms/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *	jquery.ux.inputbox.js
 */



(function( $, undefined ) {
	$.widget('ux.datebox', $.ux.inputbox, {
		options: {
			icons: {
				primary: 'ui-icon-calendar'
			}
		},
		_create: function() {
			var self = this;

			//Call super._create()
			$.ux.inputbox.prototype._create.call(this);

			self.ux_element.bind({
				'mouseup.ux.datebox': function() {
					self.element.click();

					var widget = self.element.datepicker('widget');

					self.element.datepicker('dialog',
						new Date(),
						function(date, inst) {
							self.element.val(date);
							self.element.change();
						},
						{
							maxDate: '+0m +0d +0y',
							yearRange: '-100:+0',
							changeMonth: true,
							changeYear: true
						},
						[ // FIXME the y value needs to be adjusted for if the box pops above
							self.ux_element.offset().left + self.ux_element.outerWidth() - widget.outerWidth(),
							self.ux_element.offset().top + self.ux_element.outerHeight()
						]
					);
				}
			});
		},
		_destroy: function() {
			//Call super._destroy()
			$.ux.inputbox.prototype._destroy.call();

			this.ux_element.unbind('.ux.datebox');
		}
	});
})( jQuery );
