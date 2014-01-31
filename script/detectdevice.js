var Device = function() {
	this.agent = navigator.userAgent.toLowerCase();
	this.deviceAndroid = "android";
}

Device.prototype = {
	detectAndroid: function() {
    if (this.agent.search(this.deviceAndroid) > -1)
      return true;
	else
      return false;
	} 
};

