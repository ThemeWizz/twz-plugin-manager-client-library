<?php

namespace themewizz\twz_plugin_manager;

use InvalidArgumentException;

class TWZ_Plugin_Manager_Client
{
	private $server_url = '';
	private $plugin_slug = '';

	private $show_type = 'our_products';
	protected $data = null;
	protected $plugins = null;
	protected $tags = null;
	protected $categories = 'all';

	public function __construct($server_url, $plugin_slug)
	{
		if (!$server_url) {
			throw new InvalidArgumentException("Missing config: [server_url]");
		}
		$this->server_url = $server_url;

		if (!$plugin_slug) {
			throw new InvalidArgumentException("Missing config: [plugin_slug]");
		}
		$this->plugin_slug = $plugin_slug;

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
		wp_enqueue_style('twz-plugin-lib-manager',  plugin_dir_url(__FILE__) . 'assets/css/twz-manager.css', array(), '1.0.0');
		wp_enqueue_script('twz-plugin-lib-manager',  plugin_dir_url(__FILE__) . 'assets/js/twz-manager.js', array(), '1.0.0');

		include('views/products-page.php');
		return true;
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
					'slug' => $this->plugin_slug
				),
			)
		);

		if (!is_wp_error($raw_response) && 200 == $raw_response['response']['code']) {
			$this->data = json_decode($raw_response['body'], true);
			$this->plugins = $this->data['plugins'];
			$this->tags = $this->data['tags'];
		} else {
			if (!empty($raw_response['body'])) {
				echo $raw_response['body'];
				exit;
			}
			$this->plugins = array();
		}
		$params = [
			'twz_plugins' => $this->plugins
		];
		wp_localize_script('twz-plugin-lib-manager', 'twz_plugin_manager_lib_params', $params);
	}
}
