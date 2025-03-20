<?php
$this->prepare_items();
if ($this->show_type !== 'addons') {
?>
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
<?php } ?>

<div id="twz-plugin-manager-panel" class="twz-plugin-manager"></div>