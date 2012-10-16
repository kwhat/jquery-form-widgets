/*
 * jQuery Form Radio @VERSION
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
	//$.widget ('form.radio', $.form.checkbox, {
	$.widget ('form.radio', {
		version: '@VERSION',
		_create: function() {
			var self = this;

			//Create the widget
			this.ui_widget = $('<div/>')
				.addClass('ui-state-default ui-corner-all ui-radio')
				//Add a click listener for the graphical radio button.
				.bind({
					'mouseover.form.radio': function() {
						self.ui_widget.addClass('ui-state-hover');
					},
					'mouseout.form.radio': function() {
						self.ui_widget.removeClass('ui-state-hover');
					},
					'click.form.radio': function() {
						self.element.click();
					}
				});

			//Create the radio button that will be placed in the widget
			this.icon = $('<a/>')
				.addClass('ui-icon')
				.appendTo(this.ui_widget);

			//Set the correct button state.
			if (this.element.is(':checked')) {
				this.ui_widget.addClass('ui-state-active');
				this.icon.addClass('ui-icon-bullet');
			}
			else {
				this.icon.addClass('ui-icon-radio-off');
			}

			this.element
				//Hide the radiobutton.
				.addClass('ui-helper-hidden')
				//Watch the actual DOM checkbox for changes.
				.bind('change.form.radio', function() {
					self.refresh();
					self.ui_widget.change();
				})
				//Add the graphical radio button directly after the hidden radio button.
				.after(this.ui_widget);
		},
		_init: function() {
			this._setOption('default', this.element.is(':checked'));
			this._setOption('checked', this.option('default'));
			this._setOption('disabled', this.element.is(':disabled'));
		},
		_destroy: function() {
			this.icon.remove();

			this.ui_widget
				.unbind('.form.radio')
				.remove();

			this.element
				.unbind('.form.radio')
				.removeClass('ui-helper-hidden');
		},
		refresh: function() {
			//Display the checkbox's disabled state
			if (this.element.is(':disabled')) {
				this.ui_widget
					.addClass('ui-state-disabled')
					.removeClass('ui-state-default');
			}
			else {
				this.ui_widget
					.removeClass('ui-state-disabled')
					.addClass('ui-state-default');
			}

			//Display the radio button's checked state
			if (this.element.is(':checked')) {
				this.ui_widget
					.addClass('ui-state-active');

				this.icon
					.removeClass('ui-icon-radio-off')
					.addClass('ui-icon-bullet');

				var parent_form = this.element.closest('form');
				if (!parent_form.length) {
					parent_form = $(document);
				}
				parent_form
					.find(':radio[name="' + $(this.element).attr('name') + '"]')
					.not(this.element)
					.radio('refresh');
			}
			else {
				this.ui_widget
					.removeClass('ui-state-active');

				this.icon
					.addClass('ui-icon-radio-off')
					.removeClass('ui-icon-bullet');
			}
		},
		reset: function() {
			this.element.prop('checked', this.option('default'));
			this.refresh();
		},
		widget: function() {
			return this.ui_widget;
		}
	});
})( jQuery );
