# Software License Manager PHP Class #
This class can be used in a PHP application to contact a Themewizz based Plugin Manager Server using the free [TWZ Plugin Manager](https://themewizz.com).
## Usage ##
- Install WordPress on your license server
- Install the Software License Manager Plugin on that server
- Configure the plugin, e.g. setting the secret key for validation
- Include TWZ_Plugin_Manager_Client class in your PHP application
```php
		$server_url = 'Server URL';
		$plugin_slug = 'your_plugin_slugt';
		$pluginManager = new TWZ_Plugin_Manager_Client($server_url, $plugin_slug);
		echo $pluginManager->show_products();
```
