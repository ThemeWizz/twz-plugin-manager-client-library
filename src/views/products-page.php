<?php $this->prepare_items(); ?>

<div class="twz-quiz-plugin-installer">
    <?php foreach ($this->plugins as $plugin) {
        $button_classes = 'install button';
        $button_text    = __('Install Now');

        $main_plugin_file = $this->get_plugin_file($plugin['twz_plugin_slug']);

        if ($this->check_file_extension($main_plugin_file)) {
            if (is_plugin_active($main_plugin_file)) {
                // plugin activated.
                $button_classes = 'button disabled';
                $button_text    = __('Activated', 'twz-plugin-manager-client');
            } else {
                // Installed, let's activate it.
                $button_classes = 'activate btn btn-primary btn-sm';
                $button_text    = __('Activate', 'twz-plugin-manager-client');
            }
        }
        $twz_addons_groups = [];
        if (!empty($plugin['twz_addons_groups'])) {
            $twz_addons_groups = json_decode($plugin['twz_addons_groups']);
        }
    ?>
        <div class="plugin">
            <div class="d-flex" style="height: calc(100% - 107px);">
                <div class="p-2">
                    <?php if ($plugin['twz_plugin_icon']) { ?>
                        <img style="width: 100px;" src="<?php echo esc_attr($plugin['twz_plugin_icon']); ?>" alt="">
                    <?php } else { ?>
                        <img style="width: 100px;" src="https://s.w.org/plugins/geopattern-icon/classic-widgets.svg" alt="">
                    <?php } ?>
                </div>
                <div class="p-2">
                    <h2><?php echo wp_kses_post($plugin['twz_plugin_title']); ?></h2>
                    <p><?php echo wp_kses_post($plugin['twz_plugin_description']); ?></p>
                    <p class="plugin-author"><?php esc_attr_e('By', 'cnkt-installer'); ?> <?php echo wp_kses_post($plugin['twz_plugin_author']); ?></p>
                </div>
            </div>
            <div class="d-flex justify-content-center" style="height: 35px; color: green;">
                <?php foreach ($twz_addons_groups as $groups) {

                ?>
                    <p class="m-2"><?php echo (ucfirst($groups)); ?></p>

                <?php } ?>
            </div>
            <ul class="activation-row">
                <li>
                    <a class="<?php echo esc_attr($button_classes); ?>" data-slug="<?php echo esc_attr($plugin['twz_plugin_slug']); ?>" data-name="<?php echo esc_attr($plugin['twz_plugin_title']); ?>" href="#">
                        <?php echo esc_attr($button_text); ?>
                    </a>
                </li>
                <li>
                    <a href="<?php echo esc_attr($plugin['twz_plugin_help_url']); ?>/" target="_blank">
                        <?php esc_attr_e('More Details', 'cnkt-installer'); ?>
                    </a>
                </li>
            </ul>
        </div>
    <?php } ?>
</div>