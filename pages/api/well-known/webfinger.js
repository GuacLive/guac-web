function getHostWithPort(host) {
	const splitted = host.split(':');

	// The port was not specified
	if(splitted.length === 1){
		return host + ':443';
	}

	return host;
}
export default async function handler(req, res) {
	if(!req.query || !req.query.resource){
		res.statusCode = 400
		res.setHeader('Content-Type', 'application/json')
		return res.end(JSON.stringify({error: 'Actor not provided'}));
	}
	// Remove 'acct:' from the beginning of the string
	const nameWithHost = getHostWithPort(req.query.resource.substr(5))
	const [name] = nameWithHost.split('@')

	// Check if user exists
	let api = await fetch(`${process.env.API_URL}/auth/username/${name}`,
		{
			method: 'get',
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

	var actor;
	try{
		actor = await api.json();
	}catch(e){}
	if(!actor || !actor.user){
		res.statusCode = 404
		res.setHeader('Content-Type', 'application/json')
		return res.end(JSON.stringify({error: 'Actor not found'}));
	}
	
	const json = {
		subject: req.query.resource,
		aliases: [`${process.env.API_URL}/actor/${actor.user.name}`],
		links: [
			{
				rel: 'self',
				type: 'application/activity+json',
				href: `${process.env.API_URL}/actor/${actor.user.name}`
			}
		]
	};
	

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(json));
}  