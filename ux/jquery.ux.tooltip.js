/*
 * jQuery UX Tooltip @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://code.google.com/p/jquery-ux-forms/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */
(function( $, undefined ) {
	$.widget('ux.tooltip', {
		version: '@VERSION',
		options: {
			delay: 200,
			icon: 'ui-icon ui-icon-alert',
			class: 'ui-state-error ux-tooltip',
			duration: 'normal',
			showAnim: null,
			showOptions: {},
			top: 15,
			left: 15,
			message: 'There is a problem with this field.'
		},
		_create: function() {
			var self = this;

			//Create the widget, make sure its hidden.
			this.ux_element = $('<div/>')
				.addClass('ui-helper-hidden ui-widget ui-corner-all ux-tooltip ' + this.options.class);

			//Create the label for the options.message
			this.label = $('<span/>')
				.addClass('ux-tooltip-label')
				.appendTo(this.ux_element);

			if (typeof(this.options.icon) == 'string') {
				this.ux_element
					.addClass('ux-inputbox-text-icon-secondary');

				this.label
					.css('margin-left', '1.5em');

				//Create the icon.
				this.icon = $('<span/>')
					.addClass('ui-icon ' + this.options.icon);

				//Create a wrapper around the icon so it can be centered.
				this.iconWrapper = $('<span/>')
					.addClass('ux-inputbox-icon-secondary')
					.append(this.icon)
					.appendTo(this.ux_element);
			}

			//Add the error tip directly after the document.body
			$('body').prepend(this.ux_element);

			//Call options
			this.option(this.options);

			this.element.bind({
				'mouseover.ux.tooltip': function(e) {
					if (!self.options.disabled) {
						//Start showing the tooltip
						self.ux_element
							.delay(self.options.delay)
							.show(self.options.showAnim, self.options.showOptions, self.options.duration);
					}
				},
				'mouseout.ux.tooltip': function() {
					//Stop showing the tooltip
					self.ux_element
						.delay(self.options.delay)
						.hide(self.options.showAnim, self.options.showOptions, self.options.duration);
				},
				'mousemove.ux.tooltip': function(e) {
					//Track the tooltip
					if (!self.options.disabled) {
						self.ux_element.css({
							'top': e.pageY + self.options.top,
							'left': e.pageX + self.options.left
						});
					}
				}
			});
		},
		_destroy: function() {
			this.icon.remove();
			this.iconWrapper.remove();
			this.label.remove();
			this.ux_element.remove();

			this.element
				.unbind('.ux.tooltip');
		},
		_setOption: function(key, value) {
			switch (key) {
				case 'disabled':
					console.log(this.options.disabled);
					break;

				case 'message':
					this.label.text(value);
					break;

				default:
					//$.Widget.prototype._setOption.apply(this, new Array(key, value));
					$.Widget.prototype._setOption.call(this, key, value);
			}
		}
	});
})(jQuery);
