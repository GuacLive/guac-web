export function arrayToQueryString(array_in) {
	const out = [];

	Object.keys(array_in).forEach(key => {
		if (array_in[key]) out.push(key + '=' + encodeURIComponent(array_in[key]));
	});

	return out.join('&');
}
export function isObjEmpty(obj) {
	return obj && typeof obj == 'object' && Object.keys(obj).length === 0 && obj.constructor === Object;
}
export function kFormatter(num) {
	return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num);
}