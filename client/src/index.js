import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Favicon from 'react-favicon';
import { LastLocationProvider } from 'react-router-last-location';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from 'react-private-route';
import Fade from 'react-reveal/Fade';

import MasterPage from './Components/Common/Master/MasterPage';
import HomePage from './Components/Common/HomePage'; 
import NotFoundPage from './Components/Common/NotFoundPage';
import Auth from './Components/Auth/Auth';
import AuthPage from './Components/Auth/AuthPage';
import { AuthConsumer } from './Contexts/authContext';

class App extends Component {
	render() {
		return (
			<AuthConsumer>
				{({ authenticated }) => {
					return (
						<MasterPage>
							<Switch>
								<Route exact path="/" component={HomePage} />
								<PrivateRoute
									path="/private-exemple"
									redirect="/authenticate"
									component={NotFoundPage}
									isAuthenticated={authenticated}
								/>
								<Route component={NotFoundPage} />
							</Switch>
						</MasterPage>
					);
				}}
			</AuthConsumer>
		);
	}
}

ReactDOM.render(
	<Fade clear>
		<Auth>
			<Router>
				<LastLocationProvider>
					<Favicon url="img/favicon.png" />
					<Switch>
						<Route exact path="/authenticate" component={AuthPage} />
						<Route path="/" component={App} />
					</Switch>
				</LastLocationProvider>
			</Router>
		</Auth>
	</Fade>,
	document.getElementById('root')
);
