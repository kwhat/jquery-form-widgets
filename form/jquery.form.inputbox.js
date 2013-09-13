/*
 * jQuery Form Inputbox @VERSION
 *
 * Copyright 2013, AUTHORS.txt
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
			},
			change: $.noop,
			click: $.noop
		},
		_create: function() {
			var self = this,
				icons = this.options.icons;

			this._hideElement();

			//Create the inputbox widget.
			this.ui_widget = $('<div/>')
				.addClass('ui-widget ui-state-default ui-corner-all ui-inputbox')
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
					.click(function(event) {
						event.target = self.element;
						self.options.click(event);
					})
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

			//Watch this.element for events that need to be forwarded.
			this._on({
				change: function(event) {
					self.refresh();
					self.options.change(event);
				}
			});

			//Set some initial options.
			this._setOptions({
				'default': this.element.val(),
				'disabled': this.element.is(':disabled')
			});

			this.refresh();
		},
		_hideElement: function() {
			this.element.hide();
		},
		_showElement: function() {
			this.element.show();
		},
		value: function(value) {
			//Call this.element as a getter or a setter.
			var val = $.fn.val.apply(this.element, arguments);

			//If the value was set, make sure a change event is fired.
			if (value) {
				this.element.change();
			}

			return val;
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
		refresh: function() {
			this.label.text(this.value());
		},
		reset: function() {
			this.element.val(this.option('default'));
			this.refresh();
		},
		widget: function() {
			return this.ui_widget;
		}
	});
})( jQuery );
