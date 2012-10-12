/*
 * jQuery UX Selectbox @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://code.google.com/p/jquery-ux-forms/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *	jquery.form.inputbox.js
 *	jquery.ui.menu.js
 */

(function( $, undefined ) {
	$.widget('form.selectbox', $.form.inputbox, {
		defaultElement: '<select>',
		options: {
			icons: {
				primary: 'ui-icon-triangle-1-s'
			}
		},
		_create: function() {
			var self = this;

			//Create the dropdown menu widget.
			this.menu = $('<ul/>')
				.addClass('ux-selectbox-menu')
				.data('timer', null)
				.data('search', '');

			//Create a menu based on the options.
			var options = this.element.find('option, optgroup');
			if( options.length == 0 ) {
				//Create an empty option.
				self.menu.append('<li>\u00A0</li>');
			}
			else {
				//Loop over the options and create the list.
				$.each(options, function() {
					var li = $('<li/>').appendTo(self.menu);

					if ($(this).is('optgroup')) {
						li.addClass('ui-menu-item');

						$('<span/>')
							.text($(this).attr('label'))
							.appendTo(li);
					}
					else {
						$('<a/>')
							.attr('rel', $(this).val())
							.text($(this).text())
							.appendTo(li);
					}
				});
			}


			// Generate control
			if (this.element.attr('multiple')) {
				this._hideElement();

				this.ux_element = this.menu
					.menu()
					.addClass('ui-state-default')
					.attr('title', this.element.attr('title') || '')
					.attr('tabindex', this.element.attr('tabindex') || '')
					.insertAfter(this.element);

				//Add mouse up listener for child items.
				this.menu
					.children('[role="presentation"]')
					.bind({
						'mouseup.form.selectbox': function(e) {
							var item = self.element
								.find('option[value="' + $(e.target).attr('rel') + '"]');

							item.attr('selected', !item.attr('selected'));

							self.element.change();
						}
					});

				//Because the super elements _create method is never called, a
				//simple bind needes to be add for the change listener.
				//This event is unbound by the super element on _destroy.
				this.element.bind(
					'change.form.inputbox', function(e) {
						self.refresh();
						self.ux_element.change();
					}
				);
			}
			else {
				//Call super._create()
				this._super();

				//Make sure the menu is hidden by default.
				this.menu
					.menu()
					.css({
						'display': 'none',
						'position': 'absolute',
						'z-index': '99999'
					})
					.appendTo(document.body)
					.children('[role="presentation"]')
					.bind({
						'mouseup.form.selectbox': function(e) {
							//Hide the menu.
							self._hideMenu();

							//Set the hidden select boxes value.
							self.element.val($(e.target).attr('rel'));

							//Fire a change event to cause a refresh.
							self.element.change();
						}
					});


				//Bind the widget to show and hide menu
				this.ux_element
					.bind({
						'mouseup.form.selectbox': function(e) {
							//Display or Hide the menu when the box is clicked.
							if (! self.menu.is(':visible')) {
								self._showMenu();
							}
							else {
								self._hideMenu();
							}
						},
						'keydown.form.selectbox': function(e) {
							self._handleKeyDown(e);
						},
						'keypress.form.selectbox': function(e) {
							self._handleKeyPress(e);
						},
						'selectstart.form.selectbox': function(e) {
							//Prevent the hidden select box from showing
							e.preventDefault();
						}
					});

				//Hide the menu if we click anywhere else
				$(document).bind('mouseup.form.selectbox', function(e) {
					if (self.menu.is(':visible')) {
						//We need to make sure that we are not a child of the widget either.
						if (self.ux_element.find($(e.target)).length == 0 && self.menu.find($(e.target)).length == 0 && !self.ux_element.is($(e.target))) {
							self._hideMenu();
						}
					}
				});
			}

			//Setup the class hovers and selections for the menus children
			this.menu
				.children()
				.bind({
					'mouseover.form.selectbox': function(e) {
						self.menu.addClass('ui-state-hover');

						$(e.target).removeClass('ui-state-highlight');
					},
					'mouseout.form.selectbox': function(e) {
						self.menu.removeClass('ui-state-hover');

						if (self.element.has('option[value="' + $(e.target).attr('rel') + '"]:selected').length != 0) {
							$(e.target).addClass('ui-state-highlight');
						}
					}
				});
		},
		_init: function() {
			this._setOption('default',  $(this.element).find('option:selected'));
			this._setOption('disabled', this.element.is(':disabled'));

			this.refresh();
		},
		_destroy: function() {
			this.label.remove();
			this.icon.remove();
			this.iconWrapper.remove();

			this.ux_element.remove();
			this.element
				.removeClass('ui-helper-hidden')
				.unbind('.form.selectbox');
		},
		refresh: function() {
			var self = this;

			var isDisabled = this.element.is(':disabled');
			if (isDisabled !== this.options.disabled) {
				this._setOption('disabled', isDisabled);
			}
			else {
				//FIXME Figure out how to disable sub items correctly, should disable items based on a for loop over the options as well.
				//if( $(this).attr('disabled') ) li.addClass('selectBox-disabled');
				//if( $(this).attr('selected') ) li.addClass('selectBox-selected');
			}

			//Remove all previously selected items.
			this.menu.find('.ui-state-highlight').removeClass('ui-state-highlight');

			//need to search by data element.
			var selected = this.element.find('option:selected');
			var multipul = this.element.attr('multiple');
			if (!multipul) {
				//Select only the last attr if we are not a multiple select box.
				selected = selected
					.removeAttr('selected')
					.last()
					.attr('selected', true);
			}

			$.each(selected, function() {
				//Hightlight the currently selected item.
				self.menu
					.find('.ui-menu-item a[rel="' + $(this).val() + '"]')
					.addClass('ui-state-highlight');


				//Set the label text to the current selected item.
				if (!multipul) {
					self.label
						.text($(this).text() || '\u00A0');
				}
			});
		},
		reset: function() {
			//TODO implement.
			this.refresh();
		},
		widget: function() {
			return this.ux_element;
		},
		_showMenu: function() {
			var widget = this.ux_element;
			var menu = this.menu;

			widget
				.removeClass('ui-state-default ui-corner-all')
				.addClass('ui-state-focus ui-corner-top');

			// Show menu
			menu
				.css({
					width: widget.outerWidth() - (
								parseInt(widget.css('borderLeftWidth')) +
								parseInt(widget.css('borderRightWidth')) +
								parseInt(menu.css('padding-left')) +
								parseInt(menu.css('padding-right'))
							),
					top: widget.offset().top + widget.outerHeight()- (parseInt(widget.css('borderBottomWidth'))),
					left: widget.offset().left
				})
				.removeClass('ui-corner-all')
				.addClass('ui-corner-bottom');

			menu.show();

			// Center on selected option
			//var li = menu.find('.ui-state-highlight:first');
			//this._keepOptionInView(li, true);
		},
		_hideMenu: function() {
			var menu = this.menu;
			menu
				.removeClass('ui-corner-bottom')
				.addClass('ui-corner-all');

			this.ux_element
				.removeClass('ui-state-focus  ui-corner-top')
				.addClass('ui-state-default ui-corner-all');

			menu.hide();
		}
		/*,
		_keepOptionInView: function(li, center) {

			if( !li || li.length === 0 ) return;

			var control = this.ux_element;
			var menu = control.data('menu');

			//FIXME this is totally broken.
			//
			var scrollBox = control.hasClass('ux-selectbox') ? menu : menu.parent(),
				top = parseInt(li.offset().top - scrollBox.position().top),
				bottom = parseInt(top + li.outerHeight());

			if (center) {
				scrollBox.scrollTop( li.offset().top - scrollBox.offset().top + scrollBox.scrollTop() - (scrollBox.height() / 2) );
			}
			else {
				if( top < 0 ) {
					scrollBox.scrollTop( li.offset().top - scrollBox.offset().top + scrollBox.scrollTop() );
				}
				if( bottom > scrollBox.height() ) {
					scrollBox.scrollTop( (li.offset().top + li.outerHeight()) - scrollBox.offset().top + scrollBox.scrollTop() - scrollBox.height() );
				}
			}
			//
		},
		_handleKeyDown: function(event) {
			// Handles open/close and arrow key functionality

			select = $(this.element);
			var self = this,
				menu = self.menu,
				totalOptions = 0,
				i = 0;

			//FIXME
			if( self.ux_element.is(':disabled') ) return;

			switch( event.keyCode ) {
				case 8: // backspace
					event.preventDefault();
					typeSearch = '';
				break;

				case 9: // tab
				case 27: // esc
					self._hideMenu();
				break;

				case 10:
				case 13: // enter
					if (menu.is(':visible')) {
						var curr = menu.find('.ui-state-focus').not(':disabled').last();
						if (curr.length < 1) {
							curr = menu.find('.ui-state-highlight').last();
						}

						curr.mousedown();
					}
					else {
						this._showMenu();
					}
				break;

				case 38: // up
				case 37: // left
					event.preventDefault();

					if (menu.is(':visible')) {
						var prev = menu.find('.ui-state-focus').parent().prevAll('li:has(a)').not(':disabled').first();
						if (prev.length < 1) {
							prev = menu.find('.ui-state-highlight').parent().prevAll('li:has(a)').first();
						}


						prev.mouseover();
						//FIXME keepOptionInView(select, next);
					}
					else {
						self._showMenu();
					}
				break;

				case 40: // down
				case 39: // right
					event.preventDefault();

					if (menu.is(':visible')) {
						var next = menu.find('.ui-state-focus').parent().nextAll('li:has(a)').not(':disabled').first();
						if (next.length < 1) {
							next = menu.find('.ui-state-highlight').parent().nextAll('li:has(a)').first();
						}


						next.mouseover();
						//FIXME keepOptionInView(select, next);
					}
					else {
						self._showMenu();
					}
				break;

			}

		},
		_handleKeyPress: function(event) {
			// Handles type-to-find functionality

			select = $(this.element);
			var self = this,
				menu = self.menu;

			//FIXME
			if( self.ux_element.is(':disabled') ) return;

			switch( event.keyCode ) {
				case 9: // tab
				case 27: // esc
				case 13: // enter
				case 38: // up
				case 37: // left
				case 40: // down
				case 39: // right
					// Don't interfere with the keydown event!
				break;

				default: // Type to find
					event.preventDefault();

					if (! menu.is(':visible')) {
						this._showMenu();
					}

					clearTimeout(menu.data('timer'));
					menu.data('search', menu.data('search') + String.fromCharCode(event.charCode || event.keyCode));

					menu.find('li > a').each(function() {
						if( $(this).text().substr(0, menu.data('search').length).toLowerCase() == menu.data('search').toLowerCase() ) {
							$(this).parent().mouseover();
							//keepOptionInView(select, $(this).parent());
							return false;
						}
					});

					// Clear after a brief pause
					menu.data('timer', setTimeout(function() {
						menu.data('search', '');
					}, 1000));
				break;

			}

		}
		*/
	});
})(jQuery);
