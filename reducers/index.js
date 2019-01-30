import { combineReducers } from 'redux';

import auth from './auth';
import channel from './channel';
import featured from './featured';

const blank = () => { return null; };
export default combineReducers({
	blank,
	authentication: auth,
	channel,
	featured,
});