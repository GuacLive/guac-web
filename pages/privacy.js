import React, {Component} from 'react';

import {connect} from 'react-redux';

import { Trans } from '@lingui/macro';

class PrivacyPage extends Component {
	render() {
		return (
				<div className="mw7 lh-copy mv0">
					<h2 className="f2 tracked mt0 mb3"><Trans>Privacy Policy</Trans></h2>
				    <p><a name="collect"></a></p>
<h2><a className="link primary" href="#collect">What information do we collect?</a></h2>
<ul>
	<li>Basic account information: If you register on this server, you may be asked to enter a username, an e-mail address and a password. You may also enter additional profile information such as a display name and biography, and upload a profile picture and header image. The username, display name, biography and avatar image are always listed publicly.</li>
	<li>IPs and other metadata: When you log in, we record the IP address you log in from, as well as the name of your browser application. All the logged in sessions are available for your review and revocation in the settings. The latest IP address used is stored for up to 12 months. We also may retain server logs which include the IP address of every request to our server.</li>
</ul>
<p><a name="use"></a></p>
<h2><a className="link primary" href="#use">What do we use your information for?</a></h2>
<p>Any of the information we collect from you may be used in one of the following ways:</p>
<ul>
<li>To provide the core functionality of Guac. You can only interact with other people’s content and post your own content when you are logged in. For example, you may follow other people to see when they're live, or write in their chat.</li>
<li>To aid moderation of the community, for example comparing your IP address with other known ones to determine ban evasion or other violations.</li>
<li>The email address you provide may be used to send you information, notifications about other people interacting with your content or sending you messages, and to respond to inquiries, and/or other requests or questions.</li>
</ul>
<p><a name="protect"></a></p>
<h2><a className="link primary" href="#protect">How do we protect your information?</a></h2>
<p>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. Among other things, your browser session, as well as the traffic between your applications and the API, are secured with SSL, and your password is hashed using a strong one-way algorithm. You may enable two-factor authentication to further secure access to your account.</p>
<p><a name="data-retention"></a></p>
<h2><a className="link primary" href="#data-retention">What is your data retention policy?</a></h2>
<p>We will make a good faith effort to:</p>
<ul>
<li>Retain server logs containing the IP address of all requests to this server, in so far as such logs are kept, no more than 90 days.</li>
<li>Retain the IP addresses associated with registered users no more than 12 months.</li>
</ul>
<p>You may irreversibly delete your account at any time.</p>
<p><a name="cookies"></a></p>
<h2><a className="link primary" href="#cookies">Do we use cookies?</a></h2>
<p>Yes. Cookies are small files that a site or its service provider transfers to your computer’s hard drive through your Web browser (if you allow). These cookies enable the site to recognize your browser and, if you have a registered account, associate it with your registered account.</p>
<p>We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future. We may contract with third-party service providers to assist us in better understanding our site visitors. These service providers are not permitted to use the information collected on our behalf except to help us conduct and improve our business.</p>
<p><a name="disclose"></a></p>
<h2><a className="link primary" href="#disclose">Do we disclose any information to outside parties?</a></h2>
<p>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our site, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others rights, property, or safety. However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.</p>
<p><a name="third-party"></a></p>
<h2><a className="link primary" href="#third-party">Third party links</a></h2>
<p>Occasionally, at our discretion, we may include or offer third party products or services on our site. These third party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.</p>
<p><a name="coppa"></a></p>
<h2><a className="link primary" href="#coppa">Children’s Online Privacy Protection Act Compliance</a></h2>
<p class="">If this server is in the EU or the EEA: Our site, products and services are all directed to people who are at least 16 years old. If you are under the age of 16, per the requirements of the GDPR (General Data Protection Regulation) do not use this site.</p>
<p class="">If this server is in the USA: Our site, products and services are all directed to people who are at least 13 years old. If you are under the age of 13, per the requirements of COPPA (Children's Online Privacy Protection Act) do not use this site.</p>
<p class="">Law requirements can be different if this server is in another jurisdiction.</p>
<h2><a className="link primary" href="#online">Online Privacy Policy Only</a></h2>
<p>This online privacy policy applies only to information collected through our site and not to information collected offline.</p>
<p><a name="consent"></a></p>
<h2><a className="link primary" href="#consent">Your Consent</a></h2>
<p>By using our site, you consent to our web site privacy policy.</p>
<p><a name="changes"></a></p>
<h2><a className="link primary" href="#changes">Changes to our Privacy Policy</a></h2>
<p>If we decide to change our privacy policy, we will post those changes on this page.</p>
<p>This document is CC-BY-SA. It was last updated May 18, 2019.</p>
<p>Originally adapted from the <a className="primary" href="https://mastodon.social/terms">Mastodon</a> privacy policy.</p>
			</div>
		)
	}
}
export default connect(state => state)(PrivacyPage)