/*
 * jQuery Form Checkbox @VERSION
 *
 * Copyright 2012, AUTHORS.txt
 * Released under the MIT license.
 *
 * http://code.google.com/p/jquery-form-widgets/
 *
 * Depends:
 *
 */

(function( $, undefined ) {
	$.widget('form.checkbox', $.form.inputbox, {
		options: {
			icons: {
				selected: 'ui-icon-check',
				deselected: 'ui-icon-empty'
			}
		},
		_create: function() {
			this._hideElement();

			//Create the widget
			this.ui_widget = $('<div/>')
				.addClass('ui-state-default ui-corner-all ui-selectbox')

			//Create the checkbox that will be placed in the widget
			this.icon = $('<a/>')
				.addClass('ui-icon ui-icon-empty')
				.appendTo(this.ui_widget);

			this.element
				//Add the graphical checkbox directly after the hidden checkbox.
				.after(this.ui_widget);

			//Watch this.element for changes.
			this._on({
				change: function() {
					this.ui_widget.change();
				}
			});

			this._on(this.ui_widget, {
				change: this._refresh,
				click: function() {
					this.element.click();
				}
			});

			//Set some initial options.
			this._setOptions({
				'default': this.element.is(':checked'),
				'checked': this.element.is(':checked'),
				'disabled': this.element.is(':disabled')
			});

			this._refresh();
		},
		_refresh: function() {
			var icos = this.options.icons,
				ico_check = icos.selected,
				ico_empty = icos.deselected;

			//Display the checkbox's checked state
			if (this.element.is(':checked')) {
				this.ui_widget
					.addClass('ui-state-active');

				this.icon
					.addClass(ico_check)
					.removeClass(ico_empty);
			}
			else {
				this.ui_widget
					.removeClass('ui-state-active');

				this.icon
					.addClass(ico_empty)
					.removeClass(ico_check);
			}
		}
	});
})( jQuery );
