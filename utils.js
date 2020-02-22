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
export function secondsToDhms(seconds) {
	let output = '';
	seconds = Number(seconds);
	let d = Math.floor(seconds / (3600 * 24));
	let h = Math.floor(seconds % (3600 * 24) / 3600);
	let m = Math.floor(seconds % 3600 / 60);
	let s = Math.floor(seconds % 60);
	let dDisplay = d > 0 ? d + (d === 1 ? ' day' : ' days') : '';
	let hDisplay = h > 0 ? h + (h === 1 ? ' hour' : ' hours') : '';
	let mDisplay = m > 0 ? m + (m === 1 ? ' minute' : ' minutes') : '';
	let sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
	if (dDisplay) {
		output += dDisplay;
	}
	if (hDisplay) {
		output += (output.length !== 0 ? ' , ' : '') + hDisplay;
	}
	if (mDisplay) {
		output += (output.length !== 0 ? ' , ' : '') + mDisplay;
	} else if (sDisplay) {
		output += (output.length !== 0 ? ' , ' : '') + sDisplay;
	}
	return output;
}
