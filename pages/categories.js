import React, {Component, Fragment} from 'react';

import {connect} from 'react-redux';

import * as actions from '../actions';

import { Trans } from '@lingui/macro';

class CategoriesPage extends Component {
	static async getInitialProps({store}) {
		const { channels } = store.getState()
		if(channels.loading){
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
				<div className="w-100">
					<h2 className="f2 tracked mt0 mb3"><Trans>Games</Trans></h2>
					<div className="site-component-categories flex flex-row flex-wrap w-100" style={{flexGrow: 1}}>
					<Trans>Coming soon.</Trans>
					{categories.data && categories.data.map((category) => {
						return false;
						return (
							<div className="site-component-categories_category w-100 pa2" key={`category_${category.id}`}>
								<div className="pa2">
									<span className="f5 db link green">{category.name}</span>
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