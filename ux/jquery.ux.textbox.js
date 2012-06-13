/*
 * jQuery UX Textbox @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://code.google.com/p/jquery-ux-forms/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *	jquery.ux.inputbox.js
 */
(function( $, undefined ) {
	$.widget('ux.textbox', $.ux.inputbox, {
		_create: function() {
			//Call super._create()
			$.ux.inputbox.prototype._create.call(this);

			this.label.remove();

			//Create the label and add it to the widget.
			this.label = this.element
				.addClass('ux-inputbox-text ux-textbox')
				.appendTo(this.ux_element);
		},
		_hideElement: function() {
			//Do Nothing
		},
		_showElement: function() {
			//Do Nothing
		},
		_destroy: function() {
			this.label
				.insertBefore(this.ux_element);

			this.label = null;

			this.ux_element
				.unbind('.ux.textbox');

			//Call super._destroy()
			$.ux.inputbox.prototype._destroy.call();
		}
	});
})( jQuery );
