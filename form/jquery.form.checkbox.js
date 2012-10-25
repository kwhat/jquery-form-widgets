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
					console.debug('change');
					this._refresh();

					this._change(event, {
						selected: this.selected(),
						value: this.val(),
						widget: this.widget()
					});
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
			//this.selected(this.selected());
			this.selected( this.element.is(':checked') );
		},
		selected: function(state) {
			if (state) {
				//FIXME This part is broken and causing refresh not to pain the checkbox...
				if (this.selected() != state) {
					//NOIFIY CHANGE!!!!
					if (state) {
						this._select();
					}
					else {
						this._deselect();
					}
				}

				this.element.prop('checked', state);
			}
			else {
				state = this.element.is(':checked');
			}

			return state;
		},
		_select: function() {
			this.ui_widget
					.addClass('ui-state-active');

				this.icon
					.addClass(this.options.icons.selected)
					.removeClass(this.options.icons.deselected);
		},
		_deselect: function() {
			this.ui_widget
					.removeClass('ui-state-active');

				this.icon
					.addClass(this.options.icons.deselected)
					.removeClass(this.options.icons.selected);
		}
	});
})( jQuery );
