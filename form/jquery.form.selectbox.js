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
			this.menu = $('<ul/>');
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

			//Setup the menu roll and selection callback.
			this.menu
				.menu({
					role: 'listbox',
					select: function(event, ui) {
						self._select(ui.item);
					}
				})
				.removeClass('ui-widget ui-widget-content ui-corner-all');

			// Generate control
			if (this.element.attr('multiple')) {
				this._hideElement();

				// Create the widget and wrapper.
				this.wrapper = $('<div/>')
					.addClass('ui-widget ui-state-default ui-corner-all ui-selectbox-menu')
					.attr('title', this.element.attr('title') || '')
					.attr('tabindex', this.element.attr('tabindex') || '')
					.append(this.menu)
					.insertAfter(this.element);

				//Because self.menu.children().first().outerHeight() would have
				//been to easy...  This is why I hate the web; and yes I
				//understand why it doesnt work.
				var clone = this.wrapper.clone();
				clone
					.appendTo(document.body)
					.css({
						'position':'absolute',
						'visibility':'hidden',
						'top': '-9999',
						'left': '-9999'
					});
				var height = clone.find('li').first().outerHeight();
				clone.remove();

				//Set the ui_wrapper and its height
				this.ui_widget = this.wrapper
					.height(height * (this.element.attr('size') || 10));

				//Because the super elements _create method is never called, the
				//following items need to be called directly.

				//Set the widget to hoverable
				this._hoverable(this.ui_widget);

				//Watch this.element for changes.
				this._on({
					change: function(event) {
						this._change(event);
						this._refresh();
					}
				});

				this._on(this.ui_widget, {
					focus: function() {
						this.menu.focus();
					}
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
		_select: function(item) {
			var val = item.children('a:last').prop('rel');

			if (this.element.attr('multiple')) {
				var option = this.element
					//Locate the selected item in the element.
					.find('option[value="' + val + '"]');

					//Toggle the hidden select boxes value.
					option.prop('selected', !option.is(':selected'));
			}
			else {
				//Hide the dropdown menu.
				this._hideMenu();

				//Set the hidden select boxes value.
				this.element
					.val(val);
			}

			//Fire a change event to cause a refresh.
			this.element.change();
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

			wrapper.show();
			this.menu.focus();
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
		}
		*/
	});
})(jQuery);
