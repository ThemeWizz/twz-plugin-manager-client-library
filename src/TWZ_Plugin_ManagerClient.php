<?php

namespace themewizz\twz_plugin_manager;

include_once('TWZ_System_Info.php');

class TWZ_Plugin_ManagerClient
{
	private $server_url = '';
	private $plugin_slug = '';
	private $system_info = '';

	private $show_type = 'our_products';
	protected $plugins = null;
	protected $categories = 'all';

	public function __construct($server_url_, $plugin_slug_)
	{
		$this->server_url = $server_url_;
		$this->plugin_slug = $plugin_slug_;

		$twz_system_info = new TWZ_System_Info();
		$this->system_info = $twz_system_info->generate();

		load_plugin_textdomain('twz-plugin-manager-client', false, dirname(dirname(plugin_basename(__FILE__))) . '/languages/');
	}

	public function show_addons()
	{
		$this->show_type = 'addons';
		$this->init();
	}

	public function show_products()
	{
		$this->show_type = 'our_products';
		$this->init();
	}

	protected function init()
	{

		wp_enqueue_script('plugin-installer', plugin_dir_url(__FILE__) . 'assets/twz/js/installer.js', ['jquery'], '1.0.0', false);
		wp_localize_script(
			'plugin-installer',
			'cnkt_installer_localize',
			[
				'ajax_url'      => $this->server_url . '/wp-admin/admin-ajax.php',
				'admin_nonce'   => wp_create_nonce('twz-plugin-manager-client'),
				'install_now'   => __('Are you sure you want to install this plugin?', 'twz-plugin-manager-client'),
				'install_btn'   => __('Install Now', 'twz-plugin-manager-client'),
				'activate_btn'  => __('Activate', 'twz-plugin-manager-client'),
				'installed_btn' => __('Activated', 'twz-plugin-manager-client'),
			]
		);
		wp_enqueue_style('plugin-installer',  plugin_dir_url(__FILE__) . 'assets/twz/css/installer.css', array(), '1.0.0');

		$twz_our_products_categories_list = $this->plugin_categories_list();

		include('views/products-page.php');
		return false;
	}

	public function prepare_items()
	{
		$nonce = wp_create_nonce('_wpnonce_the-wizz-memberships-addons-ajax');
		$url = $this->server_url . '/wp-admin/admin-ajax.php?XDEBUG_SESSION_START=PHPSTORM';
		$raw_response = wp_remote_post(
			$url,
			array(
				'method'      => 'POST',
				'redirection' => 5,
				'timeout' => 5000,
				'headers'     => array(
					'X-WP-Nonce' => $nonce
				),
				'body' => array(
					'action' => 'the_wizz_memberships_addons_list',
					'nonce' => wp_create_nonce('twz-plugin-manager-client'),
					'type' => $this->show_type,
					'system_info' => base64_encode(json_encode($this->system_info)),
					'slug' => $this->plugin_slug
				),
			)
		);

		if (!is_wp_error($raw_response) && 200 == $raw_response['response']['code']) {
			$this->plugins = json_decode($raw_response['body'], true);
			$this->categories = filter_input(INPUT_POST, 'categories');

			// if ($this->categories != 'all') {
			// 	$filtered = array();

			// 	foreach ($this->plugins as $plugin) {
			// 		if (!empty($plugin['twz_our_products_categories'])) {
			// 			if (str_contains($plugin['twz_our_products_categories'], $this->categories)) {
			// 				$filtered[] = $plugin;
			// 			}
			// 		}
			// 	}
			// 	$this->plugins = $filtered;
			// }
		} else {
			if(!empty($raw_response['body'])) {
				echo $raw_response['body'];
				exit;
			}
			$this->plugins = array();
			
		}
	}

	private function plugin_categories_list()
	{
		$cotegories = array();
		$cotegories[] = array('id' => 'all', 'name'  => __('All', 'twz-plugin-manager-client'));
		$cotegories[] = array('id' => 'protection', 'name'  => __('Protection', 'twz-plugin-manager-client'));
		$cotegories[] = array('id' => 'security', 'name'  => __('Security', 'twz-plugin-manager-client'));
		$cotegories[] = array('id' => 'payment', 'name'  => __('Payment', 'twz-plugin-manager-client'));
		$cotegories[] = array('id' => 'ecommerce', 'name'  => __('Ecommerce', 'twz-plugin-manager-client'));
		$cotegories[] = array('id' => 'debug', 'name'  => __('Debug', 'twz-plugin-manager-client'));
		return $cotegories;
	}

	public function get_plugin_file($plugin_slug)
	{
		// Load core WP plugin lib.
		require_once ABSPATH . '/wp-admin/includes/plugin.php';

		$plugins = get_plugins();
		if (!$plugins) {
			return;
		}

		foreach ($plugins as $plugin_file => $plugin_info) {
			// Get the basename of the plugin e.g. [askismet]/askismet.php.
			$slug = dirname(plugin_basename($plugin_file));
			if ($slug) {
				if ($slug === $plugin_slug) {
					return $plugin_file;
				}
			}
		}
	}
	public function check_file_extension($filename)
	{
		if (substr(strrchr($filename, '.'), 1) === 'php') {
			// has .php exension.
			return true;
		} else {
			// ./wp-content/plugins.
			return false;
		}
	}
}
