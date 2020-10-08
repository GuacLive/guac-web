import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';

import * as actions from '../../actions';

import { Trans } from '@lingui/macro';

import Link from 'next/link';

import GuacButton from '../../components/GuacButton';
import Image from '../../components/Image';

class CategoryPage extends Component {
	static async getInitialProps({store, query}) {
		const { categories } = store.getState()
		if(categories.loading){
			await store.dispatch(actions.fetchCategories());
		}
		await store.dispatch(actions.fetchChannels(1, query.id));
		return {
			...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
			category_id: query.id
		};
	}

	render() {
		const { channels, category_id, categories } = this.props;
		if(channels.loading) return null;
		let thisCategory = category_id
		&& categories
		&& categories.data
		&& categories.data.filter((category) => {
			return category.category_id == category_id;
		});
		console.log(thisCategory);
		return (
			<Fragment>
				<div className="w-100 pv3 ph3-l">
					<div className="flex pa4 cover" style={{
								'textShadow': '1px 1px 1px #000',
								'background': thisCategory[0] && thisCategory[0].cover ? `url(${thisCategory[0].cover})` : `url(/img/categories/${category_id}.jpg) no-repeat 100%`,
								'backgroundPosition': '50%',
								'backgroundRepeat': 'no-repeat',
								'webkitMaskImage': 'linear-gradient(0deg,#0e0e10,rgba(14,14,16,.25)),linear-gradient(90deg,#0e0e10,rgba(14,14,16,.25))'
							}}>
						<h2 className="f2 tracked mt0 mb3">
						{
							thisCategory
							&& thisCategory[0]
							?
							thisCategory[0].name
							: `Category ${category_id}`
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
												is playing&nbsp;
												<Link href={`/category/${channel.category_id}`}>
												<a className="link color-inherit b">{channel.category_name}</a>
											</Link>
										</p>
									</span>
									<GuacButton url={`/c/${channel.name}`} color="dark-green">Watch</GuacButton>
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