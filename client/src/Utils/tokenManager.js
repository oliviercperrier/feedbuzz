var storage = require('./browserStorage');

module.exports.getTokenID = function() {
	return storage.getStorage().getItem('token_id');
};

module.exports.updateTokenID = function(token_id) {
	storage.getStorage().setItem('token_id', token_id);
};

module.exports.clearTokenID = function() {
    storage.getStorage().setItem('token_id', '');
};
