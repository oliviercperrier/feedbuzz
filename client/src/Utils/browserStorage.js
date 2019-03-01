var Cookies = require('js-cookie');

var storageUtil = {};

storageUtil.browserHasLocalStorage = function() {
	try {
		var storage = storageUtil.getLocalStorage();
		return storageUtil.testStorage(storage);
	} catch (e) {
		return false;
	}
};

storageUtil.getLocalStorage = function() {
	return localStorage;
};

storageUtil.getCookieStorage = function() {
	return {
		getItem: storageUtil.storage.get,
		setItem: function(key, value) {
			storageUtil.storage.set(key, value, '2200-01-01T00:00:00.000Z');
		}
	};
};

storageUtil.testStorage = function(storage) {
	var key = 'test-storage';
	try {
		storage.setItem(key, key);
		storage.removeItem(key);
		return true;
	} catch (e) {
		return false;
	}
};

storageUtil.storage = {
	set: function(name, value, expiresAt) {
		var cookieOptions = {
			path: '/'
		};

		if (!!Date.parse(expiresAt)) {
			cookieOptions.expires = new Date(expiresAt);
		}

		Cookies.set(name, value, cookieOptions);
		return storageUtil.storage.get(name);
	},

	get: function(name) {
		return Cookies.get(name);
	},

	delete: function(name) {
		return Cookies.remove(name, { path: '/' });
	}
};

module.exports.getStorage = function() {
	if (storageUtil.browserHasLocalStorage()) {
		return storageUtil.getLocalStorage();
	} else {
		return storageUtil.getCookieStorage();
	}
};
