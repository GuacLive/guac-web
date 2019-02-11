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
import featured from './featured';

const blank = () => { return null; };
export default combineReducers({
	blank,
	[FLOPFLIP_STATE_SLICE]: createFlopflipReducer(EXPERIMENTS),
	authentication: auth,
	channel,
	featured,
});