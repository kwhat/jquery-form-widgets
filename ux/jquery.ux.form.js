/*
 * jQuery UX Form @VERSION
 *
 * Copyright 2011, AUTHORS.txt
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *		jquery.ux.checkbox.js
 *		jquery.ux.error.js
 *		jquery.ux.filebox.js
 *		jquery.ux.radio.js
 *		jquery.ux.selectbox.js
 *		jquery.ux.textbox.js
 *		jquery.ui.button.js
 *		jquery.ui.datepicker.js
 *		jquery.ui.core.js
 *		jquery.ui.widget.js
 */
(function( $, undefined ) {
	var validationDefaultOptions = {
		live: false,
		required: false,
		email: false,
		date: false,
		numeric: false,
		minLength: undefined,
		maxLength: undefined,
		tooltip: {
			message: 'There is a problem with this field.'
		},
		check: function(element) {
			return true;
		},
		success: function(element) {
			$(element).error('option', 'error', false);
		},
		failure: function(element) {
			this.tooltip.error = true;
			$(element).error('option', this.tooltip);
		}
	};
	
	$.widget('ux.form', {
		version: '@VERSION',
		options: {
			ajax: false,
			
			validation: { }
		},
		_create: function() {
			var self = this, options = self.options;
			
			//Bind submit and reset events for this form.
			$(this.element).bind('submit', function(event) {
				//Set the from element to the form that produced the event.
				self._submit(event);
			});
			
			$(this.element).bind('reset', function(event) {
				//Set the from element to the form that produced the event.
				self._reset(event);
			});
			
			//Apply form styling.
			this.element.find('fieldset').addClass('ui-widget');
			this.element.find('legend').addClass('ui-widget-header ui-corner-all');

			var inputs = $(this.element).find('button,input,select,textarea')
			$.each(inputs, function() {
				if($(this).is(':button, :reset, :submit')) {
					$(this).button();
				}
				else if($(this).is(':checkbox')) {
					$(this).checkbox();
				}
				else if($(this).is(':radio')) {
					$(this).radio();
				}
				else if($(this).is(':file')) {
					$(this).filebox();
				}
				else if($(this).is(':text') && $(this).hasClass('date')) {
					$(this).datebox();
				}
				else if($(this).is(':text') || $(this).is('textarea') || $(this).is(':password')) {
					$(this).textbox();
				}
				else if($(this).is('select')) {
					$(this).selectbox();
				}
				
				//Check to see if validation should be applied.
				var validationOptions = $(options.validation).prop($(this).attr('name'));
				if (validationOptions != undefined) {
					//Extend the items defiend options with the default option set.
					validationOptions = $.extend(true, {}, validationDefaultOptions, validationOptions);
					$(options.validation).prop($(this).attr('name'), validationOptions);
					
					//Create an error widget for the form item.
					$(this)
						//FIXME This needs apply to ux_elements not elements.
						.error(validationOptions);
					
					//If we are doing live validation.
					if (validationOptions.live == true) {
						$(this).bind({
							'blur.ux.form': function(event) {
								self._validate(event.target);
							}
						});
					}
				}
			});
		},
		_destroy: function() {
			//TODO implement
		},
		_validate: function(element) {
			var validationOptions = $(this.options.validation).prop($(element).attr('name'));
			var status = true;
			
			var siblings = this.element.find(element.nodeName + ':[name="' + $(element).attr('name') + '"]');
			$.each(siblings, function() {
				var isValid = true;
				
				//Do automated check for empty
				if (isValid && validationOptions.required == true) {
					if ($(element).val().length == 0) {
						isValid = false;
						validationOptions.tooltip.message = 'This field is required.';
					}
				}
				
				//Do automated check for numeric
				if (isValid && validationOptions.numeric == true) {
					if (! $(element).val().match('^[0-9\.\-]*$')) {
						isValid = false;
						validationOptions.tooltip.message = 'This field should be a numeric value.';
					}
				}
				
				//Do automated check for valid email
				if (isValid && validationOptions.email == true) {
					if (! $(element).val().match('^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$')) {
						isValid = false;
						validationOptions.tooltip.message = 'This field should be a valid email address.';
					}
				}
				
				//Do automated check for valid date
				if (isValid && validationOptions.date == true) {
					var date, day, month, year;
					day = $.datepicker.parseDate('dd', $(element).datepicker('getDate'));
					month = $.datepicker.parseDate('mm', $(element).datepicker('getDate'));
					year = $.datepicker.parseDate('yy', $(element).datepicker('getDate'));
					
					date = new Date(year, month, day);
					
					if (date.getFullYear() != year || date.getMonth() != month || date.getDate() != day) {
						isValid = false;
						validationOptions.tooltip.message = 'This field should be a valid date.';
					}
				}
				
				//Do automated check for minimum length
				if (isValid && validationOptions.minLength != undefined) {
					if ($(element).val().length < validationOptions.minLength) {
						isValid = false;
						validationOptions.tooltip.message = 'The minimum length of this field is ' + validationOptions.minLength + ' characters.';
					}
				}
				
				//Do automated check for maximum length
				if (isValid && validationOptions.maxLength != undefined) {
					if ($(element).val().length > validationOptions.maxLength) {
						isValid = false;
						validationOptions.tooltip.message = 'The maximum length of this field is ' + validationOptions.maxLength + ' characters.';
					}
				}
				
				//Run the check function for custom validation.
				isValid = isValid && validationOptions.check(element);
				
				if (!isValid) {
					status = false;
				}
			});
			
			if (status == true) {
				validationOptions.success(element);
			}
			else {
				validationOptions.failure(element);
			}
		},
		_submit: function(event) {
			var self = this;

			if (this.options.ajax) {
				//We must prevent the default action the submit because we are doing it via ajax.
				event.preventDefault();
			}
			
			//Apply validation rules
			$.each(this.options.validation, function(key, value) {
				$.each($(event.target).find(':[name="' + key + '"]'), function(i, item) {
					self._validate(item);

					var validationOptions = $(self.options.validation).prop($(item).attr('name'));
					console.debug(validationOptions.check());
				});




				//self._validate($(':[name="' + key + '"]'));
				//console.debug(key);
				//console.debug($(':[name="' + key + '"]'));
			});

			//console.debug( $(event.target).find(':[name="date_box"]').data('test').addClass('ui-state-error') );
			
			/*
			if ($.isFunction(this.options.success)) {
				callbackFnk.call(this, data);
			}
			
			if ($.isFunction(this.options.failure)) {
				callbackFnk.call(this, data);
			}
			*/
		},
		_reset: function(e) {
			//We must prevent the default action for the form reset because resets DO NOT trigger chagne events on form elements.
			e.preventDefault();
			
			//Default form reset callback.  Just blanks out the form.
			
			var inputs = $(this.element).find('input,select,textarea');
			$.each(inputs, function() {
				if ($(this).is(':checkbox')) {
					$(this).checkbox('reset');
				}
				else if ($(this).is(':radio')) {
					$(this).radio('reset');
				}
				else if ($(this).is(':file')) {
					$(this).filebox('reset');
				}
				else if ($(this).is(':text') && $(this).hasClass('date')) {
					$(this).datebox('reset');
				}
				else if ($(this).is(':text') || $(this).is('textarea') || $(this).is(':password')) {
					$(this).textbox('reset');
				}
				else if ($(this).is('select')) {
					$(this).selectbox('reset');
				}
			});

			//$(event.target).find(':checked, :radio').removeAttr('checked').change();
			//$(event.target).find(':selected').removeAttr('selected').change();
			//$(event.target).find('input[type="text"], input[type="file"], textarea').val('').change();
		}
	});
})( jQuery );
