export default function handler(req, res) {
	const xml =  '<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">\n' +
	`  <Link rel="lrdd" type="application/xrd+xml" template="${req.getHeader('Host') || 'https://guac.live/'}/.well-known/webfinger?resource={uri}"/>\n` +
	'</XRD>';

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/xml');
	res.end(xml);
}  