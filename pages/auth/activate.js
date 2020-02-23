import React, {Component} from 'react'
import {connect} from 'react-redux';

import Router from 'next/router';

const API_URL = process.env.API_URL;
class ActivatePage extends Component {
	constructor(props){
		super(props);
	}
	static async getInitialProps({store, isServer, pathname, query, req}){
        let result;
		await fetch(API_URL + '/activate', {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			method: 'POST',
			body: JSON.stringify({
				token: query.token
			})
		})
        .then(response => response.json())
        .then(r => {
            result = r;
        });
		return {...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}), result};
    }

	render(){
		return <p>lol {this.props.result}</p>;
	}
}

export default connect(state => state)(ActivatePage)