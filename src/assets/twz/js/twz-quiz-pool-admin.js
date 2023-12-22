(function ($) {
	'use strict';

	$(document).ready(function ($) {
		console.log('twz_quiz_pool_params', twz_quiz_pool_params);
		var $flowchart = $('#flowchartworkspace');
		var $container = $flowchart.parent();


		// Apply the plugin on a standard, empty div...
		$flowchart.flowchart({
			data:  twz_quiz_pool_params.twz_quiz_pool_data,
			defaultSelectedLinkColor: '#000055',
			grid: 10,
			multipleLinksOnInput: true,
			multipleLinksOnOutput: true
		});


		function getOperatorData($element) {
			var survey_id = parseInt($element.data('survey-id'), 10);
			var survey = twz_quiz_pool_params.nodes[survey_id];
			console.log('survey', survey);
			var data = {
				properties: {
					id: survey.id,
					type: survey.type,
					title: survey.title,
					inputs: survey.inputs,
					outputs: survey.outputs
				}
			};

			return data;
		}



		//-----------------------------------------
		//--- operator and link properties
		//--- start
		var $operatorProperties = $('#operator_properties');
		$operatorProperties.hide();
		var $linkProperties = $('#link_properties');
		$linkProperties.hide();
		var $operatorTitle = $('#operator_title');
		var $linkColor = $('#link_color');

		$flowchart.flowchart({
			onOperatorSelect: function (operatorId) {
				$operatorProperties.show();
				$operatorTitle.val($flowchart.flowchart('getOperatorTitle', operatorId));
				return true;
			},
			onOperatorUnselect: function () {
				$operatorProperties.hide();
				return true;
			},
			onLinkSelect: function (linkId) {
				$linkProperties.show();
				$linkColor.val($flowchart.flowchart('getLinkMainColor', linkId));
				return true;
			},
			onLinkUnselect: function () {
				$linkProperties.hide();
				return true;
			}
		});

		$operatorTitle.keyup(function () {
			var selectedOperatorId = $flowchart.flowchart('getSelectedOperatorId');
			if (selectedOperatorId != null) {
				$flowchart.flowchart('setOperatorTitle', selectedOperatorId, $operatorTitle.val());
			}
		});

		$linkColor.change(function () {
			var selectedLinkId = $flowchart.flowchart('getSelectedLinkId');
			if (selectedLinkId != null) {
				$flowchart.flowchart('setLinkMainColor', selectedLinkId, $linkColor.val());
			}
		});
		//--- end
		//--- operator and link properties
		//-----------------------------------------

		//-----------------------------------------
		//--- delete operator / link button
		//--- start
		$('.delete_selected_button').click(function () {
			$flowchart.flowchart('deleteSelected');
		});
		//--- end
		//--- delete operator / link button
		//-----------------------------------------



		//-----------------------------------------
		//--- create operator button
		//--- start
		var operatorI = 0;
		$flowchart.parent().siblings('.create_operator').click(function () {
			var operatorId = 'created_operator_' + operatorI;
			var operatorData = {
				top: ($flowchart.height() / 2) - 30,
				left: ($flowchart.width() / 2) - 100 + (operatorI * 10),
				properties: {
					title: 'Operator ' + (operatorI + 3),
					inputs: {
						input_1: {
							label: 'Input 1',
						}
					},
					outputs: {
						output_1: {
							label: 'Output 1',
						}
					}
				}
			};

			operatorI++;

			$flowchart.flowchart('createOperator', operatorId, operatorData);

		});
		//--- end
		//--- create operator button
		//-----------------------------------------




		//-----------------------------------------
		//--- draggable operators
		//--- start
		//var operatorId = 0;
		var $draggableOperators = $('.draggable_operator');
		$draggableOperators.draggable({
			cursor: "move",
			opacity: 0.7,

			// helper: 'clone',
			appendTo: 'body',
			zIndex: 1000,

			helper: function (e) {
				var $this = $(this);
				var data = getOperatorData($this);
				return $flowchart.flowchart('getOperatorElement', data);
			},
			stop: function (e, ui) {
				var $this = $(this);
				var elOffset = ui.offset;
				var containerOffset = $container.offset();
				if (elOffset.left > containerOffset.left &&
					elOffset.top > containerOffset.top &&
					elOffset.left < containerOffset.left + $container.width() &&
					elOffset.top < containerOffset.top + $container.height()) {

					var flowchartOffset = $flowchart.offset();

					var relativeLeft = elOffset.left - flowchartOffset.left;
					var relativeTop = elOffset.top - flowchartOffset.top;

					var positionRatio = $flowchart.flowchart('getPositionRatio');
					relativeLeft /= positionRatio;
					relativeTop /= positionRatio;

					var data = getOperatorData($this);
					data.left = relativeLeft;
					data.top = relativeTop;

					$flowchart.flowchart('addOperator', data);
				}
			}
		});
		//--- end
		//--- draggable operators
		//-----------------------------------------


		//-----------------------------------------
		//--- save and load
		//--- start
		function Flow2Text() {
			var data = $flowchart.flowchart('getData');
			$('#flowchart_data').val(JSON.stringify(data, null, 2));
		}
		$('#get_data').click(Flow2Text);

		function Text2Flow() {
			var data = JSON.parse($('#flowchart_data').val());
			$flowchart.flowchart('setData', data);
		}
		$('#set_data').click(Text2Flow);

		$(document).on('click touch', '#create_the_wizz_quiz_pool, #edit_the_wizz_quiz_pool', function (e) {
			e.preventDefault();
			var $btn = $(this);
			$btn.addClass('loading');

			var twz_quiz_pool_status = $('#twz_quiz_pool_status').val();
			var twz_quiz_pool_name = $('#twz_quiz_pool_name').val();
			var twz_quiz_pool_data = $flowchart.flowchart('getData');
			//	if (twz_quiz_pool_data.length = 0) return;
 
			if ($btn.hasClass('add')) {
				var data = {
					action: 'twz_quiz_add',
					twz_quiz_pool_status: twz_quiz_pool_status,
					twz_quiz_pool_name: twz_quiz_pool_name,
					twz_quiz_pool_data: twz_quiz_pool_data,
					nonce: twz_quiz_pool_params.nonce,
				};
				$.post(twz_quiz_pool_params.ajax_url, data, function (response) {
					console.log(response, response.status, response.url);
					$btn.removeClass('loading');
					if (response.status) {
						window.location.href = response.url;
					} else {
						$('#notifications').append(response.error_msg);
					}
				});
			} else if ($btn.hasClass('update')) {
				var twz_quiz_pool_id = $('#twz_quiz_pool_id').val();

				var data = {
					action: 'twz_quiz_update',
					twz_quiz_pool_id: twz_quiz_pool_id,
					twz_quiz_pool_status: twz_quiz_pool_status,
					twz_quiz_pool_name: twz_quiz_pool_name,
					twz_quiz_pool_data: twz_quiz_pool_data,
					nonce: twz_quiz_pool_params.nonce,
				};
				$.post(twz_quiz_pool_params.ajax_url, data, function (response) {
					$btn.removeClass('loading');
					if (response.status) {
						window.location.href = response.url;
					} else {
						$('#notifications').append(response.error_msg);
					}
				});
			}
		});

		/*global localStorage*/
		function SaveToLocalStorage() {
			if (typeof localStorage !== 'object') {
				alert('local storage not available');
				return;
			}
			Flow2Text();
			localStorage.setItem("stgLocalFlowChart", $('#flowchart_data').val());
		}
		$('#save_local').click(SaveToLocalStorage);

		function LoadFromLocalStorage() {
			if (typeof localStorage !== 'object') {
				alert('local storage not available');
				return;
			}
			var s = localStorage.getItem("stgLocalFlowChart");
			if (s != null) {
				$('#flowchart_data').val(s);
				Text2Flow();
			} else {
				alert('local storage empty');
			}
		}
		$('#load_local').click(LoadFromLocalStorage);
		//--- end
		//--- save and load
		//-----------------------------------------


	});
	var defaultFlowchartData = {
		"operators": {
			"0": {
				"properties": {
					"title": "Survey 1",
					"inputs": {
						"input_0": {
							"label": "Input 1"
						}
					},
					"outputs": {
						"google": {
							"label": "Google"
						}
					}
				},
				"left": 30,
				"top": 50
			},
			"1": {
				"properties": {
					"title": "Survey 2",
					"inputs": {
						"input_0": {
							"label": "Input 1"
						}
					},
					"outputs": {
						"output_0": {
							"label": "Output 1"
						}
					}
				},
				"left": 220,
				"top": 50
			}
		},
		"operatorTypes": {}
	}
	var defaultFlowchartData1 = {
		operators: {
			operator1: {
				top: 20,
				left: 20,
				properties: {
					title: 'Operator 1',
					inputs: {},
					outputs: {
						output_1: {
							label: 'Output 1',
						}
					}
				}
			},
			operator2: {
				top: 80,
				left: 300,
				properties: {
					title: 'Operator 2',
					inputs: {
						input_1: {
							label: 'Input 1',
						},
						input_2: {
							label: 'Input 2',
						},
					},
					outputs: {}
				}
			},
		},
		links: {
			link_1: {
				fromOperator: 'operator1',
				fromConnector: 'output_1',
				toOperator: 'operator2',
				toConnector: 'input_2',
			},
		}
	};
	if (false) console.log('remove lint unused warning', defaultFlowchartData);


})(jQuery);
