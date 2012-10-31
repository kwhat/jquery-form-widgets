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
				.addClass('ui-state-default ui-corner-all ui-checkbox');

			//Create the checkbox that will be placed in the widget
			this.icon = $('<a/>')
				.addClass('ui-icon ui-icon-empty')
				.appendTo(this.ui_widget);

			this.element
				//Add the graphical checkbox directly after the hidden checkbox.
				.after(this.ui_widget);

			//Watch this.element for changes.
			this._on({
				change: function(event) {
					//Do not fire a change request or call selected()!
					this._refresh();
				}
			});

			this._on(this.ui_widget, {
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
			//Display the checkbox's checked state
			if (this.selected()) {
				this.ui_widget
					.addClass('ui-state-active');

				this.icon
					.addClass(this.options.icons.selected)
					.removeClass(this.options.icons.deselected);
			}
			else {
				this.ui_widget
					.removeClass('ui-state-active');

				this.icon
					.addClass(this.options.icons.deselected)
					.removeClass(this.options.icons.selected);
			}
		},
		selected: function(state) {
			if (typeof state == 'boolean') {
				this.element.prop('checked', state);

				this._refresh();

				//Notify that a change occured.
				this._change({
					selected: this.selected(),
					value: this.val(),
					widget: this.widget()
				});
			}
			else {
				//Not calling the setter so just return the state.
				state = this.element.is(':checked');
			}

			return state;
		}
	});
})( jQuery );
