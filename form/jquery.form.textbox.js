/*
 * jQuery Form Textbox @VERSION
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
	$.widget('form.textbox', $.form.inputbox, {
		_create: function() {
			//Call super._create()
			this._super();

			this.label.remove();

			//Create the label and add it to the widget.
			this.label = this.element
				.addClass('ui-inputbox-text ui-textbox')
				.appendTo(this.ui_widget);

			//Because the super class inputbox is already listening for element
			//changes and the DOM element is part of this widget, change events
			//need to be stopped to prevent event bubbling.
			this.element.bind(
				'change.form.textbox', function(e) {
					e.stopPropagation();
				}
			);
		},
		_hideElement: function() {
			//Do Nothing
		},
		_showElement: function() {
			//Do Nothing
		},
		_destroy: function() {
			this.label
				.insertBefore(this.ui_widget);

			this.label = null;

			this.element
				.unbind('.form.textbox');

			//Call super._destroy()
			this._super();
		}
	});
})( jQuery );
