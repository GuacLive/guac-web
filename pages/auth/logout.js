import {Component} from 'react'
import {connect} from 'react-redux';

import Router from 'next/router';

import * as actions from 'actions';

class LogoutPage extends Component {
	constructor(props){
		super(props);
	}


	componentDidMount(){
		this.props.dispatch(
			actions.deauthenticate()
		)
		.then(() => {
			if(typeof window !== 'undefined') window.location.href = '/';
		});
	}

	render(){
		return null;
	}
}

export default connect(state => state)(LogoutPage)