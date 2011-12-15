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
	$.widget('ux.grouptab', {
		version: '@VERSION',
		defaultElement: '<div>',
		_create: function() {
			var self = this;

			this.wrapper = $('<div/>');

			this.navigation = $('<div/>')
				.css({
					'float': 'left',
					'width': '180px',
					'padding': '5px',
					'z-index': '1',
					'border-right-style': 'none'
				});

			this.content = $('<div/>')
				.css({
					'margin-left': '190px',
					'padding': '15px'
				})
				.addClass('ui-widget-content ui-corner-bottom ui-corner-tr');

			this.groups = this.element
				.children('div');

			$.each(this.groups, function() {
				var list = $('<ul/>');

				$(this)
					.children('h3')
					.replaceWith(function() {
						console.debug($(this).html());
						return '<a>' + $(this).html() + '</a>';
					})
					.appendTo(list);
				
				//TODO we need code to display the content in the content area.
				list
					.appendTo(this.navigation)
					.collapsible();

				var content = item.next('div');


			});
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
