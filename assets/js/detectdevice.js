class Device {
	constructor() {
		this._agent = navigator.userAgent.toLowerCase();
	}

	detectAndroid() {
		return this._agent.includes('android');
	}
}

