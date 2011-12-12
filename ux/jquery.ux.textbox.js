/*
 * jQuery UX Textbox @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *
 */
(function( $, undefined ) {
	$.widget("ux.textbox", {
		version: "@VERSION",
		defaultElement: "<input>",
		_create: function() {
			this.element
				.addClass('ui-widget ui-state-default ui-corner-all ux-textbox');
			
			this.element.bind({
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
		_init: function() {
			this._setOption('default', this.element.val());
			this._setOption('disabled', this.element.is(':disabled'));
		},
		_destroy: function() {
			this.element
				.removeClass('ux-textbox ui-widget ui-state-default ui-state-disabled ui-corner-all ui-state-focus')
				.unbind('.ux.textbox');
		},
		reset: function() {
			this.element.val(this.option('default')).trigger('change');
		}
	});
})( jQuery );
