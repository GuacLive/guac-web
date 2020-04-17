import {i18n} from '@lingui/core'
import {en, nb} from 'make-plural/plurals'

i18n.loadLocaleData('en', {plurals: en})
i18n.loadLocaleData('nb', {plurals: nb})

export async function activate(locale) {
	try{
		const { messages } = await import(
			/* webpackMode: "lazy", webpackChunkName: "locale/[request]" */
			`../locale/${locale}/messages.js`
		);
	}catch(e){
		const { messages } = await import(
			/* webpackMode: "lazy", webpackChunkName: "locale/[request]" */
			`../locale/en/messages.js`
		);
	}

	i18n.load(locale, messages)
	i18n.activate(locale)
}