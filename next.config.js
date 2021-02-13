// Use the SentryWebpack plugin to upload the source maps during build step
const webpack = require('webpack');
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const { SENTRY_DSN, SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } = process.env

const withOffline = require('next-offline');
const pkg = require('./package.json');
const withTM = require('next-transpile-modules')(['react-giphy-searchbox', 'abort-controller', 'simplebar-react'], { unstable_webpack5: true });
module.exports = withTM(withOffline({
	webpack(config, {isServer, buildId, dev}) {
		if (!isServer) {
			config.resolve.alias['@sentry/node'] = '@sentry/browser'
		}

		config.module.rules.push({
			test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
			type: 'asset/resource'
		});
		config.module.rules.push({
			test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
			type: 'asset/inline'
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

		if(SENTRY_DSN && SENTRY_ORG && SENTRY_PROJECT && SENTRY_AUTH_TOKEN && process.env.NODE_E !== 'development'){
			config.plugins.push(
				new SentryWebpackPlugin({
					release: pkg.version,
					include: '.next',
					ignore: ['node_modules'],
					stripPrefix: ['webpack://_N_E/'],
					urlPrefix: '~/_next',
				})
			);
		}
		
		if(!dev){
			//config.devtool = false;
		}

		return config;
	},
	target: 'serverless',
	generateBuildId: async () => pkg.version,
	poweredByHeader: false,
	env: {
		// DEBUG is used in socket.io
		//DEBUG: process.env.NODE_ENV === 'development',
		SSR_TIMEOUT: parseInt( process.env.SSR_TIMEOUT ) || 10 * 1000,
		STATIC_URL: process.env.STATIC_URL || 'http://static.guac.live',
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
	},
	transformManifest: manifest => ['/'].concat(manifest), // add the homepage to the cache
	// Trying to set NODE_ENV=production when running yarn dev causes a build-time error so we
	// turn on the SW in dev mode so that we can actually test it
	dontAutoRegisterSw: true,
	generateSw: false,
	workboxOpts: {
        exclude: [
			/build-manifest\.json$/,
			/react-loadable-manifest\.json$/
		],
		swDest: 'static/service-worker.js',
		swSrc: './utils/service-worker.js',
		maximumFileSizeToCacheInBytes: 3e7 /*30mb*/
	},
	reactStrictMode: true,
	images: {
		domains: ['guac.live', 'api.guac.live', 'cdn.guac.live', 'emotes.guac.live', 'stream.guac.live', 'media.rawg.io', 'cdn.frankerfacez.com', 'static-cdn.jtvnw.net', 'cdn.betterttv.net', 'ggpht.com', 'yt3.ggpht.com']
	},
	productionBrowserSourceMaps: true,
	experimental: {
		plugins: true,
		sprFlushToDisk: true,
		conformance: true,
		reactMode: 'concurrent',
		workerThreads: true,
		pageEnv: true,
		optimizeImages: true,
		scrollRestoration: true,
		topLevelAwait: true,
		scriptLoader: true,
		optimizeFonts: true,
		optimizeImages: true,
		optimizeCss: false,
		scrollRestoration: true
	},
	future: {
		excludeDefaultMomentLocales: true,
		webpack5: true
	},
}))