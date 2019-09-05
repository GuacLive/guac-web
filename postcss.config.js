module.exports = {
	plugins: {
    	'postcss-import': {},
		'postcss-preset-env': {
			stage: 0,
			browsers: ['defaults', 'ie 11'],
			autoprefixer: { grid: true },
			features: {
				customProperties: true,
				preserve: true
			}
		}
	}
}