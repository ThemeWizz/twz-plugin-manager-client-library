<?php $this->prepare_items(); ?>

<div class="mb-3 row">
    <label for="twz_plugin_tag" class="col-sm-12 col-lg-2 col-form-label">
        Filter:
    </label>
    <div class="col-sm-2 col-lg-2 mt-1">
        <select class="form-select" id="twz_plugin_tag" name="twz_plugin_tag" required>
            <?php foreach ($this->tags as $slug => $name) { ?>
                <option value="<?php echo $slug; ?>"><?php echo $name; ?></option>
            <?php } ?>
        </select>
    </div>
</div>
<div id="twz-plugin-manager-panel" class="twz-plugin-manager">

</div>

<template id="user-template">
    <div class="user-card">
        <h3></h3>
        <p>Email: <span></span></p>
    </div>
</template>

<script id="twz-plugin-manager-plugin-item" type="text/html">
    <div class="plugin">
        <div style="display:flex; flex-direction: column;">
            <div style="padding: 0.5rem!important; text-align: center;">
                <img style="width: 440px; height: 160px;" src="<?php echo esc_attr($plugin['twz_plugin_image']); ?>" alt="">
            </div>
            <div style="padding: 0.5rem!important;">
                <div class="plugin-title">'twz_plugin_title'</div>
                <p>'twz_plugin_description'</p>
                <p class="plugin-author">'By' 'twz-plugin-manager-client'<b>'twz_plugin_author'</b></p>
            </div>
        </div>
        <div class="activation-row">
            <div class="custom-button">
                <a class="custom-link" href="'twz_plugin_help_url'" target="_blank">More Details</a>
            </div>
        </div>
    </div>
</script>