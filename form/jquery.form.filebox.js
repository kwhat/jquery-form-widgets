/*
 * jQuery Form Filebox @VERSION
 *
 * Copyright 2013, AUTHORS.txt
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

			self._on(self.ui_widget, {
				click: function() {
					self.element.click();
				}
			});
		},
		_hideElement: function() {
			//Apply some classes to the filebox to hide it.
			this.element
				.addClass('ui-filebox-input');
		},
		_showElement: function() {
			//Remove some classes to the filebox to hide it.
			this.element
				.removeClass('ui-filebox-input');
		},
		value: function() {
			//Return just the file name if a path exists.
			return this._super().match('[^\\\\/]*$')[0];
		}
	});
})( jQuery );
