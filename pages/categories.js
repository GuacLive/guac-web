import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';

import * as actions from '../actions';

import { Trans } from '@lingui/macro';

import Link from 'next/link';

import Image from '../components/Image';
class CategoriesPage extends Component {
	static async getInitialProps({store}) {
		const { categories } = store.getState()
		//if(categories.loading){
			await store.dispatch(actions.fetchCategories());
		//}
		return {
			...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {})
		};
	}

	render() {
		const { categories } = this.props;
		if(categories.loading) return null;
		return (
			<Fragment>
				<div className="w-100 pv3 ph3-l">
					<h2 className="f2 tracked mt0 mb3"><Trans>Browse</Trans></h2>
					<div className="site-component-categories flex flex-row flex-wrap w-100" style={{flexGrow: 1}}>
					{categories.data && categories.data.map((category) => {
						return (
							<Link href={`/category/[id}`} href={`/category/${category.category_id}`}>
								<a className="site-component-categories_category flex flex-column flex-grow-0 flex-shrink-0 overflow-hidden w-20-l w-80-m w-100 pa2 no-underline" key={`category_${category.category_id}`}>
									<div className="item-preview aspect-ratio aspect-ratio--16x9 z-1">
										<Image src={category.cover ? category.cover : `/img/categories/${category.category_id}.jpg`} className="aspect-ratio--object" shape="rounded" fit="cover" lazyload />
									</div>
									<div className="flex flex-grow-1 flex-shrink-1 pa2">
										<a className="f3 db link green truncate">{category.name}</a>
									</div>
								</a>
							</Link>
						);
					})}
					</div>
				</div>
			</Fragment>
		)
	}
}
export default connect(state => state)(CategoriesPage)