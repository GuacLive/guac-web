import Router from 'next/router';
import { Trans } from '@lingui/macro';
const requireAuth = Page => class SecurePage extends React.Component {
	static async getInitialProps(ctx){
		let redirect;
		if(ctx.store){
			// server side
			const { authentication	} = ctx.store.getState()
			const isAuthenticated = authentication && authentication.token !== null;
			if(isAuthenticated){
				redirect = false;
			}else{
				redirect = true;
			}
		}
		const initialProps = Page.getInitialProps && await Page.getInitialProps(ctx);
		return {...initialProps, redirect};
	}

	componentDidMount(){
		console.log('aaa', this);
		const { redirect } = this.props;
		if(redirect){
			setTimeout(function() {
				Router.push('/auth/login');
			}, 0);
		}
	}
  
	render() {
	  const { redirect } = this.props;
	  return !redirect ? <Page {...this.props} /> : <Trans>This page requires you to be logged in.</Trans>
	}
}
export default requireAuth;