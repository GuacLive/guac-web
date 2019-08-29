import React, {Component} from 'react';

import {connect} from 'react-redux';

import { Trans } from '@lingui/macro';

class PrivacyPage extends Component {
	render() {
		return (
			<div className="mw7 lh-copy mv0">
				<h2 className="f2 tracked mt0 mb3"><Trans>Terms of use</Trans></h2>
				<p><Trans>We will review every reported user on a case-by-case basis, and give <b>warnings</b> or <b>temporary/permanent bans</b> depending on the severity of the case.</Trans></p>
				<div className="bg-light-red pa2 br2-ns ba b--black-10">
					<h2 className="white"><Trans>The following content is <b>forbidden</b> on guac.live:</Trans></h2>
				</div>
				<h3 className="white"><Trans>Pornographic/Sexually Explicit Content</Trans></h3>
				<p><Trans>Pornographic and sexually explicit content is not permitted in any form, including in profile pictures or streaming content.</Trans></p>
				<h3 className="white"><Trans>Copyrighted Content</Trans></h3>
				<p><Trans>You may not stream copyright infringing content, such as movies and TV shows.</Trans></p>
				<h3 className="white"><Trans>Harassment & Bullying</Trans></h3>
				<p><Trans>Do not engage, or encourage others to engage, in any targeted abuse or harassment against any other user.</Trans></p>
				<h3 className="white"><Trans>Threats, Violence & Harm</Trans></h3>
				<p>Serious threats of harm to public and personal safety aren't allowed. This includes specific threats of physical harm as well as threats of theft, vandalism, and other financial harm.<br />We don’t allow the glorification of self-harm.</p>
				<h3 className="white"><Trans>Hate Speech</Trans></h3>
				<p><Trans>Do not engage in hate speech.</Trans></p>
				<h3 className="white"><Trans>Breaking the law</Trans></h3>
				<p><Trans>You must respect all applicable local, national, and international laws while using our services. Any content or activity featuring, encouraging, offering, or soliciting illegal activity is prohibited.</Trans></p>
			</div>
		);
	}
}
export default connect(state => state)(PrivacyPage)