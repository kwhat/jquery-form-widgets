/*
 * jQuery UX Collapsible @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://code.google.com/p/jquery-ux-forms/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */
(function( $, undefined ) {
	$.widget('ux.collapsible', {
		version: '@VERSION',
		defaultElement: '<ul>',
		_create: function() {
			var self = this;

			this.icon = $('<span/>')
				.addClass('ui-icon ui-icon-triangle-1-s')
				.bind({
					'click.ux.collapsible': function(e) {
						var subitems = self.items.not(':first');
						var newheight = subitems.outerHeight() * subitems.length;

						//If the elemtns hight minus the hight of an item is less than an items hight...
						if (self.element.height() - newheight <= 0) {
							newheight += self.element.height();
						}
						else {
							newheight = self.element.height() - newheight;
						}

						//easeInOutExpo
						self.element.animate({height: newheight}, 'normal', 'linear', function() {
							self.icon.toggleClass('ui-icon-triangle-1-s ui-icon-triangle-1-e');
						});
					}
				});

			this.items = this.element
				.addClass('ui-menu ui-menu-icons ui-widget ui-widget-content ui-corner-all ux-collapsible')
				.children('li:has(a)')
				.addClass('ui-menu-item');

			this.items
				.children('a')
				.addClass('ui-corner-all')
				.bind({
					'click.ux.collapsible': function(e) {
						if ($(e.target).is('a')) {
							self._trigger('click', e);
						}
					},
					'mouseover.ux.collapsible': function() {
						$(this).addClass('ui-state-hover');
					},
					'mouseout.ux.collapsible': function() {
						$(this).removeClass('ui-state-hover');
					}
				})
				//Put the icon infront of the first element.
				.first().prepend(this.icon);
		},
		_init: function() {
			this._setOption('disabled', this.options.disabled);

			this.refresh();
		},
		_destroy: function() {
			this.icon
				.removeClass('ui-icon-triangle-1-s ui-icon-triangle-1-e')
				.unbind('.ux.collapsible')
				.remove();

			this.element
				.removeClass('ui-menu ui-menu-icons ui-widget ui-widget-content ui-corner-all ux-collapsible')
				.children('li:has(a)')
				.removeClass('ui-menu-item');

			this.items
				.children('a')
				.removeClass('ui-corner-all')
				.unbind('.ux.collapsible');
		},
		refresh: function() {
			//Display the checkbox's disabled state
			if (this.element.is(':disabled')) {
				this.element
					.addClass('ui-state-disabled');
			}
			else {
				this.element
					.removeClass('ui-state-disabled');
			}
		}
	});
})( jQuery );
