const withCSS = require('@zeit/next-css')
const path = require('path');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
module.exports = withCSS({
	webpack(config) {
		config.module.rules.push({
			test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
			use: {
				loader: 'url-loader',
				options: {
					limit: 100000,
					publicPath: './',
					outputPath: 'static/',
					name: '[name].[ext]'
				}
			}
		});

		config.module.rules.push({
			test: /\.po/,
			use: [
				{
					loader: '@lingui/loader'
				}
			]
		});

		return config;
	},
	target: 'serverless',
	poweredByHeader: false,
	env: {
		API_URL: process.env.API_URL || 'http://api.local.guac.live',
		CHAT_URL: process.env.CHAT_URL || 'http://chat.local.guac.live',
		GIPHY_API_KEY: process.env.GIPHY_API_KEY,
		OIL_CONFIG: {
			"theme": "dark",
			"cpc_type": "standard",
			"poi_activate_poi": true,
			"poi_hub_origin": "//privacy.guac.live/release/current",
			"poi_hub_path": "/hub.html",
			"poi_subscriber_set_cookie": true,
			"poi_group_name": "guac.live",
			"timeout": -1,
			"default_to_optin": false,
			"advanced_settings": true,
			"advanced_settings_purposes_default": true,
			"locale": {
				"localeId": "enEN_01",
				"version": 1,
				"texts": {
					"label_intro_heading": "guac.live",
					"label_intro": "This site uses cookies. By continuing to use this site, closing this banner, or clicking \"I Agree\", you agree to the use of cookies. Read our <a href=\"/privacy\" target=\"_blank\">privacy statement</a> for more information.",
					"label_button_yes": "I agree"
				}
			}
		}
	},
	experimental: {
		terserLoader: true
	}
})