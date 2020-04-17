import {i18n} from '@lingui/core'
import {en, nb} from 'make-plural/plurals'

i18n.loadLocaleData('en', {plurals: en})
i18n.loadLocaleData('nb', {plurals: nb})

export async function activate(locale){
	var catalog; 
	try{
		catalog =  await import(
			/* webpackMode: "lazy", webpackChunkName: "locale/[request]" */
			`../locale/${locale || 'en'}/messages.js`
		);
	}catch(e){
		catalog = await import(
			/* webpackMode: "lazy", webpackChunkName: "locale/[request]" */
			`../locale/en/messages.js`
		);
	}

	i18n.load(locale, catalog.messages);
	i18n.activate(locale);
}