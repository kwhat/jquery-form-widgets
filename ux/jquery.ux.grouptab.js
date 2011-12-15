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

			this.element
				.addClass('ux-grouptab');

			this.navigation = $('<div/>')
				.addClass('ux-grouptab-navigation');

			this.content = $('<div/>')
				.addClass('ui-widget-content ui-corner-bottom ui-corner-tr ux-grouptab-content');


			this.groups = this.element
				.children('div');

			$.each(this.groups, function(i) {
				//Replace the group div with a list.
				var new_group = $('<ul id="group-' + i + '">' + $(this).html() + '</ul>');
				$(this).replaceWith(new_group);

				new_group
					.children(':even')
					.each(function(j) {
						//Replace the h3 tag with an anchor.
						var new_item = $('<li><a id="group-tab-' + i +'-' + j +'">' + $(this).html() + '</a></li>');
						$(this).replaceWith(new_item);

						//Move the div to the content area.
						new_item
							.next('div')
							.addClass('ui-helper-hidden')
							.attr('id', 'tab-content-' + i +'-' + j)
							.appendTo(self.content);
					});

				//TODO we need code to display the content in the content area.
				new_group
					.collapsible()
					.bind({
						'click.ux.grouptab': function(e) {
							console.debug(e);
						}
					})
					.appendTo(self.navigation);
			});


			this.navigation
				.children('.ux-collapsible:first')
				.addClass('ux-grouptab-active');
console.debug(this.navigation.children('.ux-collapsible:last').attr('class'));


			this.navigation.appendTo(this.element);

			this.content.children('div:first').removeClass('ui-helper-hidden');

			this.content
				.css('min-height', this.navigation.outerHeight() + 'px')
				.appendTo(this.element);
		},
		_init: function() {
			this._setOption('disabled', this.options.disabled);
			
			this.refresh();
		},
		_destroy: function() {
			//TODO add code.
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
