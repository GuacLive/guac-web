module.exports = {
	plugins: {
    	'postcss-import': {},
		'postcss-preset-env': {
			stage: 0,
			features: {
				customProperties: true,
				preserve: true
			}
		}
	}
}