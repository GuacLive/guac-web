import Router from 'next/router'
import { I18n } from '@lingui/react'
import { t, Trans } from '@lingui/macro'

import { setCookie } from '../utils/cookie';

const availableLanguageNames = {
	en: t`English`,
	nb: t`Norwegian`
}
const availableLanguages = Object.keys(availableLanguageNames)

export default () => {
	function onSubmit (evt) {
		evt.preventDefault();
		setCookie('lang', evt.currentTarget.lang.value);
		Router.push({
			pathname: window.location.pathname
		})
		;
	}

	return (
		<I18n>
			{({ i18n }) => (
				<form onSubmit={onSubmit} className="pv2">
					<select
						key={i18n.language}
						name='lang'
						defaultValue={availableLanguages.find(
							lang => lang !== i18n.language
						)}
					>
						{availableLanguages.map(lang => (
							<option key={lang} value={lang} disabled={i18n.language === lang}>
								{i18n._(availableLanguageNames[lang])}
							</option>
						))}
					</select>
					<button className="link color-inherit dib pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green">
						<Trans>Switch language</Trans>
					</button>
				</form>
			)}
		</I18n>
	)
}
