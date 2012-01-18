/*
 * jQuery UX Error @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */
(function( $, undefined ) {
	$.widget('ux.error', {
		version: '@VERSION',
		options: {
			error: false,
			delay: 200,
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
				.addClass('ui-helper-hidden ux-errortip ui-widget ui-state-error ui-corner-all');

		   	//Create the icon.
			this.icon = $('<a/>')
				.css({
					'position': 'absolute',
					'top': '50%',
					'width': '18px',
					'height': '1px',
					'overflow': 'visible'
				})
				.append(
					$('<a/>')
						.css({
							'position': 'absolute',
							'top': '-8px',
							'left': '50%',
							'margin-left': '-8px'
						})
						.addClass('ux-errortip-icon ui-icon ui-icon-alert')
				)
				.appendTo(this.ux_element);

			this.label = $('<a/>')
				.css('margin-left', '18px')
				.addClass('ux-errortip-label')
				.appendTo(this.ux_element);

			//Add the error tip directly after the document.body
			$('body').prepend(this.ux_element);


			this.element.bind({
				'mouseover.ux.error': function(e) {
					if (self.options.error) {
						//Start showing the tooltip
						self.ux_element.delay(self.options.delay).show(self.options.showAnim, self.options.showOptions, self.options.duration);
					}
				},
				'mouseout.ux.error': function() {
					//Stop showing the tooltip
					self.ux_element.delay(self.options.delay).hide(self.options.showAnim, self.options.showOptions, self.options.duration);
				},
				'mousemove.ux.error': function(e) {
					//Track the tooltip
					if (self.options.error) {
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
				.unbind('.ux.error')
				.remove();

			this.element
				.unbind('.ux.error')
				.removeClass('ui-state-error');
		},
		_setOption: function(key, value) {
			this._super("_setOption", key, value);
			
			switch (key) {
				case 'error':
					if (value) {
						this.element.addClass('ui-state-error');
					}
					else {
						this.element.removeClass('ui-state-error');
					}
				break;
				
				case 'message':
					this.label.text(this.options.message);
				break;
			}
		}
	});
})(jQuery);
