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
	$.widget('form.checkbox', {
		version: '@VERSION',
		defaultElement: '<input>',
		_create: function() {
			var self = this;

			//Create the widget
			this.ux_element = $('<div/>')
				.addClass('ui-state-default ui-corner-all ui-checkbox')
				//Add a click listener for the graphical checkbox.
				.bind({
					'mouseover.form.checkbox': function() {
						if (!self.element.is(':disabled')) {
							self.ux_element.addClass('ui-state-hover');
						}
					},
					'mouseout.form.checkbox': function() {
						if (!self.element.is(':disabled')) {
							self.ux_element.removeClass('ui-state-hover');
						}
					},
					'click.form.checkbox': function() {
						self.element.click();
					}
				});

			//Create the checkbox that will be placed in the widget
			this.icon = $('<a/>')
				.addClass('ui-icon ui-icon-empty')
				.appendTo(this.ux_element);

			this.element
				//Hide the checkbox.
				.addClass('ui-helper-hidden')
				//Watch the actual DOM checkbox for changes.
				.bind('change.ux.checkbox', function() {
					self.refresh();
					self.ux_element.change();
				})
				//Add the graphical checkbox directly after the hidden checkbox.
				.after(this.ux_element);
		},
		_init: function() {
			this._setOption('default', this.element.is(':checked'));
			this._setOption('checked', this.option('default'));
			this._setOption('disabled', this.element.is(':disabled'));

			this.refresh();
		},
		_destroy: function() {
			this.icon.remove();

			this.ux_element
				.unbind('.form.checkbox')
				.remove();

			this.element
				.unbind('.form.checkbox')
				.removeClass('ui-helper-hidden');
		},
		_setOption: function(key, value) {
			if (key === 'disabled') {
				if (value) {
					this.element
						.attr('disabled', 'disabled')
						.unbind('.form.checkbox');
				}
				else {
					this.element
						.removeAttr('disabled')
						.bind({
							'mouseover.form.checkbox': function() {
								if (!self.element.is(':disabled')) {
									self.ux_element.addClass('ui-state-hover');
								}
							},
							'mouseout.form.checkbox': function() {
								if (!self.element.is(':disabled')) {
									self.ux_element.removeClass('ui-state-hover');
								}
							}
						});
				}
			}

			//Call super._setOption
			this._super( "_setOption", key, value );
		},
		refresh: function() {
			//Display the checkbox's disabled state
			if (this.element.is(':disabled')) {
				this.ux_element
					.addClass('ui-state-disabled')
					.removeClass('ui-state-hover');
			}
			else {
				this.ux_element
					.removeClass('ui-state-disabled');
			}

			//Display the checkbox's checked state
			if (this.element.is(':checked')) {
				this.ux_element
					.addClass('ui-state-active');

				this.icon
					.addClass('ui-icon-check')
					.removeClass('ui-icon-empty');
			}
			else {
				this.ux_element
					.removeClass('ui-state-active');

				this.icon
					.addClass('ui-icon-empty')
					.removeClass('ui-icon-check');
			}
		},
		reset: function() {
			this.element.prop('checked', this.option('default'));
			this.refresh();
		},
		widget: function() {
			return this.ux_element;
		}
	});
})( jQuery );
