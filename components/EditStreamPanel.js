import React, {Component, createRef} from 'react'
import {connect} from 'react-redux';

import { Trans } from '@lingui/macro';

import SelectSearch from 'react-select-search/dist/cjs';

import * as actions from 'actions';

class EditStreamPanel extends Component {
	constructor(props){
		super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.titleRef = createRef();
        this.privateRef = createRef();
        this.archiveRef = createRef();
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
		if(this.state && this.state.category && streaming && streaming.category !== this.state.category){
			this.props.dispatch(
				actions.setCategory(this.props.authentication.token, this.state.category)
			);
		}
		if(streaming && streaming.title !== this.titleRef.current.value){
			this.props.dispatch(
				actions.setTitle(this.props.authentication.token, this.titleRef.current.value)
			);
		}
		if(streaming && streaming.private !== this.privateRef.current.checked){
			this.props.dispatch(
				actions.setPrivate(this.props.authentication.token, this.privateRef.current.checked)
			);
		}
		if(streaming && streaming.archive !== this.archiveRef.current.checked){
			this.props.dispatch(
				actions.setArchive(this.props.authentication.token, this.archiveRef.current.checked)
			);
		}
    }

	render(){
		const {streaming, channel, categories} = this.props;
		const auth = this.props.authentication;
		if(auth.loading) return null;
		if(auth.error) throw auth.error;
		if(categories.error) throw categories.error;
		if(categories.loading) return null;
		if(streaming.loading) return null;
		return (
            <form className="measure" onSubmit={this.handleSubmit}>
                <label htmlFor="title">Title:</label>
                <input name="title" type="text" className="input-reset bn pa3 w-100 bg-white br2" ref={this.titleRef} defaultValue={streaming.title} placeholder="Title" />
                {
                    categories.data &&
                    <>
                        <label htmlFor="category"><Trans>Category:</Trans></label>
                        <SelectSearch
                            name="category"
                            placeholder="Search category"
                            value={channel.data.category_id}
                            options={
                                categories.data ? categories.data.map((data) => ({
                                    value: data.category_id,
                                    name: data.name
                                })) : []
                            }
                            onChange={(category) => {
                                this.setState({
                                    category
                                });
                            }}
                            getOptions={(term) => {
                                return new Promise((resolve, reject) => {
                                    if(!term) return resolve(categories.data.map((data) => ({
                                        value: data.category_id,
                                        name: data.name
                                    })));
                                    fetch(process.env.API_URL + '/search/categories', {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                        method: 'POST',
                                        body: JSON.stringify({
                                            term
                                        })
                                    })
                                    .then(response => response.json())
                                    .then(searchResults => {
                                        if(!searchResults || !searchResults.data) return resolve([]);
                                        resolve(searchResults.data.map((data) => ({
                                            value: data.category_id,
                                            name: data.category_name
                                        })))
                                    })
                                    .catch(reject);
                                }
                            )}}
                            search
                        />
                    </>
                }
                <label htmlFor="private"><Trans>Private (don&apos;t show in categories, frontpage or search):</Trans></label>
                <input
                    name="private"
                    type="checkbox"
                    className="pa3 br2"
                    ref={this.privateRef}
                    defaultChecked={streaming.private}
                >
                </input>
                <div>
                    <label htmlFor="archive"><Trans>Archive stream:</Trans></label>
                    <input
                        name="archive"
                        type="checkbox"
                        className="pa3 br2"
                        ref={this.archiveRef}
                        defaultChecked={streaming.archive}
                    >
                    </input>
                    <div className="f7 primary">
                            <p><Trans>Note: Archived streams are currently public and non-deletable.</Trans></p>
                            <p><Trans>Remember to activate it before starting your stream.</Trans></p>
                    </div>

                </div>
                <input type="submit" value="Edit stream" className="link color-inherit db pv2 ph3 nowrap lh-solid pointer br2 ba b--green bg-green ml1" />
            </form>
		)
	}
}

export default connect(state => state)(EditStreamPanel)