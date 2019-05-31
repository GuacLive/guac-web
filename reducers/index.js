import { combineReducers } from 'redux';

import {
	createFlopflipReducer,

	// We refer to this state slice in the `injectFeatureToggles`
	// HoC and currently do not support a custom state slice.
	FLOPFLIP_STATE_SLICE
} from '@flopflip/react-redux';

import EXPERIMENTS from '!../experiments.json'; // eslint-disable-line no-unused-vars

import auth from './auth';
import channel from './channel';
import emotes from './emotes';
import featured from './featured';
import streaming from './streaming';
import site from './site';

export default combineReducers({
	[FLOPFLIP_STATE_SLICE]: createFlopflipReducer(EXPERIMENTS),
	authentication: auth,
	channel,
	emotes,
	featured,
	streaming,
	site,
});