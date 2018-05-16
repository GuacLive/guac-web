const withCSS = require('@zeit/next-css')
module.exports = withCSS({
	webpack (config) {
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
		})

		return config
	},
	poweredByHeader: false,
	serverRuntimeConfig: { // Will only be available on the server side
		mySecret: 'secret'
	},
	publicRuntimeConfig: { // Will be available on both server and client
		API_URL: process.env.API_URL || 'http://api.local.guac.live'
	}
})