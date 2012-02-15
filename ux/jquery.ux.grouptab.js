/*
 * jQuery UX Grouptab @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://code.google.com/p/jquery-ux-forms/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *	jquery.ux.collapsible.js
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
						var item_content = new_item.next('div');

						item_content
							.attr('id', 'tab-content-' + i +'-' + j)
							.appendTo(self.content);

						if (i > 0 || j > 0) {
							item_content
								.hide()
						}
					});

				//Display the content in the content area.
				new_group
					.collapsible({
						'click': function(e) {
							if (! self.content.data('locked')) {
								self.content.data('locked', true);

								var target = $(e.target);

								self.content
									.children('div:visible')
									.fadeOut('normal')
									.promise()
									.done(function() {
										//Turn off all active tab groups
										self.navigation
											.children('.ux-collapsible')
											.removeClass('ux-grouptab-active');

										//Activate the current tab group
										target
											.closest('.ux-collapsible')
											.addClass('ux-grouptab-active');

										//Show the current tab groups content.
										self.content
											.find('#' + target.attr('id').replace('group-tab-', 'tab-content-'))
											.fadeIn('normal', function() {
												self.content.data('locked', false);
											});
									});
							}
						}
					})
					.appendTo(self.navigation);
			});

			this.navigation
				.appendTo(this.element)
				.children('.ux-collapsible:first')
				.addClass('ux-grouptab-active');

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
