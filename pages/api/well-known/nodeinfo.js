export default function handler(req, res) {
	const json = {
		links: [
			{
				rel: 'http://nodeinfo.diaspora.software/ns/schema/2.0',
				href: `${process.env.API_URL}/nodeinfo/2.0`
			}
		]
	};

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(json));
} 