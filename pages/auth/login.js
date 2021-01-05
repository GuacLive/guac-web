import { connect } from 'react-redux';

import AuthComponent from 'components/Auth';

function LoginPage(props){
	return (<AuthComponent tab={0} />);
};

export default connect(state => state)(LoginPage)