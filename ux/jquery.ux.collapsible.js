/*
 * jQuery UX Collapsible @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */
(function( $, undefined ) {
	$.widget('ux.collapsible', {
		version: '@VERSION',
		defaultElement: '<dl>',
		_create: function() {
			var self = this,
				children = this.element.children();
			
			self.ux_element = $('<div/>')
				.addClass('ui-widget ux-collapsible');
			
			self.wrapper = $('<div/>');
			
			$.each(children, function(index, value) {
				var wrapper = $('<div/>')
						.addClass('ui-corner-all')
						.css('cursor', 'pointer')
						.bind({
							'click.ux.collapsible': function() {
								$(value).trigger('click');
							},
							'mouseover.ux.collapsible': function() {
								$(this).addClass('ui-state-hover ux-border-fix');
							},
							'mouseout.ux.collapsible': function() {
								$(this).removeClass('ui-state-hover ux-border-fix');
							}
						});
					item = $('<a/>')
						.text($(this).text());
				
				if ($(this).is('dt')) {
					var icon = $('<span/>')
						.css('display', 'inline-block')
						.addClass('ui-icon ui-icon-triangle-1-se');
					
					item
						.css('display', 'inline-block')
						.prepend(icon)
						.appendTo(wrapper);
				}
				else {
					item
						.css('padding-left', '16px')
						.appendTo(wrapper);
				}
				
				self.wrapper.append(wrapper);
			});
			
			self.ux_element
				.append(self.wrapper);
			
			self.element
				.addClass('ui-helper-hidden')
				.after(self.ux_element);
			
			/* Implement later when we have more settings.
			 * We need to check to see if we are already open to not collapse.
			self.label
				.bind({
					'click.ux.collapsible': function() {
						self.wrapper
							.toggle(250, 'blind', function(){
								self.icon
									.toggleClass('ui-icon-triangle-1-e ui-icon-triangle-1-se');
							});
					}
				});
			*/
		},
		_init: function() {
			this._setOption('disabled', this.options.disabled);
			
			this.refresh();
		},
		_destroy: function() {
			this.element
				.removeClass('ui-helper-hidden')
				.unbind('.ux.collapsible');
		},
		_setOption: function(key, value) {
			/*
			if (key === 'disabled') {
				if (value) {
					this.element.attr('disabled', true)
						.addClass('ui-state-disabled')
						.removeClass('ui-state-default');
				}
				else {
					this.element.removeAttr('disabled')
						.removeClass('ui-state-disabled')
						.addClass('ui-state-default');
				}
				
				this.options.disabled = value;
			}
			*/
		},
		refresh: function() {
			var disabled = this.element.is(':disabled');
			if (disabled !== this.options.disabled) {
				this._setOption('disabled', disabled);
			}
		}
	});
})( jQuery );
