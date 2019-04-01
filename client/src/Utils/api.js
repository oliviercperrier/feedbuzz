import { MdReport } from 'react-icons/md';

var axios = require('axios');
var TokenManager = require('./tokenManager');
var Storage = require('../Utils/browserStorage');

export const API = axios.create();
API.defaults.baseURL = window.baseURL;
API.defaults.headers.post['Content-Type'] = 'application/json';

if (TokenManager.getAccessToken()) {
	API.defaults.headers.common['Authorization'] = 'Bearer ' + TokenManager.getAccessToken();
}

export const updateAPIHeader = function(token) {
	if (token) {
		API.defaults.headers.common['Authorization'] = 'Bearer ' + token;
	} else { 
		delete axios.defaults.headers.common['Authorization'];
	}
};

async function verifyTokenID() {
	return API.get('/auth/verify').catch(async function(error) {
		if (error.response.data.exception === 'InvalidToken') {
			const response = await API.post('/auth/refresh', {
				refresh_token: TokenManager.getRefreshToken()
			});

			TokenManager.updateAccessToken(response.data.access_token);
			updateAPIHeader(TokenManager.getAccessToken());
		}
	});
}

export const getProductRating = async function(product_id) {
	await verifyTokenID();
	const response = await API.get('/api/rating/product/' + product_id);
	return response.data;
};

export const getUserRating = async function(user_id) {
	await verifyTokenID();
	const response = await API.get('/api/rating/user/' + user_id);
	return response.data;
};

export const saveRating = async function(data) {
	await verifyTokenID();
	const response = await API.post('/api/rating', data);
	return response.success;
};

export const updateUser = async function(data) {
	await verifyTokenID();
	const response = await API.put('/api/user', data);
	Storage.getStorage().setItem('usr_info', JSON.stringify(response.data.me));
	return response.data.me;
};

export const getUser = async function() {
	await verifyTokenID();
	const response = await API.get('/auth/me');
	return response.data.me;
};
