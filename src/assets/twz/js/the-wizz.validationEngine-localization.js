(function ($) {
    $(document).ready(function () {
        $.extend(true, $.validationEngineLanguage.allRules, the_wizz_validationEngine_localization);
        $(".the-wizz-validate-form").validationEngine('attach');
    });
})(jQuery);