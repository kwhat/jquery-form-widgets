/*
 * jQuery UX Error @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://code.google.com/p/jquery-ux-forms/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */
(function( $, undefined ) {
	$.widget('ux.error', {
		version: '@VERSION',
		options: {
			disabled: true,
			delay: 200,
			icon: 'ui-icon ui-icon-alert',
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
				.css({
					'position': 'absolute',
					'z-index': '9999'
				})
				.addClass('ui-helper-hidden ui-widget ui-state-error ui-corner-all ux-error ux-inputbox-text-icon-secondary');

		   	//Create the icon.
			this.icon = $('<span/>')
				.addClass('ui-icon ' + this.options.icon);

			//Create a wrapper around the icon so it can be centered.
			this.iconWrapper = $('<span/>')
				.addClass('ux-inputbox-icon-secondary')
				.append(this.icon)
				.appendTo(this.ux_element);

			this.label = $('<span/>')
				.css('margin-left', '18px')
				.addClass('ux-error-label')
				.appendTo(this.ux_element);

			//Add the error tip directly after the document.body
			$('body').prepend(this.ux_element);

			//Call options
			this.option(this.options);

			this.element.bind({
				'mouseover.ux.error': function(e) {
					if (!self.options.disabled) {
						//Start showing the tooltip
						self.ux_element
							.delay(self.options.delay)
							.show(self.options.showAnim, self.options.showOptions, self.options.duration);
					}
				},
				'mouseout.ux.error': function() {
					//Stop showing the tooltip
					self.ux_element
						.delay(self.options.delay)
						.hide(self.options.showAnim, self.options.showOptions, self.options.duration);
				},
				'mousemove.ux.error': function(e) {
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
			this.label.remove();

			this.ux_element
				.remove();

			this.element
				.unbind('.ux.error')
				.addClass('ui-state-default')
				.removeClass('ui-state-error');
		},
		_setOption: function(key, value) {
			switch (key) {
				case 'disabled':
					if (value) {
						this.element
							.addClass('ui-state-default')
							.removeClass('ui-state-error');
					}
					else {
						this.element
							.addClass('ui-state-error')
							.removeClass('ui-state-default');
					}

					this.options.disabled = value;
					break;

				case 'message':
					this.label.text(value);

				default:
					//$.Widget.prototype._setOption.apply(this, new Array(key, value));
					$.Widget.prototype._setOption.call(this, key, value);
			}
		}
	});
})(jQuery);
