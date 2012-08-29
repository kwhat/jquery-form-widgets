/*
 * jQuery UX Inputbox @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://code.google.com/p/jquery-ux-forms/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */
(function( $, undefined ) {
	$.widget('ux.inputbox', {
		version: '@VERSION',
		defaultElement: '<input>',
		options: {
			disabled: null,
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
			this.ux_element = $('<div/>')
				.addClass('ui-widget ui-state-default ui-corner-all ux-inputbox')
				.insertAfter(this.element);

			//Create the label and add it to the widget.
			this.label = $('<div/>')
				.addClass('ux-inputbox-text')
				.appendTo(this.ux_element);

			if (icons.primary != null) {
				//Create padding on the left of the icon.
				this.ux_element
					.addClass('ux-inputbox-text-icon-primary');

				//Create the icon.
				this.iconPrimary = $('<span/>')
					.addClass('ui-icon ' + icons.primary);

				//Create a wrapper around the icon so it can be centered.
				this.iconPrimaryWrapper = $('<span/>')
					.addClass('ui-state-default ux-inputbox-icon-primary')
					.append(this.iconPrimary)
					.appendTo(this.ux_element);
			}

			if (icons.secondary != null) {
				//Create padding on the left of the icon.
				this.ux_element
					.addClass('ux-inputbox-text-icon-secondary');

				//Create the icon.
				this.iconSecondary = $('<span/>')
					.addClass('ui-icon ' + icons.secondary);

				//Create a wrapper around the icon so it can be centered.
				this.iconSecondaryWrapper = $('<span/>')
					.addClass('ux-inputbox-icon-secondary')
					.append(this.iconSecondary)
					.appendTo(this.ux_element);
			}

			//Watch the actual DOM checkbox for changes.
			this.element.bind(
				'change.ux.inputbox', function(e) {
					self.refresh();
					self.ux_element.change();
				}
			);

			this.ux_element.bind({
				'mouseover.ux.inputbox': function() {
					//if (this.options.validation)
					self.ux_element.addClass('ui-state-hover');

					if (icons.primary != null) {
						self.iconPrimaryWrapper.addClass('ui-state-hover');
					}
				},
				'mouseout.ux.inputbox': function() {
					self.ux_element.removeClass('ui-state-hover');

					if (icons.primary != null) {
						self.iconPrimaryWrapper.removeClass('ui-state-hover');
					}
				}
			});

			//this.option(this.options);
		},
		_init: function() {
			this._setOption('default', this.element.val());
			this._setOption('disabled', this.element.is(':disabled'));

			this.refresh();
		},
		_hideElement: function() {
			this.element.hide();
		},
		_showElement: function() {
			this.element.show();
		},
		val: function() {
			return this.element.val();
		},
		_destroy: function() {
			this.ux_element.unbind('.ux.inputbox');

			this.label.remove();
			this.iconPrimary.remove();
			this.iconPrimaryWrapper.remove();
			this.iconSecondary.remove();
			this.iconSecondaryWrapper.remove();
			this.element.unwrap(this.ux_element);
			this.ux_element.remove();

			$.Widget.prototype.destroy.call(this);
		},
		refresh: function() {
			var text = this.val();

			if (text == '' && !this.element.is(this.label)) {
				text = this.option('defaultText');
				if (text == '' || text == null) {
					//Place a non-breaking space in the inputbox so it renders with a height.
					text = '\u00A0';
				}
			}

			//Add mouse over listeners to apply hover classes.
			if (this.option('disabled')) {
				this.ux_element.unbind('.ux.inputbox');
			}

			this.label.text(text);
		},
		reset: function() {
			this.element.val(this.option('default')).change();
		},
		widget: function() {
			return this.ux_element;
		}
	});
})( jQuery );
