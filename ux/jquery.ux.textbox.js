/*
 * jQuery UX Textbox @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *		jquery.ux.element
 */
(function( $, undefined ) {

	$.widget('ux.textbox', $.ux.inputbox, {
		options: {
			icons: {
				/* primary: 'ui-icon-calendar' */
			}
		},
		_create: function() {
			var self = this;

			//Call super._create()
			$.ux.inputbox.prototype._create.call(this);

			this.label.remove();

			//Create the label and add it to the widget.
			this.label = this.element
				.addClass('ux-textbox')
				.appendTo(this.ux_element);
		},
		_hideElement: function() {
			//Do Nothing
		},
		_showElement: function() {
			//Do Nothing
		},
		_destroy: function() {
			//Call super._destroy()
			$.ux.inputbox.prototype._destroy.call();

			this.ux_element.unbind('.ux.datebox');
		}
	});

	/*
	$.widget('ux.textbox', {
		version: '@VERSION',
		defaultElement: '<input>',
		_create: function() {
			this.element
				.addClass('ui-widget ui-state-default  ui-corner-all ux-textbox')
				.bind({
					'mouseover.ux.textbox': function() {
						$(this).addClass('ui-state-hover');
					},
					'mouseout.ux.textbox': function() {
						$(this).removeClass('ui-state-hover');
					},
					'focusin.ux.textbox': function() {
						$(this).addClass('ui-state-focus');
					},
					'focusout.ux.textbox': function() {
						$(this).removeClass('ui-state-focus');
					}
				});
		},
		_destroy: function() {
			this.element
				.removeClass('ui-widget ui-state-default ui-corner-all ui-state-disabled ui-state-hover ui-state-focus ux-textbox')
				.unbind('.ux.textbox');
		},
		_init: function() {
			this._setOption('default', this.element.val());
			this._setOption('disabled', this.element.is(':disabled'));
		},
		reset: function() {
			this.element.val(this.option('default')).change();
		}
	});
	*/
})( jQuery );
