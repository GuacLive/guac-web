const { EventEmitter } = require('events');

import parseISO from 'date-fns/parseISO';
import isWithinInterval from 'date-fns/isWithinInterval';

const featuresFallback = {
	'guacWelcome': {
		'status': 'on'
	},
	'featureFallback': {
		'status': 'on'
	}
};
export default class FeaturesService extends EventEmitter {
	constructor(features){
		super();
		this.features = features || {};
		this.loading = true;
		this.on('featuresLoaded', this.featuresLoaded.bind(this));
		this.on('featuresUpdate', this.featuresUpdate.bind(this));
		if(Object.keys(this.features).length === 0){
			if(process.browser){
				this.hydrate();
			}else{
				this.loadingFeatures();
			}
		}else{
			this.loading = false;
		}
		if(process.browser){
			window.featuresService = this;
		}
	}
	hydrate() {
		if(
			window &&
			window.__NEXT_DATA__ &&
			window.__NEXT_DATA__.props &&
			window.__NEXT_DATA__.props.initialProps &&
			window.__NEXT_DATA__.props.initialProps.featuresService
		){
			this.emit('featuresLoaded', window.__NEXT_DATA__.props.initialProps.featuresService.features);
		}
	}
	loadingFeatures() {
		fetch(`${process.env.STATIC_URL}/settings/features.json`, {timeout: 5000})
			.then(res => res ? res.json() : res)
			.then(data => {
				this.emit('featuresLoaded', data);
			}).catch(() => {
				this.emit('featuresLoaded');
			});
	}
	featuresLoaded(data) {
		this.loading = false;
		if(data && Object.keys(data).length > 0){
			this.features = data;
			this.emit('featuresUpdate', data);
		}else{
			this.features = featuresFallback;
		}
	}
	featuresUpdate(e) {
	}
	checkOnFeatures(e, t) {
		return this.features &&
			this.features[e] &&
			this.features[e].indexOf(t) > -1;
	}
	checkOnGlobalFeatures(e) {
		return this.features &&
			this.features[e] &&
			'on' === this.features[e].status;
	}
	checkOnFeaturesDate(e) {
		return this.features &&
			this.features[e] &&
			this.features[e].between &&
			isWithinInterval(parseISO(new Date().toISOString()), {
				start: parseISO(this.features[e].between.start),
				end: parseISO(this.features[e].between.end)
			});
	}
	getFeaturesConfigField(e, t) {
		if(this.features &&
			this.features[e] &&
			this.features[e].config &&
			this.features[e].config[t]){
			return this.features[e].config[t];
		}
	}
}