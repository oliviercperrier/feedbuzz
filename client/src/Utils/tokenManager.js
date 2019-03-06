var storage = require('./browserStorage');

module.exports.getAccessToken = function() {
	return storage.getStorage().getItem('access_token');
};

module.exports.updateAccessToken = function(access_token) {
	storage.getStorage().setItem('access_token', access_token);
};

module.exports.getRefreshToken = function() {
	return storage.getStorage().getItem('refresh_token');
};

module.exports.updateRefreshToken = function(refresh_token) {
	return storage.getStorage().setItem('refresh_token', refresh_token);
};

module.exports.clearTokens = function() {
	storage.getStorage().setItem('access_token', '');
	storage.getStorage().setItem('refresh_token', '');
};
