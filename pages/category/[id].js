import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';

import * as actions from '../../actions';

import { Trans, t } from '@lingui/macro';

import Link from 'next/link';

import GuacButton from '../../components/GuacButton';

import {i18n} from '@lingui/core';

const API_URL = process.env.API_URL;
const DEFAULT_OFFLINE_POSTER = '//cdn.guac.live/offline-banners/offline-banner.png';

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
								'background': `linear-gradient(rgba(15, 15, 15, 0), rgb(21, 21, 21)), linear-gradient(rgba(21, 21, 21, 0.8), rgba(21, 21, 21, 0.5)), url(${thisCategory[0] && thisCategory[0].cover ? thisCategory[0].cover : '/img/categories/' + category_id + '.jpg'})`,
								'backgroundPosition': '50%',
								'backgroundRepeat': 'no-repeat',
							}}>
						<h2 className="f2 tracked mt0 mb3 white">
						{
							thisCategory
							&& thisCategory[0]
							?
							thisCategory[0].name
							: `${i18n._(t`Category`)}${category_id}`
						}
						</h2>
					</div>
					<div className="site-component-channels grid ga2 flex-grow-1 overflow-hidden grid-columns-2 grid-columns-3-xl h-100">
					{channels.data && channels.data.map((channel) => {
						return (
							<div key={`channel_${channel.id}`} className="relative pointer flex flex-column items-center">
								<div className="pa2 w-100 flex flex-row justify-between items-center bg-bar">
									<div className="flex items-center">
										<div className={`w3 h3 mr3 ba bw1 ${+channel.live ? 'b--green' : 'b--red'} bg-center cover br-100`} style={{'backgroundImage': `url(${channel.avatar}`}}></div>
										<div className="flex flex-column">
											<Link href={`/[channel]`} as={`/${channel.name}`}>
												<a className="link white f4">{channel.name}</a>
											</Link>
											<Link href="/category/[id]" as={`/category/${channel.category_id}`}>
												<a className="link white f5 mt2"><i className="fa fa-gamepad"></i> {channel.category_name}</a>
											</Link>
										</div>
									</div>
									<div className="flex flex-column">
										<GuacButton color="green" url={`/${channel.name}`}><Trans>Watch</Trans></GuacButton>
									</div>
								</div>
								<div className="w-100">
									<div className="aspect-ratio aspect-ratio--16x9">
										<Link href="/[channel]" as={`/${channel.name}`}>
											<a className="link flex flex-column justify-between aspect-ratio--object bg-center cover" style={{'backgroundImage': +channel.live ? `url(${channel.streamServer}/live/${channel.name}/thumbnail.jpg)` : `url(${channel.banner || DEFAULT_OFFLINE_POSTER})`}}>
												<span className="link white pa2 w-100 flex justify-between f4 bg-black-70">{channel.title || t`No stream title`}</span>
												<div className="w-100 flex justify-between ph2 pt4 pb2 f5 grad-bot">
													{+channel.live ?
														<span className="pv1 ph2 bg-black white br2"><i className="fa fa-circle red"></i> <Trans>Live</Trans></span> : <span className="pv1 ph2 bg-black white br2"><Trans>Offline</Trans></span>
													}
													{+channel.live ? <span className="pv1 ph2 bg-black white br2"><i className="fa fa-eye"></i> {channel.viewers}</span> : <></>}
												</div>
											</a>
										</Link>
									</div>
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