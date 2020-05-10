import React, { useState } from 'react';

import { useDebounce, useMount } from 'react-use';

import { useLingui } from "@lingui/react"
import { Trans, t } from '@lingui/macro';

import Link from 'next/link';

const API_URL = process.env.API_URL;
function SearchBar(props){
	const { i18n } = useLingui();

	const inputEl = React.useRef(null);
	const [val, setVal] = React.useState('');
	const [debouncedValue, setDebouncedValue] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState('');
	const [results, setResults] = React.useState([]);
	useDebounce(
		() => {
			setDebouncedValue(val);
			if(typeof val === 'string'){
				search(val);
			}
		},
		800,
		[val]
	);

	useMount(() => {
		//inputEl.current.focus();
	});

	const search = async term => {
		if(!term){
			setLoading(false);
			setResults([]);
			return;
		}
		setLoading(true);
		await fetch(API_URL + '/search', {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			method: 'POST',
			body: JSON.stringify({
				term
			})
		})
		.then(response => response.json())
		.then(searchResults => setResults(searchResults && searchResults.data))
		.catch(error => setError(error))
		.finally(() => setLoading(false));
	};
	
	return (
		<div className="site-component-search">
			<form className="w-75 relative ml3 site-component-search__form">
				<input
					type="text"
					style={{
						color: 'hsla(0, 0%, 100%, .8)',
						backgroundColor: 'hsla(0, 0%, 100%, .05)'
					}}
					className="input-reset bn pa3 f3 w-100 bg-white br2"
					placeholder={i18n._(t`Search...`)} 
					value={val}
					ref={inputEl}
					onChange={({ currentTarget }) => {
						setVal(currentTarget.value);
					}}
				/>
			</form>
			<div className="absolute top-4 ph3 pv1">
				{
					(loading || error || (results && results.length > 0))
					&&
						<div className="w5 pa1 ba b--gray br2 bg-white near-black site-component-search__results">
						{
							loading && (
								<div className="dib i ml8"><Trans>Loading...</Trans></div>
							)
						}
						{
							error && (
								<div className="red">{error && error.message}</div>
							)
						}
						{
							results
							&&
							results.map((stream, i) => {
								//return <UserCard key={i} user={user} index={i} />;
								return <div key={`search_result_${i}`} className="flex w-100 h2 items-center pv2">
									<Link href={`/c/${stream.name}`}>
										<a className="link near-black v-mid flex items-center">
											{stream.name}
											{+stream.live ? <span className="ph2 bg-red f6 tc inline-flex white mh3">LIVE</span> : ''}
											<span className="truncate"><small>&nbsp;-&nbsp;{stream.title}</small></span>
										</a>
									</Link>                                  
								</div>;
							})
						}
					</div>
				}
			</div>
		</div>
	);
}

export default SearchBar;