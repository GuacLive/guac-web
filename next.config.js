const nextSourceMaps = require("@zeit/next-source-maps")();

// Use the SentryWebpack plugin to upload the source maps during build step
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const { SENTRY_DSN, SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = process.env

const webpack = require('webpack');
const withOffline = require('next-offline');
const pkg = require('./package.json');
const withTM = require('next-transpile-modules')(['react-giphy-searchbox']);
module.exports = withTM(withOffline(nextSourceMaps({
	webpack(config, {isServer, buildId}) {
		if (!isServer) {
			config.resolve.alias['@sentry/node'] = '@sentry/browser';
			config.node = {
				fs: 'empty'
			}
		}

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

		config.plugins.push(
			new webpack.DefinePlugin({
				'process.env.SENTRY_RELEASE': JSON.stringify(buildId),
			})
		);
		if(SENTRY_DSN && SENTRY_ORG && SENTRY_PROJECT && SENTRY_AUTH_TOKEN && process.env.NODE_ENV !== 'development'){
			config.plugins.push(
				new SentryWebpackPlugin({
					release: pkg.version,
					include: '.next',
					ignore: ['node_modules'],
					urlPrefix: '~/_next',
				})
			);
		}
		return config;
	},
	target: 'serverless',
	generateBuildId: async () => pkg.version,
	poweredByHeader: false,
	env: {
		API_URL: process.env.API_URL || 'http://api.local.guac.live',
		CHAT_URL: process.env.CHAT_URL || 'http://chat.local.guac.live',
		VIEWER_API_URL: process.env.VIEWER_API_URL || 'http://viewer-api.local.guac.live',
		GIPHY_API_KEY: process.env.GIPHY_API_KEY,
		SENTRY_DSN: process.env.SENTRY_DSN,
		SENTRY_ORG: process.env.SENTRY_ORG,
		SENTRY_PROJECT: process.env.SENTRY_PROJECT,
		SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
		SPLIT_IO_KEY: process.env.SPLIT_IO_KEY,
		PATREON_CLIENT_ID: process.env.PATREON_CLIENT_ID,
		PATREON_REDIRECT_URI: process.env.PATREON_REDIRECT_URI,
		OIL_CONFIG: {
			"theme": "dark",
			"cpc_type": "standard",
			"poi_activate_poi": true,
			"poi_hub_origin": "//privacy.guac.live",
			"poi_hub_path": "/release/current/hub.html",
			"publicPath": "//privacy.guac.live/release/current/",
			"poi_subscriber_set_cookie": true,
			"poi_group_name": "guac.live",
			"timeout": -1,
			"require_optout_confirm": true,
			"default_to_optin": false,
			"advanced_settings": true,
			"advanced_settings_purposes_default": true,
			"locale": {
				"localeId": "enEN_01",
				"version": 1,
				"texts": {
					"label_intro_heading": "guac.live",
					"label_intro": "This site uses cookies. By continuing to use this site, closing this banner, or clicking \"I Agree\", you agree to the use of cookies. Read our <a href=\"/privacy\" target=\"_blank\">privacy statement</a> for more information.",
					"label_button_yes": "I agree",
					"label_cpc_purpose_optout_confirm_heading": "Are you sure?",
					"label_cpc_purpose_optout_confirm_text": "This setting may significantly affect your experience on our website.",
					"label_cpc_purpose_optout_confirm_proceed": "Continue",
					"label_cpc_purpose_optout_confirm_cancel": "Cancel"
				}
			}
		}
	},
	transformManifest: manifest => ['/'].concat(manifest), // add the homepage to the cache
	// Trying to set NODE_ENV=production when running yarn dev causes a build-time error so we
	// turn on the SW in dev mode so that we can actually test it
	generateInDevMode: true,
	dontAutoRegisterSw: true,
	generateSw: false,
	workboxOpts: {
		swDest: 'static/service-worker.js',
		swSrc: './utils/service-worker.js',
		maximumFileSizeToCacheInBytes: 3e7 /*30mb*/
	},
	reactStrictMode: true,
	experimental: {
		granularChunks: true,
		plugins: true,
		sprFlushToDisk: true,
		reactMode: 'concurrent',
		workerThreads: true,
		pageEnv: true,
		measureFid: true,
		reactRefresh: true,
	},
	future: {
		excludeDefaultMomentLocales: true,
	},
})))