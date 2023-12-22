(function ($) {
    'use strict';

    $(document).ready(function ($) {

        var TWZ_Quiz_Configuration = {
            twz_quiz_pages: [],

            init: function () {
                this.init_wizard();
                this.quiz_methods();
                this.init_sortable();
            },
            init_wizard: function () {
             //   twz_quiz_params = JSON.parse(twz_quiz_params);
                console.log('twz_quiz_params', twz_quiz_params);
                this.twz_quiz_pages = twz_quiz_params.pages;
                console.log('twz_quiz_pages', this.twz_quiz_pages);

                this.twz_quiz_pages.forEach((page) => {
                    TWZ_Quiz_Configuration.add_new_page(page.id);
                });
            },
            quiz_methods: function () {
                $('#twz_quiz_add_page_button').on('click', function (event) {
                    event.preventDefault();
                    TWZ_Quiz_Configuration.add_new_page();
                });

                $('.questions').on('click', '.edit-page-button', function (event) {
                    event.preventDefault();
                    TWZ_Quiz_Configuration.open_edit_page($(this));
                });

                $('.questions').on('click', '.delete-page-button', function (event) {
                    event.preventDefault();
                    if (confirm("Are you sure you want to delete this entry?")) {
                        var pageID = $(this).data('page-id');
                        TWZ_Quiz_Configuration.delete_page(pageID);
                    }
                });

                $('.questions').on('click', '.new-question-button', function (event) {
                    event.preventDefault();
                    var pageID = $(this).data('page-id');
                    TWZ_Quiz_Configuration.add_new_question(pageID);
                });

                $('.questions').on('click', '.edit-question-button', function (event) {
                    event.preventDefault();
                    TWZ_Quiz_Configuration.open_edit_question($(this));
                });

                $('.questions').on('click', '.delete-question-button', function (event) {
                    event.preventDefault();
                    if (confirm("Are you sure you want to delete this entry?")) {
                        var pageID = $(this).data('page-id');
                        var questionID = $(this).data('question-id');
                        TWZ_Quiz_Configuration.delete_question(pageID, questionID);
                    }
                });

                $('.questions').on('click', '.add-answer-button', function (event) {
                    event.preventDefault();
                    var pageID = $(this).data('page-id');
                    var questionID = $(this).data('question-id');
                    TWZ_Quiz_Configuration.add_new_answer(pageID, questionID);
                });

                $('.questions').on('click', '.twz-quiz-remove-question-answer-button', function (event) {
                    event.preventDefault();
                    if (confirm("Are you sure you want to delete this entry?")) {
                        var pageID = $(this).data('page-id');
                        var questionID = $(this).data('question-id');
                        var answerID = $(this).data('answer-id');
                        TWZ_Quiz_Configuration.delete_answer(pageID, questionID, answerID);
                    }
                });

            },
            init_sortable: function () {
                $('.questions').sortable({
                    opacity: 70,
                    cursor: 'move',
                    handle: 'span.dashicons-move',
                    placeholder: "ui-state-highlight",
                    stop: function (evt, ui) {
                        TWZ_Quiz_Configuration.re_index_page();
                    }
                });
                $('.page').sortable({
                    items: '.question',
                    handle: 'span.dashicons-move',
                    opacity: 70,
                    cursor: 'move',
                    placeholder: "ui-state-highlight",
                    connectWith: '.page',
                    stop: function (evt, ui) {
                        setTimeout(
                            function () {
                                $('.save-page-button').trigger('click');
                            },
                            200
                        )
                    }
                });
                $('.answers').sortable({
                    items: '.twz-quiz-answer',
                    opacity: 0.6,
                    cursor: 'move',
                    axis: 'y',
                });
            },
            re_index_page: function () {
                $('.questions > .page').each(function () {
                    var page = parseInt($(this).index()) + 1;
                    $(this).find('.page-number').text('Page ' + page);
                });
                setTimeout(
                    function () {
                        $('.save-page-button').trigger('click');
                    },
                    200
                )
            },
            add_new_page: function (pageID) {
                if (typeof pageID == 'undefined' || pageID == '') {
                    var maxPageID = 0;
                    if (this.twz_quiz_pages.length !== 0) {
                        maxPageID = this.twz_quiz_pages.reduce(
                            (max, item) => (item.id > max ? item.id : max),
                            this.twz_quiz_pages[0].id
                        );
                    }
                    var newPageID = maxPageID + 1;
                    var pageID = newPageID;

                    var pageInfo = {
                        id: newPageID,
                        key: qsmRandomID(8),
                        status: "checked='checked'",
                        questions: []
                    }
                    this.twz_quiz_pages.push(pageInfo);
                } else {
                    var pageInfo = this.twz_quiz_pages.find(item => item.id == pageID);
                }

                var template = wp.template('twz-page');
                $('.questions').append(template(pageInfo));

                var page_index = $('.questions').find('.page').length;
                $('#page_' + pageID + '_container').find('.page-number').text('Page ' + page_index);

                $('.page').sortable({
                    items: '.question',
                    opacity: 70,
                    cursor: 'move',
                    handle: 'span.dashicons-move',
                    placeholder: "ui-state-highlight",
                    connectWith: '.page',
                    stop: function (evt, ui) {
                        TWZ_Quiz_Configuration.re_index_page();
                    }
                });

                var questions = Object.values(pageInfo.questions);
                if (typeof questions != 'undefined' && questions.length !== 0) {
                    questions.forEach((question) => {
                        TWZ_Quiz_Configuration.add_new_question(pageID, question);
                    });
                } else {
                    TWZ_Quiz_Configuration.add_new_question(pageID);
                }
            },
            open_edit_page: function (CurrentElement) {
                var opened_el = jQuery('.questions').find('.opened_page');
                var opened_page_id = opened_el.data('page-id');
                var opened_element_id = 'page_' + opened_page_id + '_container_editor';

                var pageID = CurrentElement.data('page-id');
                var page_element_id = 'page_' + pageID + '_container_editor';

                if (opened_el.data('page-id') == pageID) {
                    if ($('#' + page_element_id).is(":visible")) {
                        $('#' + page_element_id).slideUp('slow');
                        $('#' + page_element_id).css('display', 'none');
                        $('#page_' + pageID + '_container').removeClass('opened_page');
                    } else {
                        $('#' + page_element_id).slideDown('slow');
                        $('#' + page_element_id).css('display', 'inline-block');
                        $('#page_' + pageID + '_container').addClass('opened_page');
                    }
                } else {
                    $('#' + opened_element_id).slideUp('slow');
                    $('#' + opened_element_id).css('display', 'none');
                    $('#page_' + opened_page_id + '_container').removeClass('opened_page');

                    $('#' + page_element_id).slideDown('slow');
                    $('#' + page_element_id).css('display', 'inline-block');
                    $('#page_' + pageID + '_container').addClass('opened_page');
                }

            },
            delete_page: function (pageID) {
                $('#page_' + pageID + '_container').remove();
                var pageIndex = this.twz_quiz_pages.findIndex(item => item.id == pageID);
                this.twz_quiz_pages.splice(pageIndex, 1);
                TWZ_Quiz_Configuration.re_index_page();
            },
            add_new_question: function (pageID, questionInfo = null) {
                if (questionInfo == null) {
                    var pageInfo = this.twz_quiz_pages.find(item => item.id == pageID);
                    var questions = pageInfo.questions;

                    var maxQuestionID = 0;
                    if (questions.length !== 0) {
                        maxQuestionID = questions.reduce(
                            (max, item) => (item.id > max ? item.id : max),
                            questions[0].id
                        );
                    }
                    var question_id = maxQuestionID + 1;

                    var questionInfo = {
                        id: question_id,
                        pageID: pageID,
                        key: qsmRandomID(8),
                        type: 'dropdown',
                        question: 'Your new question!',
                        answers: []
                    };
                    questions.push(questionInfo);
                }
                questionInfo.pageID = pageID;
                var template = wp.template('twz-question');
                $('#page_' + pageID + '_container_questions').append(template(questionInfo));

                TWZ_Quiz_Configuration.create_edit_question(questionInfo.id, pageID);
             //   TWZ_Quiz_Configuration.create_edit_question(questionInfo.id, $('#question_' + pageID + '_' + parseInt(questionInfo.id) + '_container'));
            },
            delete_question: function (pageID, questionID) {
                $('#question_' + pageID + '_' + questionID + '_container').remove();

                var pageInfo = this.twz_quiz_pages.find(item => item.id == pageID);
                var questions = pageInfo.questions;
                var questionIndex = questions.findIndex(item => item.id == questionID);
                questions.splice(questionIndex, 1);
            },
            create_edit_question: function (questionID, pageID) {
                var template = wp.template('twz-question-content');
  
                var pageInfo = this.twz_quiz_pages.find(item => item.id == pageID);
                var questions = Object.values(pageInfo.questions);
                var questionInfo = questions.find(item => item.id == questionID);
                var questionElements = template(questionInfo);

                var question_container_id = 'question_' + pageID + '_' + questionInfo['id'] + '_container';
                var question_element_id = 'question_' + pageID + '_' + questionInfo['id'] + '_element';
                $('#' + question_container_id).append("<div id='" + question_element_id + "' style='display: none;' class='questionElements'>" + questionElements + "</div>");

                $('#twz_quiz_' + questionInfo.key + '_type option[value=' + questionInfo.type + ']').attr('selected', 'selected');

                $('.question-title').on('input', function (event) {
                    event.preventDefault();
                    var parent_element = $(this).closest('.page');
                    var current_element = parent_element.find('.opened').find('.question-header-text');
                    current_element.html($(this).val());
                });

                var answers = Object.values(questionInfo.answers);
                if (typeof answers != 'undefined' && answers.length !== 0) {
                    answers.forEach((answer) => {
                        TWZ_Quiz_Configuration.add_new_answer(pageID, questionID, answer.id);
                    });
                } else {
                    TWZ_Quiz_Configuration.add_new_answer(pageID, questionID);
                }


            },
            create_edit_questionOld: function (questionID, CurrentElement) {
                var template = wp.template('twz-question-content');
                //   var pageID = CurrentElement.closest('.page').data('page-id');
                var pageID = CurrentElement.data('page-id');

                var pageInfo = this.twz_quiz_pages.find(item => item.id == pageID);
                var questions = pageInfo.questions;
                var questionInfo = questions.find(item => item.id == questionID);
                var questionElements = template(questionInfo);

                var question_container_id = 'question_' + pageID + '_' + questionInfo['id'] + '_container';
                var question_element_id = 'question_' + pageID + '_' + questionInfo['id'] + '_element';
                $('#' + question_container_id).append("<div id='" + question_element_id + "' style='display: none;' class='questionElements'>" + questionElements + "</div>");

                $('#twz_quiz_' + questionInfo.key + '_type option[value=' + questionInfo.type + ']').attr('selected', 'selected');

                $('.question-title').on('input', function (event) {
                    event.preventDefault();
                    var parent_element = $(this).closest('.page');
                    var current_element = parent_element.find('.opened').find('.question-header-text');
                    current_element.html($(this).val());
                });

                var answers = questionInfo.answers;
                if (typeof answers != 'undefined' && answers.length !== 0) {
                    answers.forEach((answer) => {
                        TWZ_Quiz_Configuration.add_new_answer(answer.pageID, answer.questionID, answer.id);
                    });
                } else {
                    TWZ_Quiz_Configuration.add_new_answer(pageID, questionID);
                }


            },
            open_edit_question: function (CurrentElement) {
                var opened_el = jQuery('.questions').find('.opened');
                var opened_element_id = 'question_' + opened_el.data('page-id') + '_' + opened_el.data('question-id') + '_element';

                var pageID = CurrentElement.data('page-id');
                var questionID = CurrentElement.data('question-id');
                var question_element_id = 'question_' + pageID + '_' + questionID + '_element';

                if (opened_el.data('page-id') == pageID && opened_el.data('question-id') == questionID) {
                    if ($('#' + question_element_id).is(":visible")) {
                        $('#' + question_element_id).slideUp('slow');
                        $('#' + question_element_id).css('display', 'none');
                        jQuery('.questions').find('.question').removeClass('opened');
                    } else {
                        $('#' + question_element_id).slideDown('slow');
                        $('#' + question_element_id).css('display', 'inline-block');
                        CurrentElement.parents('.question').addClass('opened');
                    }
                } else {
                    jQuery('.questions').find('.question').removeClass('opened');
                    $('#' + opened_element_id).slideUp('slow');
                    $('#' + opened_element_id).css('display', 'none');

                    $('#' + question_element_id).slideDown('slow');
                    $('#' + question_element_id).css('display', 'inline-block');
                    CurrentElement.parents('.question').addClass('opened');
                }

            },
            add_new_answer: function (pageID, questionID, answerID = undefined) {
                var template = wp.template('twz-answer-content');
                var pageInfo = this.twz_quiz_pages.find(item => item.id == pageID);
                var questions = Object.values(pageInfo.questions);
                var questionIndex = questions.findIndex(item => item.id == questionID);
                var questionInfo = questions[questionIndex];
                var answers = Object.values(questionInfo.answers);
                var answerInfo = null;

                if (typeof answerID == 'undefined') {
                    let maxAnswerID = 0;
                    if (answers.length !== 0) {
                        maxAnswerID = answers.reduce((max, item) => (item.id > max ? item.id : max), answers[0].id);
                    }
                    let answerID = maxAnswerID + 1;
                    answerInfo = {
                        id: answerID,
                        pageID: pageID,
                        questionID: questionID,
                        key: qsmRandomID(8),
                        answer: 'Your answer',
                    };
                    answers.push(answerInfo);
                } else {
                    answerInfo = answers.find(item => item.id == answerID);
                    answerInfo.pageID = pageID;
                    answerInfo.questionID = questionID;

                }

                let $template_html = template(answerInfo);
                $('#answers_' + pageID + '_' + questionID + '_container').append($template_html);
            },
            delete_answer: function (pageID, questionID, answerID) {
                $('#answer_' + pageID + '_' + questionID + '_' + answerID + '_container').remove();

                var pageInfo = this.twz_quiz_pages.find(item => item.id == pageID);
                var questions = Object.values(pageInfo.questions);
                var question = questions.find(item => item.id == questionID);
                var answers = Object.values(question.answers);
                var answerIndex = answers.findIndex(item => item.id == answerID);
                answers.splice(answerIndex, 1);
            },

        }

        function qsmRandomID(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        TWZ_Quiz_Configuration.init();
    });

})(jQuery);
