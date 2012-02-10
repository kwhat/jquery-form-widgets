/*
 * jQuery UX Filebox @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */
(function( $, undefined ) {
	$.widget('ux.filebox', $.ux.inputbox, {
		options: {
			icons: {
				primary: 'ui-icon-folder-collapsed'
			}
		},
		_create: function() {
			var self = this;

			//Call super._create()
			$.ux.inputbox.prototype._create.call(this);

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
			$.ux.inputbox.prototype._destroy.call();

			this.ux_element.unbind('.ux.filebox');
		}
	});
})( jQuery );
