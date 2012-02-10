/*
 * jQuery UX Textbox @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *		jquery.ux.element
 */
(function( $, undefined ) {
	$.widget('ux.textbox', $.ux.inputbox, {
		_create: function() {
			//Call super._create()
			$.ux.inputbox.prototype._create.call(this);

			this.label.remove();

			//Create the label and add it to the widget.
			this.label = this.element
				.addClass('ux-textbox')
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

			//Call super._destroy()
			$.ux.inputbox.prototype._destroy.call();
		}
	});
})( jQuery );
