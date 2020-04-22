import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';

import * as actions from '../actions';

import { Trans } from '@lingui/macro';

import Link from 'next/link';

class CategoriesPage extends Component {
	static async getInitialProps({store}) {
		const { categories } = store.getState()
		if(categories.loading){
			await store.dispatch(actions.fetchCategories());
		}
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
							<div className="site-component-categories_category w-100 pa2" key={`category_${category.category_id}`}>
								<div className="pa2">
									<Link href={`/category/[id}`} href={`/category/${category.category_id}`}>
										<a className="f5 db link green">{category.name}</a>
									</Link>
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
export default connect(state => state)(CategoriesPage)