import Router from 'next/router'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/macro'

import {setCookie} from 'utils/cookie';
import {activate, availableLanguageNames} from 'utils/i18n';

const availableLanguages = Object.keys(availableLanguageNames)

const LangSwitcher = () => {
	const { i18n } = useLingui();
	function onSubmit(evt) {
		evt.preventDefault();
		setCookie('lang', evt.currentTarget.lang.value);
		activate(evt.currentTarget.lang.value);
		Router.push({
			pathname: window.location.pathname
		});
	}

	return (
		<form onSubmit={onSubmit} className="pv2">
			<select
				key={i18n.locale}
				name='lang'
				defaultValue={availableLanguages.find(
					lang => lang !== i18n.locale
				)}
				className="pv1 ph1"
			>
				{availableLanguages.map(lang => (
					<option key={lang} value={lang} disabled={i18n.locale === lang}>
						{i18n._(availableLanguageNames[lang])}
					</option>
				))}
			</select>
			<button className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1">
				<Trans>Switch language</Trans>
			</button>
		</form>
	);
};
export default LangSwitcher;
