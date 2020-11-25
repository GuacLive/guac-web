import { useState, useRef } from 'react';

import { useClickAway } from 'react-use';

import Router from 'next/router'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/macro'


import {setCookie} from 'utils/cookie';
import {activate, availableLanguageNames} from 'utils/i18n';

const availableLanguages = Object.keys(availableLanguageNames)

const LangSwitcher = () => {
	const {i18n} = useLingui();
	const [isOpen, setIsOpen] = useState(false);

	const ref = useRef(null);
	useClickAway(ref, () => {
		setIsOpen(false);
	});

	function setLanguage(lang) {
		setCookie('lang', lang);
		activate(lang);
		setIsOpen(false);
		Router.push({
			pathname: window.location.pathname
		});
	}

	return (
		<div 
			ref={ref} 
			className="flex items-center tw-relative pa2 relative w-100 link b white ph3 pointer"
			style={{
				'flexFlow': 'row wrap'
			}}	
		>
			<div className="items-center flex flex-shrink-0 pr2">
				<div className="items-center inline-flex">
					<i className="fas fa-fw fa-globe"></i>
				</div>
			</div>
			<div className="flex-grow-1 mr2" onClick={() => setIsOpen(!isOpen)}><Trans>Switch language</Trans></div>
			{
				isOpen &&
				<div className="pa2">
					<div className="items-center flex flex-nowrap ph3 pv2 mh3 mt2 bg-dark-gray bg-animate" key={i18n.locale}>
						<div className="flex-grow-1 mr2">{i18n._(availableLanguageNames[i18n.locale])}</div>
						<div className="items-center inline-flex">
							<i className="fas fa-fw fa-check"></i>
						</div>
					</div>
					{
						availableLanguages
							.filter((lang) => {
								return lang !== i18n.locale;
							})
							.map(lang => (
								<div className="flex items-center justify-between items-center flex flex-nowrap ph3 pv2 mh3 mt2 hover-bg-dark-gray bg-animate" key={lang} onClick={() => setLanguage(lang)}>
									<div className="flex-grow-1 mr2">{i18n._(availableLanguageNames[lang])}</div>
									<div className="items-center inline-flex"></div>
								</div>
							)
						)
					}
				</div>
			}
		</div>
	);
};
export default LangSwitcher;
