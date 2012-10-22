/*
 * jQuery Form Selectbox @VERSION
 *
 * Copyright 2012, AUTHORS.txt
 * Released under the MIT license.
 *
 * http://code.google.com/p/jquery-form-widgets/
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
				.addClass('ui-selectbox-menu');
				/*
				.data('timer', null)
				.data('search', '');
				//*/

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

			this.menu
				.menu({'role': 'listbox'})
				.removeClass('ui-widget ui-widget-content ui-corner-all');

			// Generate control
			if (this.element.attr('multiple')) {
				this._hideElement();

				// Create the widget and wrapper.
				this.ui_widget = this.wrapper = $('<div/>')
					.addClass('ui-widget ui-state-default ui-corner-all ui-selectbox-menu')
					.attr('title', this.element.attr('title') || '')
					.attr('tabindex', this.element.attr('tabindex') || '')
					.css('overflow-y', 'auto')
					.append(this.menu)
					.insertAfter(this.element)
					.height(self.menu.children().first().outerHeight() * (this.element.attr('size') || 10));

				this._on(this.menu.children('[role="presentation"]'), {
					click: function(event) {
						//Locate the selected item.
						var item = self.element
							.find('option[value="' + $(event.target).attr('rel') + '"]');

						//Toggle the hidden select boxes value.
						item.attr('selected', !item.attr('selected'));

						//Fire a change event to cause a refresh.
						self.element.change();
					}
				});

				//Because the super elements _create method is never called, the
				//following items need to be called directly.

				//Set the widget to hoverable
				this._hoverable(this.ui_widget);

				//Watch this.element for changes.
				this._on({
					change: function() {
						self.ui_widget.change();
					}
				});

				this._on(this.ui_widget, {
					change: this._refresh
				});

				//Set some initial options.
				this._setOptions({
					'default': this.element.val(),
					'disabled': this.element.is(':disabled')
				});

				this._refresh();
			}
			else {
				//Call super._create()
				this._super();

				//Make sure the menu is hidden by default.
				this.wrapper = $('<div/>')
					.addClass('ui-widget ui-state-default ui-selectbox-menu')
					.css({
						'overflow-y': 'auto',
						'position': 'absolute',
						'z-index': '99999'
					})
					.append(this.menu)
					.appendTo(document.body)
					.height(self.menu.children().first().outerHeight() * (this.element.attr('size') || 10))
					.hide();

				this._on(this.menu.children('[role="presentation"]'), {
					click: function(event) {
						//Hide the menu.
						self._hideMenu();

						//Set the hidden select boxes value.
						self.element.val($(event.target).attr('rel'));

						//Fire a change event to cause a refresh.
						self.element.change();
					}
				});

				//Bind the widget to show and hide menu
				this._on(this.ui_widget, {
					click: function() {
						//Display or Hide the menu when the box is clicked.
						if (! self.menu.is(':visible')) {
							self._showMenu();
						}
						else {
							self._hideMenu();
						}
					},
					keydown: function(event) {
						console.debug("keydown");
						self._handleKeyDown(event);
					},
					keypress: function(event) {
						console.debug("keyup");
						self._handleKeyPress(event);
					},
					selectstart: function(event) {
						//Prevent the hidden select box from showing
						event.preventDefault();
					}
				});

				//Hide the menu if we click anywhere else
				this._on($(document), {
					mouseup: function(event) {
						if (self.menu.is(':visible')) {
							//We need to make sure that we are not a child of the widget either.
							if (self.ui_widget.find($(event.target)).length == 0 && self.menu.find($(event.target)).length == 0 && !self.ui_widget.is($(event.target))) {
								self._hideMenu();
							}
						}
					}
				});
			}

			/* FIXME This should be handled by CSS.
			//Allow highlighted classes to have a hover state.
			this._on(this.menu.children(), {
				mouseover: function(event) {
					$(event.target).removeClass('ui-state-highlight');
				},
				mouseout: function(event) {
					if (self.element.has('option[value="' + $(event.target).attr('rel') + '"]:selected').length != 0) {
						$(event.target).addClass('ui-state-highlight');
					}
				}
			});
			//*/
		},
		_refresh: function() {
			var self = this;

			/*
			var isDisabled = this.element.is(':disabled');
			if (isDisabled !== this.options.disabled) {
				this._setOption('disabled', isDisabled);
			}
			else {
				//FIXME Figure out how to disable sub items correctly, should disable items based on a for loop over the options as well.
				//if( $(this).attr('disabled') ) li.addClass('selectBox-disabled');
				//if( $(this).attr('selected') ) li.addClass('selectBox-selected');
			}
			*/

			//Remove all previously selected items.
			this.menu
				.find('.ui-state-highlight')
				.removeClass('ui-state-highlight');

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
						.text($(this).text());
				}
			});
		},
		_showMenu: function() {
			var widget = this.ui_widget;
			var wrapper = this.wrapper;

			widget
				.removeClass('ui-state-default ui-corner-all')
				.addClass('ui-state-focus ui-corner-top');

			// Show menu
			wrapper
				.css({
					width: widget.outerWidth() - (
								parseInt(widget.css('borderLeftWidth')) +
								parseInt(widget.css('borderRightWidth')) +
								parseInt(wrapper.css('padding-left')) +
								parseInt(wrapper.css('padding-right'))
							),
					top: widget.offset().top + widget.outerHeight()- (parseInt(widget.css('borderBottomWidth'))),
					left: widget.offset().left
				})
				.addClass('ui-corner-bottom ui-state-focus');

			wrapper.show().focus();
		},
		_hideMenu: function() {
			var wrapper = this.wrapper;
			wrapper
				.removeClass('ui-corner-bottom ui-state-focus');

			this.ui_widget
				.removeClass('ui-state-focus  ui-corner-top')
				.addClass('ui-state-default ui-corner-all');

			wrapper.hide();
		}
		/*,
		_keepOptionInView: function(li, center) {

			if( !li || li.length === 0 ) return;

			var control = this.ui_widget;
			var menu = control.data('menu');

			//FIXME this is totally broken.
			//
			var scrollBox = control.hasClass('ui-selectbox') ? menu : menu.parent(),
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
			if( self.ui_widget.is(':disabled') ) return;

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
			if( self.ui_widget.is(':disabled') ) return;

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
