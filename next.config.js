const webpack = require('webpack');

const {withSentryConfig} = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
	silent: false,
  };
  

const withOffline = require('next-offline');
const pkg = require('./package.json');
const withTM = require('next-transpile-modules')(['react-giphy-searchbox', 'abort-controller', 'simplebar-react']);
module.exports = withTM(withSentryConfig(withOffline({
	swcMinify: true,
	webpack(config, {isServer, buildId}) {
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
			net: false,
			domain: require.resolve('domain-browser'),
			os: require.resolve('os-browserify/browser')
		};

		/*config.module.rules.push({
			test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
			type: 'asset/resource'
		});*/
		config.module.rules.push({
			test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
			use: [
				{
					loader: "url-loader",
					options: {
						limit: 100000,
					},
				},
			],
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

		// Define an environment variable so source code can check whether or not
		// it's running on the server so we can correctly initialize Sentry
		config.plugins.push(
			new webpack.DefinePlugin({
				'process.env.NEXT_IS_SERVER': JSON.stringify(
					isServer.toString()
				),
			})
		)

		return config;
	},
	generateBuildId: async () => pkg.version,
	poweredByHeader: false,
	env: {
		// DEBUG is used in socket.io
		//DEBUG: process.env.NODE_ENV === 'development',
		SSR_TIMEOUT: parseInt(process.env.SSR_TIMEOUT) || 10 * 1000,
		STATIC_URL: process.env.STATIC_URL || 'http://static.guac.live',
		API_URL: process.env.API_URL || 'http://api.local.guac.live',
		CHAT_URL: process.env.CHAT_URL || 'http://chat.local.guac.live',
		VIEWER_API_URL: process.env.VIEWER_API_URL || 'http://viewer-api.local.guac.live',
		GIPHY_API_KEY: process.env.GIPHY_API_KEY,
		NEXT_PUBLIC_SENTRY_SERVER_ROOT_DIR: '/var/task',
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
		domains: ['guac.live', 'api.guac.live', 'cdn.guac.live', 'emotes.guac.live', 'lon.stream.guac.live', 'stream.guac.live', 'media.rawg.io', 'cdn.frankerfacez.com', 'static-cdn.jtvnw.net', 'cdn.betterttv.net', 'ggpht.com', 'yt3.ggpht.com', 'discordapp.com', 'cdn.betterttv.net', 'cdn.7tv.app', 'cdn.frankerfacez.com']
	},
	crossOrigin: 'anonymous',
	productionBrowserSourceMaps: true,
	experimental: {
		reactRoot: true,
		externalDir: true,
		pageEnv: true,
		scrollRestoration: false
	},
	future: {
		excludeDefaultMomentLocales: true
	},
}), sentryWebpackPluginOptions))
