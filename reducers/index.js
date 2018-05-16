import { combineReducers } from 'redux';

import featured from './featured';

const blank = () => { return null; };
export default combineReducers({
	blank,
	featured,
});