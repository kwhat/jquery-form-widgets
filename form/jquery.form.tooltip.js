/*
 * jQuery Form Tooltip @VERSION
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
	$.widget('form.errortip', {
		version: '@VERSION',
		options: {
			delay: 200,
			icon: 'ui-icon ui-icon-alert',
			style: 'ui-state-error ui-tooltip',
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
			this.ui_widget = $('<div/>')
				.addClass('ui-helper-hidden ui-widget ui-corner-all ui-tooltip ' + this.options.style);

			//Create the label for the options.message
			this.label = $('<span/>')
				.addClass('ui-tooltip-label')
				.appendTo(this.ui_widget);

			if (typeof(this.options.icon) == 'string') {
				this.ui_widget
					.addClass('ui-inputbox-text-icon-secondary');

				this.label
					.css('margin-left', '1.5em');

				//Create the icon.
				this.icon = $('<span/>')
					.addClass('ui-icon ' + this.options.icon);

				//Create a wrapper around the icon so it can be centered.
				this.iconWrapper = $('<span/>')
					.addClass('ui-inputbox-icon-secondary')
					.append(this.icon)
					.appendTo(this.ui_widget);
			}

			//Add the error tip directly after the document.body
			$('body').prepend(this.ui_widget);

			//Call options
			this.option(this.options);

			this.element.bind({
				'mouseover.form.tooltip': function(e) {
					if (!self.options.disabled) {
						//Start showing the tooltip
						self.ui_widget
							.delay(self.options.delay)
							.show(self.options.showAnim, self.options.showOptions, self.options.duration);
					}
				},
				'mouseout.form.tooltip': function() {
					//Stop showing the tooltip
					self.ui_widget
						.delay(self.options.delay)
						.hide(self.options.showAnim, self.options.showOptions, self.options.duration);
				},
				'mousemove.form.tooltip': function(e) {
					//Track the tooltip
					if (!self.options.disabled) {
						self.ui_widget.css({
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
			this.ui_widget.remove();

			this.element
				.unbind('.form.tooltip');
		},
		_setOption: function(key, value) {
			switch (key) {
				case 'disabled':
					this.options.disabled = value;
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
