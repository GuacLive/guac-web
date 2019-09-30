export default function log(type = 'info', caller = 'base', text = '', ...logs) {
	let typeBg, callerBg;
	if(process.env.NODE_ENV === 'production'){
		//return;
	}

	switch(type){
		case 'success':
			typeBg = 'background: #267710; color: #e8e8e8; border-radius: 0 3px 3px 0;';
			break;
		case 'error':
			typeBg = 'background: #771010; color: #e8e8e8; border-radius: 0 3px 3px 0;';
			break;
		case 'info':
			typeBg = 'background: #105577; color: #e8e8e8; border-radius: 0 3px 3px 0;';
			break
	}

	if(!caller){
		if(logs){
			return console.log(`%c guac.live %c ${text} `, 'background: #0FABE9; color: #e8e8e8; border-radius: 3px 0 0 3px;', typeBg, ...logs)
		}else{
			return console.log(`%c guac.live %c ${text} `, 'background: #0FABE9; color: #e8e8e8; border-radius: 3px 0 0 3px;', typeBg);
		}
	}

	callerBg = 'background: #00619F; color: #e8e8e8; border-radius: 0 3px 3px 0;';

	return console.log(`%c guac.live %c ${caller.charAt(0).toUpperCase() + caller.slice(1)} %c ${text} `, 'background: #0FABE9; color: #e8e8e8; border-radius: 0 3px 3px 0;', callerBg, typeBg, ...logs);
}