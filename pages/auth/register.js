import { connect } from 'react-redux';

import AuthComponent from 'components/Auth';

function RegisterPage(props){
	return (<AuthComponent tab={1} />);
};

export default connect(state => state)(RegisterPage)