const getLangsFromReq = (req, filtered) => {
	if(!req.headers || !req.headers.hasOwnProperty('accept-language')) return ['en'];
	const sortedLangByWeight = req.headers['accept-language']
		.split(',')
		.map(lang => {
			const lg = lang.split(';q=')
			lg[1] = +lg[1] || 1
			return lg
		})
	sortedLangByWeight.sort((a, b) => b[1] - a[1])

	return sortedLangByWeight.reduce((prev, curr) => {return prev.concat(curr[0])}, []).filter(lng => filters[filtered](lng))
}

const filters = {
	languageOnly: (lng) => !/-/.test(lng),
	all: (lng) => /.+/.test(lng),
	currentOnly: (lng) => /-/.test(lng),
}

export const getLangs = (ctx, filtered = 'all') => {
	// Make sure to create a new context for every server-side request so that data
	// isn't shared between connections (which would be bad).
	if(!!ctx.req){
		return getLangsFromReq(ctx.req, filtered)
	}

	const langs = navigator.languages || navigator.userLanguages
	return langs.filter(lng => filters[filtered](lng))
}