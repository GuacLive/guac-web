const nextSourceMaps = require('@zeit/next-source-maps')
const webpack = require('webpack');
const withOffline = require('next-offline');
module.exports = withOffline(nextSourceMaps({
	webpack(config, {isServer, buildId}) {

		/*if (config.optimization.splitChunks.cacheGroups && config.optimization.splitChunks.cacheGroups.lib) {
			config.optimization.splitChunks.cacheGroups.lib.test = module => {
			  const identifier = module.identifier();
			  return (
				module.size() > 160000 && /node_modules[/\\]/.test(identifier) && !/^.+css-loader\//.test(identifier)
			  );
			};
		}*/

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

		/*config.module.rules.push({
			test: /\.js(\?[^?]*)?$/,
			loader: 'babel-loader',
			include: [
				path.resolve(__dirname, './node_modules/next/dist/pages')
			],
			query: {
				cacheDirectory: true,
				sourceMaps: 'both',
				presets: ['@babel/preset-env'],
				plugins: ['@babel/plugin-proposal-object-rest-spread']
			}
		});*/

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

		if (!isServer) {
			config.resolve.alias['@sentry/node'] = '@sentry/browser';
			config.node = {
				fs: 'empty'
			}
		}

		return config;
	},
	target: 'serverless',
	poweredByHeader: false,
	env: {
		API_URL: process.env.API_URL || 'http://api.local.guac.live',
		CHAT_URL: process.env.CHAT_URL || 'http://chat.local.guac.live',
		VIEWER_API_URL: process.env.VIEWER_API_URL || 'http://viewer-api.local.guac.live',
		GIPHY_API_KEY: process.env.GIPHY_API_KEY,
		SENTRY_DSN: process.env.SENTRY_DSN,
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
	transformManifest: manifest => ['/'].concat(manifest), // add the homepage to the cache
	// Trying to set NODE_ENV=production when running yarn dev causes a build-time error so we
	// turn on the SW in dev mode so that we can actually test it
	generateInDevMode: true,
	workboxOpts: {
		swDest: 'static/service-worker.js',
		cleanupOutdatedCaches: true,
		maximumFileSizeToCacheInBytes: 3e7 /*30mb*/,
		runtimeCaching: [
			{
				urlPattern: '/.*',
				handler: 'NetworkFirst',
				method: 'GET',
				options: {
					cacheName: 'guac-frontend',
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 60 * 60 * 24 * 1, // 1 day
						purgeOnQuotaError: true,
					}
				},
			},

			// Long lived API responses
			{
				urlPattern: 'https://api.guac.live/channels',
				handler: 'NetworkFirst',
				method: 'GET',
				options: {
					cacheName: 'guac-api',
				},
			},
			{
				urlPattern: 'https://api.guac.live/watch(/?|/([a-zA-Z0-9._-]+)?)$',
				handler: 'NetworkFirst',
				method: 'GET',
				options: {
					cacheName: 'guac-api',
				},
			},

			// Cache emotes
			{
				urlPattern: 'https://emotes.guac.live/(.*)$',
				handler: 'CacheFirst',
				method: 'GET',
				options: {
					cacheName: 'guac-emotes',
					cacheableResponse: {
						statuses: [200],
					},
					expiration: {
						maxEntries: 10,
						maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
						purgeOnQuotaError: true,
					},
				},
			},

			// more workbox cache settings...
		],
	},
	experimental: {
		workerThreads: true,
		sprFlushToDisk: true,
		deferScripts: true,
		catchAllRouting: true,
		granularChunks: true,
		polyfillsOptimization: true,
	},
	future: {
		excludeDefaultMomentLocales: true,
	},
}))