(function ($) {
    'use strict';
    $(document).ready(function ($) {
        window.twz_plugin_manager_lib_plugins = twz_plugin_manager_lib_params.twz_plugins;
        window.show_type = twz_plugin_manager_lib_params.show_type;
        

        function show_products(products) {
            for (const id in products) {
                let product = products[id];
                let boast_html = `<div class="plugin">
                    <div style="display:flex; flex-direction: column;">
                        <div style="padding: 0.5rem!important; text-align: center;">
                            <img style="width: -webkit-fill-available;; height: -webkit-fill-available;;" src="${product.twz_plugin_image}" alt="">
                        </div>
                        <div style="padding: 0.5rem!important;">
                            <div class="plugin-title">${product.twz_plugin_title}</div>
                            <p>${product.twz_plugin_description}'</p>
                            <p class="plugin-author">By: <b>${product.twz_plugin_author}</b></p>
                        </div>
                    </div>
                    <div class="activation-row">
                        <div class="custom-button">
                            <a class="custom-link" href="${product.twz_plugin_page_url}" target="_blank">More Details</a>
                        </div>
                    </div>
                </div>`;
                $("#twz-plugin-manager-panel").append(boast_html);
            }
        }

        $("#twz_plugin_tag").on("change", function () {
            var selected_item = $(this).val();
            const container = $('#twz-plugin-manager-panel');
            container.html('');

            let products = [];
            for (const id in twz_plugin_manager_lib_plugins) {
                let plugin = twz_plugin_manager_lib_plugins[id];
                let tags = Object.values(plugin.twz_plugin_tags);
                if (tags.includes(selected_item)) {
                    products.push(plugin);
                }
            };
            show_products(products);


        }).trigger('change');

        if(show_type === 'addons') {
            show_products(twz_plugin_manager_lib_plugins); 
        }
    });
})(jQuery);