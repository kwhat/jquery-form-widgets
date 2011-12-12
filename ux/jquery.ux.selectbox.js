/*
 * jQuery UX Selectbox @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */

(function( $, undefined ) {
	$.widget("ux.selectbox", {
		version: "@VERSION",
		defaultElement: "<select>",
		options: {
			duration: 'normal',
			showAnim: 'blind',
			showOptions: {}
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
					if ($(this).is('optgroup')) {
						$('<li/>')
							.addClass($(this).attr('class') || '')
							.addClass('ux-selectbox-optgroup')
							.text($(this).attr('label'))
							.appendTo(self.menu);
					}
					else {
						var li = $('<li/>')
							.addClass($(this).attr('class') || '')
							.addClass('ux-selectbox-option');
						
						$('<a/>')
							.attr('rel', $(this).val())
							.text($(this).text())
							.addClass($(this).is(':selected') ? 'ui-state-highlight' : '')
							.appendTo(li);
						
						self.menu.append(li);
					}
				});
			}
			
			
			// Generate control
			if (this.element.attr('multiple')) {
				//Set the select box widget directly to the menu
				/*
					.attr('class', this.element.attr('class') || '')
					.attr('style', this.element.attr('style') || '')
					.attr('title', this.element.attr('title') || '')
					.attr('tabindex', this.element.attr('tabindex'))
				*/
				this.ux_element = this.menu
					.insertAfter(this.element)
					.menu({
						select: function(e, ui) {
							var item = self.element
								.find('option[value="' + ui.item.find('a[rel]:last').attr('rel') + '"]');

							item.attr('selected', !item.attr('selected'))
								.change();
						}
					})
					.addClass('ui-widget ui-state-default ui-corner-all ux-selectbox-menu');
			}
			else {
				//Create the selectbox widget
				/*
					.attr('class', $(this.element).attr('class') || '')
					.attr('style', $(this.element).attr('style') || '')
					.attr('title', $(this.element).attr('title') || '')
					.attr('tabindex', $(this.element).attr('tabindex'))
				*/
				this.ux_element = $('<a/>')
					.addClass('ux-selectbox ui-state-default ui-widget ui-corner-all');

				//Create the label
				this.label = $('<a/>')
					.addClass('ux-selectbox-label');
				
				//Create the icon.
				this.icon = $('<a/>')
					.css({
						'position': 'absolute', 
						'top': '50%',
						'width': '100%', 
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
							.addClass('ui-icon ui-icon-triangle-1-s')
					);
				
				//Create a wrapper around the icon so it can be centered.
				this.iconWrapper = $('<a/>')
					.addClass('ux-selectbox-icon ui-corner-tr ui-corner-br')
					.append(this.icon);
				
				
				//Make sure the menu is hidden by default.
				this.menu
					.menu()
					.css({
						'display': 'none',
						'position': 'absolute',
						'z-index': '99999'
					})
					.appendTo(document.body);
				
				this.ux_element
					.append(this.label)
					.append(this.iconWrapper)
					.insertAfter(this.element);


				//Bind the widget to show and hide menu
				this.ux_element
					.bind({
						'mouseup.ux.selectbox': function(e) {
							if (! self.menu.is(':visible')) {
								self._showMenu();
							}
							else {
								self._hideMenu();
							}
						},
						'keydown.ux.selectbox': function(event) {
							self._handleKeyDown(event);
						},
						'keypress.ux.selectbox': function(event) {
							self._handleKeyPress(event);
						},
						/* Other method of closing the menu on focus out.
						focusout: function(event) {
							//Hide the menu if it is not getting the focus
							if (! self.menu.data('mouseover')) {
								self._hideMenu();
							}
						},
						*/
						'selectstart.ux.selectbox': function(e) {
							//Prevent the hidden select box from showing
							event.preventDefault();
						}
					});

				//Provide menu bindings.
				this.menu.children('li').bind({
					'mousedown.ux.selectbox': function(e) {
						//Prevent dropdown from being "dragged"
						e.preventDefault();
					},
					'mouseup.ux.selectbox': function(e) {
						//Prevent optgroup's from being selected
						if ($(e.target).is('a')) {
							//Hide the menu.
							self._hideMenu();

							//Set the hidden select boxes value.
							self.element.val($(e.target).attr('rel'));

							//Fire a change event to cause a refresh.
							self.element.trigger('change');
						}
					}
				});

				//Hide the menu if we click anywhere else
				$(document).bind('mouseup.ux.selectbox', function(e) {
					if (self.menu.is(':visible')) {
						//We need to make sure that we are not a child of the widget either.
						if (self.ux_element.find($(e.target)).length == 0 && !self.ux_element.is($(e.target))) {
							self._hideMenu();
						}
					}
				});
				
				//Handle close events for focus loss.
				this.menu.bind({
					'mousedown.ux.selectbox': function(e) {
						if ($(this).is(self.menu)) {
							e.stopPropagation();
						}
					}
					/* Other method of closing the menu on focus out.
					focusin: function(event) {
						//Send the focus back to the widget.
						self.ux_element.focus();
					},
					mouseover: function(event) {
						$(event.target).data('mouseover', true);
					},
					mouseout: function(event) {
						$(event.target).data('mouseover', false);
					}
					*/
				});
			}
			
			
			//Hide the element and
			//Monitor the hidden selectbox for changes
			this.element
				.addClass('ui-helper-hidden')
				.bind('change.ux.selectbox', function(e) {
					//Tell the gui box to update its self.
					self.refresh();
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
				.unbind('.ux.selectbox');
		},
		reset: function() {
			//TODO implement.
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
					.find('a[rel="' + $(this).val() + '"]')
					.addClass('ui-state-highlight');


				//Set the label text to the current selected item.
				if (!multipul) {
					self.label
						.text($(this).text() || '\u00A0');
				}
			});
		},
		_showMenu: function() {
			var widget = this.ux_element;
			var menu = this.menu;
			
			var select = $(this.element);
			
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

			menu.show(this.options.showAnim, this.options.showOptions, this.options.duration);
			
			// Center on selected option
			var li = menu.find('.selectBox-selected:first');
			this._keepOptionInView(li, true);
		},
		_hideMenu: function() {
			var menu = this.menu;
			menu
				.removeClass('ui-corner-bottom')
				.addClass('ui-corner-all');
			
			this.ux_element
				.removeClass('ui-state-focus  ui-corner-top')
				.addClass('ui-state-default ui-corner-all');

			menu.hide(this.options.showAnim, this.options.showOptions, this.options.duration);
		},
		_keepOptionInView: function(li, center) {
			
			if( !li || li.length === 0 ) return;
			
			var control = this.ux_element;
			var menu = control.data('menu');
			
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
						
						curr.trigger('mousedown');
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
						
						
						prev.trigger('mouseover');
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
						
						
						next.trigger('mouseover');
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
							$(this).parent().trigger('mouseover');
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
	});
})(jQuery);
