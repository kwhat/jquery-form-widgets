/*
 * jQuery UX datebox @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */
(function( $, undefined ) {
	$.widget('ux.datebox', {
		version: "@VERSION",
		defaultElement: "<input>",
		_create: function() {
			var self = this;
			
			//Apply some classes to the datebox to hide it.
			
			this.element
				.addClass('ux-datebox-input');
				/*
				.datepicker({
					yearRange: '-100:+0',
					changeMonth: true,
					changeYear: true,
					beforeShow: function(input, inst) {
						//var widget = $(inst).datepicker('widget');
						//console.debug(widget.offset());
						//console.debug(widget.position());

						//widget.css('margin-left', self.ux_element.outerWidth() - widget.outerWidth());
					}
				});
			*/
		   
			//Create the datebox widget.
			this.ux_element = $('<a/>')
				.attr('style', this.element.attr('style') || '')
				.addClass('ui-state-default ui-widget ui-corner-all ux-datebox')
				.insertAfter(this.element);

			//Create the label
			this.label = $('<a/>')
				.addClass('ux-datebox-label');
			
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
						.addClass('ui-icon ui-icon-calendar')
				);
			
			//Create a wrapper around the icon so it can be centered.
			this.iconWrapper = $('<a/>')
				.addClass('ui-corner-tr ui-corner-br ux-datebox-icon')
				.append(this.icon);
			
			//Add the label and icon to the widget.
			this.ux_element
				.append(this.label)
				.append(this.iconWrapper);
			
			//Watch the actual DOM checkbox for changes.
			this.element.bind('change.ux.datebox', function() {
				self.refresh();
			});

			this.ux_element.bind({
				'mouseover.ux.datebox': function() {
					self.ux_element.addClass('ui-state-hover');
				},
				'mouseout.ux.datebox': function() {
					self.ux_element.removeClass('ui-state-hover');
				},
				'mouseup.ux.datebox': function() {
					self.element.click();

					var widget = self.element.datepicker("widget");

					self.element.datepicker('dialog', 
						new Date(),
						function(date, inst) {
							self.element.val(date);
							self.element.change();
						},
						{
							maxDate: '+0m +0d +0y',
							yearRange: '-100:+0',
							changeMonth: true,
							changeYear: true
						},
						[ /* FIXME the y value needs to be adjusted for if the box pops above */
							self.ux_element.offset().left + self.ux_element.outerWidth() - widget.outerWidth(),
							self.ux_element.offset().top + self.ux_element.outerHeight()
						]
					);
				}
			});


		},
		_init: function() {
			this._setOption('default', this.element.val());
			this._setOption('disabled', this.element.is(':disabled'));
			
			this.refresh();
		},
		_getText: function() {
			var text = this.val().replace(/^.*(\\|\/|\:)/, '');
			
			if (text == null) {
				text = '';
			}
			
			return text;
		},
		val: function() {
			return this.element.val().replace('\u00A0', '');
		},
		_destroy: function() {
			this.ux_element.unbind('.ux.datebox');
			
			this.label.remove();
			this.fileIcon.remove();
			this.iconWrapper.remove();
			this.element.removeClass('ux-datebox-input').unwrap(this.ux_element);
			this.ux_element.remove();
			
			$.Widget.prototype.destroy.call(this);
		},
		refresh: function() {
			var text = this.val();
			
			if (text == '') {
				text = this.option('defaultText');
				if (text == '' || text == null) {
					//Place a non-breaking space in the select box so it renders with a height.
					text = '\u00A0';
				}
			}

			this.label.text(text);
		},
		reset: function() {
			this.element.val(this.option('default')).trigger('change');
		}
	});
})( jQuery );
