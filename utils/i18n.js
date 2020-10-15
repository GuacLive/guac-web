import {i18n} from '@lingui/core';
import {t} from '@lingui/macro';
import {en, nb} from 'make-plural/plurals';

export const availableLanguageNames = {
	en: t`English`,
	nb: t`Norwegian`
};

i18n.loadLocaleData('en', {plurals: en});
i18n.loadLocaleData('nb', {plurals: nb});

export function isValidLocale(locale){
	if(/^[a-zA-Z0-9-_]+$/.test(locale)){
		return availableLanguageNames && availableLanguageNames.hasOwnProperty(locale);
	}
	return false;
};
export async function activate(locale){
	var catalog; 
	try{
		catalog =  await import(
			`../locale/${locale || 'en'}/messages.js`
		);
	}catch(e){
		catalog = await import(
			`../locale/en/messages.js`
		);
	}

	i18n.load(locale, catalog.messages);
	i18n.activate(locale);
};