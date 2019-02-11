import { combineReducers } from 'redux';

import {
	flopflipReducer,

	// We refer to this state slice in the `injectFeatureToggles`
	// HoC and currently do not support a custom state slice.
	FLOPFLIP_STATE_SLICE
} from '@flopflip/react-redux';

import auth from './auth';
import channel from './channel';
import featured from './featured';

const blank = () => { return null; };
export default combineReducers({
	blank,
	[FLOPFLIP_STATE_SLICE]: flopflipReducer,
	authentication: auth,
	channel,
	featured,
});