import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';

import * as actions from '../../actions';

import { Trans, t } from '@lingui/macro';

import Link from 'next/link';

import GuacButton from '../../components/GuacButton';
import Image from '../../components/Image';
import {i18n} from '@lingui/core';

const API_URL = process.env.API_URL;
class CategoryPage extends Component {
	static async getInitialProps({store, query}) {
		const { categories } = store.getState()
		var category;
		if(categories.loading){
			await store.dispatch(actions.fetchCategories());
		}
		await fetch(API_URL + '/category', {
			method: 'post',
			Accept: 'application/json',
			'Content-Type': 'application/json',
			body: JSON.stringify({
				category_id: query.id
			})
		})
		.then(response => response.json())
		.then(r => {
			category = r;
		});
		await store.dispatch(actions.fetchChannels(1, query.id));
		return {
			...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
			category_id: query.id,
			category
		};
	}

	render() {
		const { channels, category_id, category } = this.props;
		if(channels.loading) return null;
		let thisCategory = category && category.data;
		console.log(thisCategory);
		if(category && category.data && category.data.length === 0) return (<Trans>Category not found</Trans>);
		return (
			<Fragment>
				<div className="w-100 pv3 ph3-l">
					<div className="flex pa4 cover" style={{
								'textShadow': '1px 1px 0 #333, -1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 2px 2px 5px rgb(0 0 0 / 65%)',
								'background': thisCategory[0] && thisCategory[0].cover ? `url(${thisCategory[0].cover})` : `linear-gradient(rgba(15, 15, 15, 0), rgb(21, 21, 21)), linear-gradient(rgba(21, 21, 21, 0.8), rgba(21, 21, 21, 0.5)), url(/img/categories/${category_id}.jpg)`,
								'backgroundPosition': '50%',
								'backgroundRepeat': 'no-repeat',
							}}>
						<h2 className="f2 tracked mt0 mb3">
						{
							thisCategory
							&& thisCategory[0]
							?
							thisCategory[0].name
							: `${i18n._(t`Category`)}${category_id}`
						}
						</h2>
					</div>
					<div className="site-component-channels flex flex-row flex-wrap w-80" style={{flexGrow: 1}}>
					{channels.data && channels.data.map((channel) => {
						return (
							<div className="site-component-channels__channel w-100 pa2" key={`channel_${channel.id}`}>
								<Link href={`/c/[name]`} as={`/c/${channel.name}`}>
									<a><Image src={channel.thumbnail} shape="rounded" fit="contain" lazyload /></a>
								</Link>
								<div className="pa2">
									<span className="f5 db link green">
										<Link href={`/c/[name]`} as={`/c/${channel.name}`}>
											<a className="link color-inherit">{channel.title}</a>
										</Link>
									</span>
									<span className="f6 gray mv1">
										<p>
												<Link href={`/c/[name]`} as={`/c/${channel.name}`}>
													<a className="link color-inherit b">{channel.name}</a>
												</Link>
												<br />
												<Trans>is playing</Trans>&nbsp;
												<Link href={`/category/${channel.category_id}`}>
												<a className="link color-inherit b">{channel.category_name}</a>
											</Link>
										</p>
									</span>
									<GuacButton url={`/c/${channel.name}`} color="dark-green"><Trans>Watch</Trans></GuacButton>
								</div>
							</div>
						);
					})}
				</div>
				</div>
			</Fragment>
		)
	}
}
export default connect(state => state)(CategoryPage)