/*
 * jQuery Form @VERSION
 *
 * Copyright 2013, AUTHORS.txt
 * Released under the MIT license.
 *
 * http://code.google.com/p/jquery-form-widgets/
 *
 * Depends:
 *	jquery.form.inputbox.js
 *	jquery.form.checkbox.js
 *	jquery.form.filebox.js
 *	jquery.form.radio.js
 *	jquery.form.selectbox.js
 *	jquery.form.textbox.js
 *	jquery.ui.button.js
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
		message: 'An error occured.',
		check: function(widget) {
			return true;
		},
		success: function(widget) {
			widget
				.removeClass('ui-state-error')
				.removeAttr('title')
				.filter(':data("ui-tooltip")')
				.tooltip('destroy');
		},
		failure: function(widget) {
			widget
				.addClass('ui-state-error')
				.attr('title', this.message)
				.tooltip({
					track: true,
					tooltipClass: "ui-state-error"
					/*,
					content: function() {
						// Something like this should be used
						if ($(this).is('[title]')) {
							return $(this).attr('title');
						}

					   return msg;
					}
					*/
				});
		}
	};

	$.widget('form.form', {
		defaultElement: '<form>',
		version: '@VERSION',
		options: {
			ajax: false,
			validation: {}
		},
		_create: function() {
			var self = this;

			//Bind submit and reset events for this form.
			this._on({
				submit: this._submit,
				reset: this._reset
			});

			//Apply form styling.
			this.element.find('fieldset').addClass('ui-widget');
			this.element.find('legend').addClass('ui-widget-header ui-corner-all');

			//Loop over and apply widgets for form items.
			$.each(this.element.find('button,input,select,textarea'), function(index, value) {
				var	element = $(value),
					valopts = $(self.options.validation),
					//Get the predefined validation options for form item names.
					name = element.prop('name'),
					validation = valopts.prop(name)
					widgetOptions = {};

				// If enabled setup live validation.
				if (validation && validation.live) {
					widgetOptions = {
						change: function(event) {
							self._validate($(event.target));
						}
					};
				}

				if (element.is(':button, :reset, :submit')) {
					element.button();
				}
				else {
					self._callWidget(element, widgetOptions);
				}

				//Check to see if this element has any validation options set.
				if (validation != undefined) {
					//Merge the elements defiend options with the default options.
					validation = $.extend(true, {}, validationDefaultOptions, validation);

					//Set the .form validation item based on input:name
					valopts.prop(name, validation);
				}
			});
		},
		_destroy: function() {
			//TODO implement
		},
		_validate: function(element) {
			var	self = this,
				valopts = $(this.options.validation),
				//Get the predefined validation options for form item names.
				name = element.prop('name'),
				validation = valopts.prop(name);

			if (validation != undefined) {
				//If there are validation rules continue
				var siblings = this.element.find(element.prop('nodeName') + '[name="' + name + '"]');
				console.debug(siblings);
				//if (siblings.is(':checkbox, :radio')) {
				//	siblings = siblings.filter(':checked');
				//}

				var valid = true;
				$.each(siblings, function() {
					var widget = self._callWidget($(this), 'widget');

					//Do automated check for empty
					if (valid && validation.required == true) {
						if ($(this).val() == null || $(this).val().length == 0) {
							valid = false;
							validation.message = 'This field is required.';
						}
					}

					//Do automated check for numeric
					if (valid && validation.numeric == true) {
						if (! $(this).val().match('^[0-9\.\-]*$')) {
							valid = false;
							validation.message = 'This field must be a numeric value.';
						}
					}

					//Do automated check for valid email
					if (valid && validation.email == true) {
						if (! $(this).val().match('^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$')) {
							valid = false;
							validation.message = 'This field must be a valid email address.';
						}
					}

					//Do automated check for valid date
					if (valid && validation.date == true) {
						if (!$(this).is(':data("ui-datepicker")')) {
							$(this).datepicker();
						}

						var date = $(this).datepicker('getDate'),
							day, month, year;
						day = $.datepicker.parseDate('dd', date);
						month = $.datepicker.parseDate('mm', date);
						year = $.datepicker.parseDate('yy', date);

						date = new Date(year, month, day);

						if (date.getFullYear() != year || date.getMonth() != month || date.getDate() != day) {
							valid = false;
							validation.message = 'This field must be a valid date.';
						}
					}

					//Do automated check for minimum length
					if (valid && validation.minLength != undefined) {
						if ($(this).val().length < validation.minLength) {
							valid = false;
							validation.message = 'The minimum length of this field is ' + validation.minLength + ' characters.';
						}
					}

					//Do automated check for maximum length
					if (valid && validation.maxLength != undefined) {
						if ($(this).val().length > validation.maxLength) {
							valid = false;
							validation.message = 'The maximum length of this field is ' + validation.maxLength + ' characters.';
						}
					}

					//Run the check function for custom validation.
					valid = valid && validation.check(widget);

					if (valid) {
						validation.success(widget);
					}
					else {
						validation.failure(widget);
					}
				});
			}

			return valid;
		},
		_submit: function(event) {
			var self = this,
				status = true;

			self._trigger('submit', event);

			//Apply validation rules by looping over each rule
			$.each(this.options.validation, function(name) {
				//Look for form elements that have have the rule name.
				$.each($(event.target).find('[name="' + name + '"]'), function(index, element) {
					//Loop over the data map to try and find the widget data
					//item by looking for the form prefix in the key name.
					$.each($(this).data(), function(key, value) {
						if (key.match(/^form/i)) {
							status = self._validate($(element), value.widget()) && status;

							return false;
						}
					});
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
								var	valopts = $(self.options.validation),
									validation = valopts.prop(key),
									element = self.element.find('[name="' + key + '"]'),
									widget = self._callWidget(element, 'widget');

								if (validation != undefined) {
									validation.tooltip.message = value;
									validation.failure(widget);
								}
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

			self._trigger('reset', event);

			//We must prevent the default action for the form reset because resets DO NOT trigger chagne events on form elements.
			event.preventDefault();

			//Default form reset callback.  Just blanks out the form.
			var inputs = $(this.element).find('input,select,textarea');
			var i = 0;
			$.each(inputs, function() {
				console.debug('test' + (++i));
				self._callWidget($(this), 'reset');
			});

			console.debug('done');
		},
		_callWidget: function(element, method) {
			var val = undefined;

			if (element.is(':checkbox')) {
				val = element.checkbox(method);
			}
			else if (element.is(':radio')) {
				val = element.radio(method);
			}
			else if (element.is(':file')) {
				val = element.filebox(method);
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
