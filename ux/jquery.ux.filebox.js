/*
 * jQuery UX Filebox @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */
(function( $, undefined ) {
	$.widget('ux.filebox', {
		version: '@VERSION',
		defaultElement: '<input>',
		_create: function() {
			var self = this;
			
			//Create the filebox widget.
			this.ux_element = $('<div/>')
				.attr('style', this.element.attr('style') || '')
				.addClass('ui-state-default ui-widget ui-corner-all ux-filebox')
				.insertAfter(this.element);

			//Create the label
			this.label = $('<a/>')
				.addClass('ux-filebox-label');
			
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
						.addClass('ui-icon ui-icon-folder-collapsed')
				);
			
			//Create a wrapper around the icon so it can be centered.
			this.iconWrapper = $('<a/>')
				.addClass('ux-filebox-icon ui-corner-tr ui-corner-br')
				.append(this.icon);
			
			//Add the label and icon to the widget.
			this.ux_element
				.append(this.label)
				.append(this.iconWrapper);
			
			
			this.element
				//Apply some classes to the filebox to hide it.
				.addClass('ux-filebox-input')
				//Watch the actual DOM checkbox for changes.
				.bind('change.ux.filebox', function() {
					self.refresh();
				});

			this.ux_element.bind({
				'mouseover.ux.filebox': function() {
					self.ux_element.addClass('ui-state-hover');
				},
				'mouseout.ux.filebox': function() {
					self.ux_element.removeClass('ui-state-hover');
				},
				'mouseup.ux.filebox': function() {
					self.element.click();
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
			this.ux_element.unbind('.ux.filebox');
			
			this.label.remove();
			this.fileIcon.remove();
			this.iconWrapper.remove();
			this.element.removeClass('ux-filebox-input').unwrap(this.ux_element);
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
			this.element.val(this.option('default')).change();
		},
		uxElement: function() {
			return this.ux_element;
		}
	});
})( jQuery );
