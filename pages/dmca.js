import React, {Component} from 'react';

import {connect} from 'react-redux';

import { Trans } from '@lingui/macro';

class DMCAPage extends Component {
	render() {
		return (
			<div className="pv3 ph3-l mw7 lh-copy mv0">
				<h2 className="f2 tracked mt0 mb3"><Trans>Digital Millennium Copyright Act</Trans></h2>
				<h3 className="f3 tracked mt0 mb3"><Trans>Notification of Infringement</Trans></h3>
				<p><Trans>It is our policy to respond to clear notices of
	alleged copyright infringement that comply with the Digital Millennium
	Copyright Act. In addition, we will promptly terminate without notice
	the accounts of those determined by us to be &quot;repeat
	infringers&quot;. If you are a copyright owner or an agent thereof, and
	you believe that any content hosted on our web site
	(www.guac.live) infringes your copyrights, then you may submit a
	notification pursuant to the Digital Millennium Copyright Act
	(&quot;DMCA&quot;) by providing Guac.live&#039;s Designated
	Copyright Agent with the following information in writing (please
	consult your legal counsel or see 17 U.S.C. Section 512(c)(3) to
	confirm these requirements):</Trans></p>
			<ul>
				<li className="list">
					A physical or electronic signature of a person authorized to act on
					behalf of the owner of an exclusive right that is allegedly
					infringed.
				</li>
				<li className="list">
					Identification of the copyrighted work claimed to have been infringed,
					or, if multiple copyrighted works on the Guac.live web site are
					covered by a single notification, a representative list of such works
					at that site.
				</li>
				<li className="list">
					Identification of the material that is claimed to be infringing or to
					be the subject of infringing activity and that is to be removed or
					access to which is to be disabled, and information reasonably
					sufficient to permit Guac.live to locate the material. Providing a
					broadcaster's feed and the time on such feed at which you believe there
					has been an infringement is the best way to help us locate content
					quickly.
				</li>
				<li className="list">
					Information reasonably sufficient to permit Guac.live to contact
					you, such as an address, telephone number, and, if available, an
					electronic mail address at which you may be contacted.
				</li>
				<li className="list">
					A statement that you have a good faith belief that use of the
					material in the manner complained of is not authorized by the copyright
					owner, its agent, or the law.
				</li>
				<li className="list">
					A statement that the information in the notification is accurate, and
					under penalty of perjury, that you are authorized to act on behalf of
					the owner of an exclusive right that is allegedly infringed.
				</li>
			</ul>
			<p>
			<br />
	Please note that under Section 512(f) of the DMCA, any person who
	knowingly materially misrepresents that material or activity is
	infringing may be subject to liability. 
	<br /><br />

	Please note that Guac.live may, at our discretion, send a copy of
	such notices to a third-party for publication. As such, your letter
	(with personal information removed) may be forwarded to Chilling
	Effects (<a href="http://www.chillingeffects.org" rel="nofollow"
	target="_blank" className="primary">www.chillingeffects.org</a>) for publication.
			</p>
			<h3 className="f3 tracked mt0 mb3"><Trans>Counter-Notification</Trans></h3>
			<p>If you elect to send us a counter notice, to be effective it must be a written communication that includes the following (please consult your legal counsel or see 17 U.S.C. Section 512(g)(3) to confirm these requirements):
	<ul>
	  <li className="list">
		Your physical or electronic signature.
	  </li>
	  <li className="list">
		Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access to it was disabled.
	  </li>
	  <li className="list">
		A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled.
	  </li>
	  <li className="list">
		The subscriber's name, address, and telephone number, and a statement that you consent to the jurisdiction of Federal District Court for the judicial district in which the address is located, or if your address is outside of the United States, for any judicial district in which Guac.live may be found, and that you will accept service of process from the person who provided notification under subsection (c)(1)(C) or an agent of such person.
	  </li>
	  <br />
	  Please note that under Section 512(f) of the Copyright Act, any person who knowingly materially misrepresents that material or activity was removed or disabled by mistake or misidentification may be subject to liability.
	</ul></p>
	
	<h3 className="f3 tracked mt0 mb3"><Trans>Designated Copyright Agent</Trans></h3>
	<p>Guac.live's Designated Copyright Agent to receive notifications and counter-notifications of claimed infringement can be reached by email: contact@guac.live</p>
			</div>
		);
	}
}
export default connect(state => state)(DMCAPage)