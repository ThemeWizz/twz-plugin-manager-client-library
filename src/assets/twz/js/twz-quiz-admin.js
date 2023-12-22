(function ($) {
	'use strict';

	$(document).ready(function ($) {

		var TWZ_Acq_Configuration = {

			init: function () {
				this.acq_methods();
				this.move();
				this.make_value();
			},

			acq_methods: function () {
				$('#twz_quiz_add_method_button').on('click', function () {
					var row = $('#twz-quiz-methods tr:last');
					var clone = row.clone();
					var count = row.parent().find('tr').length;
					clone.find('td input[type=text]').val('');
					clone.find('span').each(function () {
						var name = $(this).attr('id');
						name = name.replace(/(\d+)/, '' + parseInt(count) + '');
						$(this).attr('id', name);
					});
					clone.find('input, select').each(function () {
						var name = $(this).attr('name');
						name = name.replace(/\[(\d+)\]/, '[' + parseInt(count) + ']');
						$(this).attr('id', name);
						$(this).attr('name', name);
					});
					clone.insertAfter(row);
					return false;
				});

				$('body').on('click', '#twz-quiz-methods .twz-quiz-remove-method', function () {
					if (confirm('Remove this method? Reports will still be available for past records.')) {
						var count = $('#twz-quiz-methods tr:visible').length;

						if (count === 2) {
							$('#twz-quiz-methods input[type="text"]').val('');
						} else {
							$(this).closest('tr').remove();

							var rows = 0;
							$('.twz-quiz-method-row').each(function () {
								$(this).find('span').each(function () {
									var name = $(this).attr('id');
									name = name.replace(/(\d+)/, '' + parseInt(rows) + '');
									$(this).attr('id', name);
								});

								$(this).find('input, select').each(function () {
									var name = $(this).attr('name');
									name = name.replace(/\[(\d+)\]/, '[' + parseInt(rows) + ']');
									$(this).attr('name', name);
									$(this).attr('id', name);
								});

								rows++;
							});
						}
						TWZ_Acq_Configuration.move();
					}
					return false;
				});

			},

			move: function () {

				$("#twz-quiz-methods tbody").sortable({
					items: '.twz-quiz-method-row',
					opacity: 0.6,
					cursor: 'move',
					axis: 'y',
					update: function () {
						var count = 0;
						$(this).find('tr').each(function () {
							$(this).find('span').each(function () {
								var name = $(this).attr('id');
								name = name.replace(/(\d+)/, '' + parseInt(count) + '');
								$(this).attr('id', name);
							});

							$(this).find('input, select').each(function () {
								var name = $(this).attr('name');
								name = name.replace(/\[(\d+)\]/, '[' + parseInt(count) + ']');
								$(this).attr('name', name);
								$(this).attr('id', name);
							});

							count++;
						});
					}
				}).disableSelection();;
			},

			make_value: function () {
				$('body').on('blur', '.twz-memberships-acquisition-name input', function () {

					var name = $(this).val().replace(/\W+/g, '-').toLowerCase();

					var value_input = $(this).parent().parent().parent().find('.twz-memberships-acquisition-value input');
					var current_value = value_input.val();

					if (current_value.length == 0) {
						var found_names = 0;
						$('#twz-quiz-methods tbody').find('.twz-memberships-acquisition-value input').each(function () {
							if ($(this).val() == name) {
								found_names++;
							}
						});

						if (found_names > 0) {
							name = name + found_names;
						}

						value_input.val(name);
					}
				});
			}

		}
		TWZ_Acq_Configuration.init();
	});

})(jQuery);
