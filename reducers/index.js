import { combineReducers } from 'redux';

import {	
	createFlopflipReducer,	

	// We refer to this state slice in the `injectFeatureToggles`	
	// HoC and currently do not support a custom state slice.	
	FLOPFLIP_STATE_SLICE	
} from '@flopflip/react-redux';	

import auth from './auth';
import categories from './categories';
import channel from './channel';
import channels from './channels';
import replays from './replays';
import emotes from './emotes';
import featured from './featured';
import streaming from './streaming';
import streams from './streams';
import site from './site';

export default combineReducers({
	[FLOPFLIP_STATE_SLICE]: createFlopflipReducer(),
	authentication: auth,
	categories,
	channel,
	channels,
	replays,
	emotes,
	featured,
	streaming,
	site,
	streams,
});