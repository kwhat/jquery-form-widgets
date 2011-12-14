/*
 * jQuery UX Radio @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *		
 */
(function( $, undefined ) {
	$.widget ('ux.radio', {
		version: '@VERSION',
		_create: function() {
			var self = this;
			
			//Create the widget
			this.ux_element = $('<a/>')
				.addClass('ui-state-default ui-corner-all ux-radio')
				//Add a click listener for the graphical radio button.
				.bind({
					'mouseover.ux.radio': function() {
						self.ux_element.addClass('ui-state-hover');
					},
					'mouseout.ux.radio': function() {
						self.ux_element.removeClass('ui-state-hover');
					},
					'click.ux.radio': function() {
						self.element.click();
					}
				});
			
			//Create the radio button that will be placed in the widget
			this.icon = $('<a/>')
				.addClass('ui-icon ui-icon-radio-off')
				.appendTo(this.ux_element);

			this.element
				//Hide the radiobutton.
				.addClass('ui-helper-hidden')
				//Watch the actual DOM checkbox for changes.
				.bind('change.ux.radio', function() {
					self.refresh();
				})
				//Add the graphical radio button directly after the hidden radio button.
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
				.unbind('.ux.radio')
				.remove();
			
			this.element
				.unbind('.ux.radio')
				.removeClass('ui-helper-hidden');
		},
		refresh: function() {
			//Display the checkbox's disabled state
			if (this.element.is(':disabled')) {
				this.ux_element
					.addClass('ui-state-disabled')
					.removeClass('ui-state-default');
			}
			else {
				this.ux_element
					.removeClass('ui-state-disabled')
					.addClass('ui-state-default');
			}
			
			//Display the radio button's checked state
			if (this.element.is(':checked')) {
				this.ux_element
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
					.change();
			}
			else {
				this.ux_element
					.removeClass('ui-state-active');
				
				this.icon
					.addClass('ui-icon-radio-off')
					.removeClass('ui-icon-bullet');
			}
		},
		reset: function() {
			this.element.prop('checked', this.option('default')).change();
		}
	});
})( jQuery );
