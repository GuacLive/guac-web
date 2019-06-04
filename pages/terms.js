import React, {Component} from 'react';

import {connect} from 'react-redux';

class PrivacyPage extends Component {
	render() {
		return (
			<div className="mw7 lh-copy mv0">
				<h2 className="f2 tracked mt0 mb3">Terms of use</h2>
				<p>We will review every reported user on a case-by-case basis, and give <b>warnings</b> or <b>temporary/permanent bans</b> depending on the severity of the case.</p>
				<div className="bg-light-red pa2 br2-ns ba b--black-10">
					<h2 className="white">The following content is <b>forbidden</b> on guac.live:</h2>
				</div>
				<h3 className="white">Pornographic/Sexually Explicit Content</h3>
				<p>Pornographic and sexually explicit content is not permitted in any form, including in profile pictures or streaming content.</p>
				<h3 className="white">Copyrighted Content</h3>
				<p>You may not stream copyright infringing content, such as movies and TV shows.</p>
				<h3 className="white">Harassment & Bullying</h3>
				<p>Do not engage, or encourage others to engage, in any targeted abuse or harassment against any other user.</p>
				<h3 className="white">Threats, Violence & Harm</h3>
				<p>Serious threats of harm to public and personal safety aren't allowed. This includes specific threats of physical harm as well as threats of theft, vandalism, and other financial harm.<br />We don’t allow the glorification of self-harm.</p>
				<h3 className="white">Hate Speech</h3>
				<p>Do not engage in hate speech.</p>
				<h3 className="white">Breaking the law</h3>
				<p>You must respect all applicable local, national, and international laws while using our services. Any content or activity featuring, encouraging, offering, or soliciting illegal activity is prohibited.</p>
			</div>
		);
	}
}
export default connect(state => state)(PrivacyPage)