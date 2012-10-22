/*
 * jQuery Form Inputbox @VERSION
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
	$.widget('form.inputbox', {
		version: '@VERSION',
		defaultElement: '<input>',
		options: {
			icons: {
				primary: null,
				secondary: null
			}
		},
		_create: function() {
			var self = this,
				icons = this.options.icons;

			this._hideElement();

			//Create the inputbox widget.
			this.ui_widget = $('<div/>')
				.addClass('ui-widget ui-state-default ui-corner-all ui-inputbox')
				.attr('title', this.element.attr('title') || '')
				.attr('tabindex', this.element.attr('tabindex') || '')
				.insertAfter(this.element);

			//Set the widget to hoverable
			this._hoverable(this.ui_widget);

			//Create the label and add it to the widget.
			this.label = $('<div/>')
				.addClass('ui-inputbox-text')
				.appendTo(this.ui_widget);

			if (icons.primary != null) {
				//Create padding on the left of the icon.
				this.ui_widget
					.addClass('ui-inputbox-text-icon-primary');

				//Create the icon.
				this.iconPrimary = $('<span/>')
					.addClass('ui-icon ' + icons.primary);

				//Create a wrapper around the icon so it can be centered.
				this.iconPrimaryWrapper = $('<span/>')
					.addClass('ui-state-default ui-inputbox-icon-primary')
					.append(this.iconPrimary)
					.appendTo(this.ui_widget);

				//Set the primary icon to hoverable
				this._hoverable(this.iconPrimaryWrapper);
			}

			if (icons.secondary != null) {
				//Create padding on the left of the icon.
				this.ui_widget
					.addClass('ui-inputbox-text-icon-secondary');

				//Create the icon.
				this.iconSecondary = $('<span/>')
					.addClass('ui-icon ' + icons.secondary);

				//Create a wrapper around the icon so it can be centered.
				this.iconSecondaryWrapper = $('<span/>')
					.addClass('ui-inputbox-icon-secondary')
					.append(this.iconSecondary)
					.appendTo(this.ui_widget);

				//Set the seconday icon to hoverable
				this._hoverable(this.iconPrimaryWrapper);
			}

			//Watch this.element for changes.
			this._on({
				change: function() {
					self.ui_widget.change();
				}
			});

			this._on(this.ui_widget, {
				change: this._refresh
			});

			//Set some initial options.
			this._setOptions({
				'default': this.element.val(),
				'disabled': this.element.is(':disabled')
			});

			this._refresh();
		},
		_hideElement: function() {
			this.element.hide();
		},
		_showElement: function() {
			this.element.show();
		},
		val: function() {
			//Call this.element as a getter or a setter.
			return $.fn.val.apply(this.element, arguments);
		},
		_destroy: function() {
			this.ui_widget.remove();
			this._showElement();
		},
		_setOption: function(key, value) {
			if (key === 'disabled') {
				if (value) {
					this.element.attr('disabled', 'disabled');
				}
				else {
					this.element.removeAttr('disabled');
				}
			}

			//Call super._setOption
			this._super(key, value);
		},
		_refresh: function() {
			this.label.text(this.val());
		},
		reset: function() {
			this.element.val(this.option('default'));
			this._refresh();
		},
		widget: function() {
			return this.ui_widget;
		}
	});
})( jQuery );
