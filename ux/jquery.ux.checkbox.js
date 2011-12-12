/*
 * jQuery UX Checkbox @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */
(function( $, undefined ) {
	$.widget("ux.checkbox", {
		version: "@VERSION",
		defaultElement: "<input>",
		_create: function() {
			var self = this;
			
			//Hide the checkbox.
			this.element
				.addClass('ui-helper-hidden');
			
			//Create the widget
			this.ux_element = $('<a/>')
				.css('display', 'inline-block')
				.addClass('ux-checkbox ui-state-default ui-corner-all');
			
			//Create the checkbox that will be placed in the widget
			this.icon = $('<a/>')
				.addClass('ui-icon ux-icon-empty')
				.appendTo(this.ux_element);
			
			//Add the graphical checkbox directly after the hidden checkbox.
			this.element.after(this.ux_element);
			
			
			//Watch the actual DOM checkbox for changes.
			this.element.bind('change.ux.checkbox', function() {
				self.refresh();
			});
			
			//Add a click listener for the graphical checkbox.
			this.ux_element.bind({
				'mouseover.ux.checkbox': function() {
					if (!self.element.is(':disabled')) {
						self.ux_element.addClass('ui-state-hover');
					}
				},
				'mouseout.ux.checkbox': function() {
					if (!self.element.is(':disabled')) {
						self.ux_element.removeClass('ui-state-hover');
					}
				},
				'click.ux.checkbox': function() {
					self.element.click();
				}
			});
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
				.unbind('.ux.checkbox')
				.remove();
			
			this.element
				.unbind('.ux.checkbox')
				.removeClass('ui-helper-hidden');
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
					.removeClass('ux-icon-empty');
			}
			else {
				this.ux_element
					.removeClass('ui-state-active');
				
				this.icon
					.addClass('ux-icon-empty')
					.removeClass('ui-icon-check');
			}
		},
		reset: function() {
			this.element.prop('checked', this.option('default')).trigger('change');
		}
	});
})( jQuery );
