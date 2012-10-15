/*
 * jQuery Form Filebox @VERSION
 *
 * Copyright 2012, AUTHORS.txt
 * Released under the MIT license.
 *
 * http://code.google.com/p/jquery-form-widgets/
 *
 * Depends:
 *	jquery.form.inputbox.js
 */

(function( $, undefined ) {
	$.widget('form.filebox', $.form.inputbox, {
		options: {
			icons: {
				primary: 'ui-icon-folder-collapsed'
			}
		},
		_create: function() {
			var self = this;

			//Call super._create()
			self._super();

			self.ux_element.bind({
				'mouseup.ux.filebox': function() {
					self.element.click();
				}
			});
		},
		_hideElement: function() {
			//Apply some classes to the filebox to hide it.
			this.element
				.addClass('ux-filebox-input');
		},
		_showElement: function() {
			//Remove some classes to the filebox to hide it.
			this.element
				.removeClass('ux-filebox-input');
		},
		val: function() {
			//Return just the file name if a path exists.
			return this.element.val().replace('\u00A0', '').match('[^\\\\/]*$')[0];
		},
		_destroy: function() {
			//Call super._destroy()
			self._super();

			this.ux_element.unbind('.ux.filebox');
		}
	});
})( jQuery );