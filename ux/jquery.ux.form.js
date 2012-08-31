/*
 * jQuery UX Form @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://code.google.com/p/jquery-ux-forms/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *	jquery.ux.inputbox.js
 *	jquery.ux.checkbox.js
 *	jquery.ux.tooltip.js
 *	jquery.ux.filebox.js
 *	jquery.ux.radio.js
 *	jquery.ux.selectbox.js
 *	jquery.ux.textbox.js
 *	jquery.ui.button.js
 *	jquery.ui.datepicker.js
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
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
			disabled: true,
			message: undefined
		},
		check: function(widget) {
			return true;
		},
		success: function(widget) {
			$(widget)
				.removeClass('ui-state-error')
				.tooltip('option', 'disabled', true);
		},
		failure: function(widget) {
			$(widget)
				.addClass('ui-state-error')
				.tooltip('option', 'message', this.tooltip.message)
				.tooltip('option', 'disabled', false);
		}
	};

	$.widget('ux.form', {
		version: '@VERSION',
		options: {
			ajax: false,

			validation: { }
		},
		_create: function() {
			var self = this,
				options = self.options;

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

			//Loop over and apply widgets for form items.
			var inputs = $(this.element).find('button,input,select,textarea')
			$.each(inputs, function() {
				var element = $(this),
					widget = undefined;

				self._callWidget($(this));
				widget = self._callWidget($(this), 'widget');

				//console.debug(widget);

				//Check to see if validation should be applied.
				if (widget != undefined && $(this).attr('name') != undefined) {
					//Get the predefined validation options for form item names.
					var validationOptions = $(options.validation).prop($(this).attr('name'));
					if (validationOptions != undefined) {
						//Add the current element to the options.
						//validationOptions.element = $(this);

						//Extend the items defiend options with the default option set.
						validationOptions = $.extend(true, {}, validationDefaultOptions, validationOptions);

						//Set the .ux.form validation item based on input:name
						$(options.validation).prop($(this).attr('name'), validationOptions);

						//Create an error widget for the form item.
						widget.tooltip(validationOptions.tooltip);

						//If we are doing live validation.
						if (validationOptions.live == true) {
							widget.bind({
								'change.ux.form': function() {
									self._validate(element, widget);
								}
							});
						}
					}
				}
			});
		},
		_destroy: function() {
			//TODO implement
		},
		_validate: function(element, widget) {
			var validationOptions = $(this.options.validation).prop($(element).attr('name'));
			if (validationOptions != undefined) {
				//If there are validation rules continue
				var siblings = this.element.find($(element).prop('nodeName') + '[name="' + $(element).attr('name') + '"]');
				if (siblings.is(':checkbox, :radio')) {
					siblings = siblings.filter(':checked');
				}

				var valid = true
					msg = null;
				$.each(siblings, function() {
					//Do automated check for empty
					if (valid && validationOptions.required == true) {
						if ($(element).val() == null || $(element).val().length == 0) {
							valid = false;
							msg = 'This field is required.';
						}
					}

					//Do automated check for numeric
					if (valid && validationOptions.numeric == true) {
						if (! $(element).val().match('^[0-9\.\-]*$')) {
							valid = false;
							msg = 'This field must be a numeric value.';
						}
					}

					//Do automated check for valid email
					if (valid && validationOptions.email == true) {
						if (! $(element).val().match('^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$')) {
							valid = false;
							msg = 'This field must be a valid email address.';
						}
					}

					//Do automated check for valid date
					if (valid && validationOptions.date == true) {
						var date, day, month, year;
						day = $.datepicker.parseDate('dd', $(element).datepicker('getDate'));
						month = $.datepicker.parseDate('mm', $(element).datepicker('getDate'));
						year = $.datepicker.parseDate('yy', $(element).datepicker('getDate'));

						date = new Date(year, month, day);

						if (date.getFullYear() != year || date.getMonth() != month || date.getDate() != day) {
							valid = false;
							msg = 'This field must be a valid date.';
						}
					}

					//Do automated check for minimum length
					if (valid && validationOptions.minLength != undefined) {
						if ($(element).val().length < validationOptions.minLength) {
							valid = false;
							msg = 'The minimum length of this field is ' + validationOptions.minLength + ' characters.';
						}
					}

					//Do automated check for maximum length
					if (valid && validationOptions.maxLength != undefined) {
						if ($(element).val().length > validationOptions.maxLength) {
							valid = false;
							msg = 'The maximum length of this field is ' + validationOptions.maxLength + ' characters.';
						}
					}

					//Run the check function for custom validation.
					valid = valid && validationOptions.check(element);
					if (msg != null) {
						validationOptions.tooltip.message = msg;
					}
				});
			}

console.log("Is Valid: " + valid)
			if (valid) {
				validationOptions.success(widget);
			}
			else {
				validationOptions.failure(widget);
			}

			return valid;
		},
		_submit: function(event) {
			var self = this,
				status = true;

			//Apply validation rules
			$.each(this.options.validation, function(key, value) {
				$.each($(event.target).find('[name="' + key + '"]'), function() {
					status = status && self._validate(this);
				});
			});

			//We must prevent the form submit because there is an error or it
			//will be sent via ajax.
			if (!status || this.options.ajax) {
				event.preventDefault();
			}

			if (status && this.options.ajax) {
				//Do AJAX Post
				$.ajax({
					type: this.element.attr('method'),
					url: this.element.attr('action'),
					data: this.element.serialize(),
					success: function(data) {
						var obj = $.parseJSON(data);

						if (obj.success == true) {
							self._trigger('success', null, obj.data);
						}
						else {
							$.each(obj.data, function(key, value) {
								self.element.find('[name="' + key + '"]')
									.error('option', {
										error: true,
										message: value
									});
							});

							self._trigger('failure', null, obj.data);
						}
					},
					error: function(jqXHR, textStatus, errorThrown) {
						self._trigger('error', jqXHR, textStatus, errorThrown);
					}
				});
			}
		},
		_reset: function(event) {
			var self = this;

			//We must prevent the default action for the form reset because resets DO NOT trigger chagne events on form elements.
			event.preventDefault();

			//Default form reset callback.  Just blanks out the form.
			var inputs = $(this.element).find('input,select,textarea');
			$.each(inputs, function() {
				self._callWidget($(this), 'reset');
			});
		},
		_callWidget: function(element, method) {
			var val = undefined;

			if(element.is(':button, :reset, :submit')) {
				val = element.button(method);
			}
			else if (element.is(':checkbox')) {
				val = element.checkbox(method);
			}
			else if (element.is(':radio')) {
				val = element.radio(method);
			}
			else if (element.is(':file')) {
				val = element.filebox(method);
			}
			else if (element.is(':text') && element.hasClass('date')) {
				val = element.datebox(method);
			}
			else if (element.is(':text') || element.is('textarea') || element.is(':password')) {
				val = element.textbox(method);
			}
			else if (element.is('select')) {
				val = element.selectbox(method);
			}

			return val;
		}
	});
})( jQuery );
