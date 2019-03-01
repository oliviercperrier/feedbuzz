import { createContext } from 'react';

const authContext = createContext({
	authenticated: null,
	user: {},
	signup: () => {},
	login: () => {},
	logout: () => {}
});

export const AuthProvider = authContext.Provider;
export const AuthConsumer = authContext.Consumer;
