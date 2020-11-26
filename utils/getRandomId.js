export default function getRandomId(length){
	if(!length){
		return '';
	}

	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let array;

	if('Uint8Array' in self && 'crypto' in self && length <= 65536){
		array = new Uint8Array(length);
		self.crypto.getRandomValues(array);
	}else{
		array = new Array(length);

		for(let i = 0; i < length; i++){
			array[i] = Math.floor(Math.random() * 62);
		}
	}

	let result = '';

	for(let i = 0; i < length; i++){
		result += possible.charAt(array[i] % 62);
	}

	return result;
}
