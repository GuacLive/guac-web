import React, {Component} from 'react'
import {connect} from 'react-redux';

import * as actions from '../../actions';

class LogoutPage extends Component {
	constructor(props){
		super(props);
	}


	componentDidMount(){
		this.props.dispatch(actions.deauthenticate());
	}

	render(){
		return null;
	}
}

export default connect(state => state)(LogoutPage)