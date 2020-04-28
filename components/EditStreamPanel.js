import React, {Component} from 'react'
import {connect} from 'react-redux';

import { Trans } from '@lingui/macro';

import * as actions from '../actions';

class EditStreamPanel extends Component {
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async componentDidMount(){
		const { streaming, categories, authentication } = this.props
		if(streaming.loading){
            await this.props.dispatch(actions.fetchStreaming(authentication.token));
        }
        if(categories.loading){
			await this.props.dispatch(actions.fetchCategories(authentication.token));
		}
    }

	handleSubmit(e){
		const {streaming} = this.props;
		e.preventDefault();
		// yay uncontrolled forms!
		console.log(this.refs);
		if(streaming.category !== this.refs.category.value){
			this.props.dispatch(
				actions.setCategory(this.props.authentication.token, this.refs.category.value)
			);
		}
		if(streaming.title !== this.refs.title.value){
			this.props.dispatch(
				actions.setTitle(this.props.authentication.token, this.refs.title.value)
			);
		}
		if(streaming.private !== this.refs.private.checked){
			this.props.dispatch(
				actions.setPrivate(this.props.authentication.token, this.refs.private.checked)
			);
		}
    }

	render(){
		const {streaming, categories} = this.props;
		const auth = this.props.authentication;
		if(auth.loading) return null;
		if(auth.error) throw auth.error;
		if(categories.error) throw categories.error;
		if(streaming.loading) return null;
		return (
            <form className="measure" onSubmit={this.handleSubmit}>
                <label htmlFor="title">Title:</label>
                <input name="title" type="text" className="input-reset bn pa3 w-100 bg-white br2" ref="title" defaultValue={streaming.title} placeholder="Title" />
                {
                    categories.data &&
                    <>
                        <label htmlFor="category"><Trans>Category:</Trans></label>
                        <select
                            name="category"
                            className="input-reset bn pa3 w-100 bg-white br2"
                            ref="category"
                            placeholder="Select category"
                            value={streaming.category}
                        >
                            {
                                categories.data.map((category) => {
                                    return (
                                        <option
                                            key={`category_${category.category_id}`}
                                            value={category.category_id}
                                        >
                                            {category.name}
                                        </option>
                                    );
                                })
                            }
                        </select>
                    </>
                }
                <label htmlFor="private"><Trans>Private (don't show in categories, frontpage or search):</Trans></label>
                <input
                    name="private"
                    type="checkbox"
                    className="pa3 br2"
                    ref="private"
                    defaultChecked={streaming.private}
                >
                </input>
                <input type="submit" value="Edit stream" className="link color-inherit db pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
            </form>
		)
	}
}

export default connect(state => state)(EditStreamPanel)