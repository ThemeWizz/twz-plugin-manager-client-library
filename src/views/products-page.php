<?php $this->prepare_items(); ?>

<div class="twz-quiz-plugin-installer">
    <?php foreach ($this->plugins as $plugin) { ?>
        <div class="plugin">
            <div style="display:flex;">
                <div style="padding: 0.5rem!important;">
                    <img style="width: 100px;" src="<?php echo esc_attr($plugin['twz_plugin_image']); ?>" alt="">
                </div>
                <div style="padding: 0.5rem!important;">
                    <div class="plugin-title"><?php echo wp_kses_post($plugin['twz_plugin_title']); ?></div>
                    <p><?php echo wp_kses_post($plugin['twz_plugin_description']); ?></p>
                    <p class="plugin-author"><?php esc_attr_e('By', 'twz-plugin-manager-client'); ?> <b><?php echo wp_kses_post($plugin['twz_plugin_author']); ?></b></p>
                </div>
            </div>
            <div class="activation-row">
                <div class="custom-button">
                    <a class="custom-link" href="<?php echo esc_attr($plugin['twz_plugin_help_url']); ?>/" target="_blank">
                        <?php esc_attr_e('More Details', 'twz-plugin-manager-client'); ?>
                    </a>
                </div>
            </div>
        </div>
    <?php } ?>
</div>