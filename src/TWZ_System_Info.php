<?php
namespace themewizz\twz_plugin_manager;

class TWZ_System_Info
{
	/**
	 * Generate the system info to make the support easier.
	 * @return array
	 */
	public function generate()
	{
		$info = [
			'client' => $this->get_client_section(),
			'wordpress' => $this->get_wordpress_section(),
			'php_and_mysql' => $this->get_php_and_mysql_section(),
			'active_plugins' => $this->get_active_plugins_section(),
			'passive_plugins' => $this->get_not_active_plugins_section(),
			'network_active_plugins' => $this->get_network_active_plugins_section(),
		];

		foreach ($info as $section => $options) {
			if (empty($options)) {
				unset($info[$section]);
			}
		}

		$info = apply_filters('twz-system-info_generate', $info);
		return $info;
	}

	public static function get_client_section() {
		return apply_filters( 'twz_common_admin_system_info_generate_client', [
			'admin_email'  => get_bloginfo( 'admin_email' ),
			'home_url'     => home_url(),
			'site_url'     => site_url(),
			'site_title'   => get_bloginfo( 'name' ),
		] );
	}

	/**
	 * Get the Wordpress section for the system info.
	 *
	 * @since 0.9.9
	 * @return array
	 */
	protected function get_wordpress_section()
	{
		global $wpdb;

		$section = [
			'Multisite' => is_multisite() ? 'Yes' : 'No',
			'Site URL' => site_url(),
			'Home URL' => home_url(),
			'Locale' => get_locale(),
			'Wordpress Version' => get_bloginfo('version'),
			'Permalink Structure' => get_option('permalink_structure'),
			'Active Theme' =>  wp_get_theme(),
			'WP_DEBUG' => defined('WP_DEBUG') ? (WP_DEBUG ? 'Enabled' : 'Disabled') : 'Not set',
			'WP Table Prefix' => 'Length: ' . strlen($wpdb->prefix) . ' Status: ' . (strlen($wpdb->prefix) > 16 ? 'ERROR: Too Long' : 'Acceptable'),
			'Show On Front' => get_option('show_on_front'),
			'Page For Front' => get_the_title(get_option('page_on_front')),
			'Page For Blog' => get_the_title(get_option('page_for_posts')),
		];

		$section = apply_filters('twz_common_admin_system_info_generate_wordpress', $section);

		return $section;
	}

	/**
	 * Get the PHP and MySQL section for the system info.
	 * @return array
	 */
	protected function get_php_and_mysql_section()
	{
		global $wpdb;

		$section = [
			'PHP Version' => PHP_VERSION,
			'MySQL Version' => $wpdb->db_version(),
			'Web Server Info' => !empty($_SERVER['SERVER_SOFTWARE']) ? $_SERVER['SERVER_SOFTWARE'] : '-',
			'Time' => current_time('mysql', 0),
			'Time (GMT)' => current_time('mysql', 1),
			'PHP Safe Mode' => ini_get('safe_mode') ? 'Yes' : 'No',
			'PHP Memory Limit' => ini_get('memory_limit'),
			'PHP Upload Max Size' => ini_get('upload_max_filesize'),
			'PHP Post Max Size' => ini_get('post_max_size'),
			'PHP Upload Max Filesize' => ini_get('upload_max_filesize'),
			'PHP Time Limit' => ini_get('max_execution_time'),
			'PHP Max Input Vars' => ini_get('max_input_vars'),
			'PHP Arg Separator' => ini_get('arg_separator.output'),
			'PHP Allow URL File Open' => ini_get('allow_url_fopen') ? 'Yes' : 'No',
			'Session' => isset($_SESSION) ? 'Enabled' : 'Disabled',
			'Session Name' => ini_get('session.name'),
			'Cookie Path' => ini_get('session.cookie_path'),
			'Save Path' => ini_get('session.save_path'),
			'Use Cookies' => ini_get('session.use_cookies') ? 'On' : 'Off',
			'Use Only Cookies' => ini_get('session.use_only_cookies') ? 'On' : 'Off',
			'Display Errors' => ini_get('display_errors') ? 'On' : 'Off',
			'FSOCKOPEN' => function_exists('fsockopen') ? 'Your server supports fsockopen.' : 'Your server does not support fsockopen.',
			'cURL' => function_exists('curl_init') ? 'Your server supports cURL.' : 'Your server does not support cURL.',
			'SOAP Client' => class_exists('SoapClient') ? 'Your server has the SOAP Client enabled.' : 'Your server does not have the SOAP Client enabled.',
		];

		$section = apply_filters('twz_common_admin_system_info_generate_php_and_mysql', $section);

		return $section;
	}

	/**
	 * Get the active plugins section for the system info.
	 * @return array
	 */
	protected function get_active_plugins_section()
	{
		if (!function_exists('get_plugins')) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$plugins = get_plugins();
		$active_plugins = get_option('active_plugins', []);
		$section = [];

		foreach ($plugins as $plugin_path => $plugin) {
			// Skip not active plugins.
			if (!in_array($plugin_path, $active_plugins)) {
				continue;
			}

			$section[$plugin['Name']] = 'Version: ' . $plugin['Version'];
		}

		$section = apply_filters('twz_common_admin_system_info_generate_active_plugins', $section);

		return $section;
	}

		/**
	 * Get the active plugins section for the system info.
	 * @return array
	 */
	protected function get_not_active_plugins_section()
	{
		if (!function_exists('get_plugins')) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}

		$plugins = get_plugins();
		$active_plugins = get_option('active_plugins', []);
		$section = [];

		foreach ($plugins as $plugin_path => $plugin) {
			// Skip active plugins.
			if (in_array($plugin_path, $active_plugins)) {
				continue;
			}

			$section[$plugin['Name']] = 'Version: ' . $plugin['Version'];
		}

		$section = apply_filters('twz_common_admin_system_info_generate_not_active_plugins', $section);

		return $section;
	}

	/**
	 * Get the network active plugins section for the system info.
	 * @return array
	 */
	protected function get_network_active_plugins_section()
	{
		if (!function_exists('wp_get_active_network_plugins')) {
			require_once ABSPATH . 'wp-includes/ms-load.php';
		}

		$plugins = wp_get_active_network_plugins();
		$active_plugins = get_site_option('active_sitewide_plugins', []);
		$section = [];

		foreach ($plugins as $plugin_path) {
			$plugin_base = plugin_basename($plugin_path);

			// Skip not active plugins.
			if (!array_key_exists($plugin_base, $active_plugins)) {
				continue;
			}

			$plugin = get_plugin_data($plugin_path);

			$section[$plugin['Name']] = 'Version: ' . $plugin['Version'];
		}

		$section = apply_filters('aff_common_admin_system_info_generate_network_active_plugins', $section);

		return $section;
	}
}
