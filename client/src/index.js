import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Favicon from 'react-favicon';
import { LastLocationProvider } from 'react-router-last-location';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PrivateRoute from 'react-private-route';
import Fade from 'react-reveal/Fade';

/* COMMON */
import MasterPage from './Components/Common/Master/MasterPage';
import HomePage from './Components/Common/HomePage';
import NotFoundPage from './Components/Common/NotFoundPage';

/* AUTH */
import Auth from './Components/Auth/Auth';
import AuthPage from './Components/Auth/AuthPage';
import { AuthConsumer } from './Contexts/authContext';
import MyAccount from './Components/Account/MyAccount';

/* PRODUCTS */
import ProductListing from './Components/Product/Listing/ProductListing';
import ProductDetails from './Components/Product/ProductDetails';
import ProductRating from './Components/Product/Rating/ProductRating';

class App extends Component {
	render() {
		return (
			<AuthConsumer>
				{({ authenticated }) => {
					console.log(authenticated);
					return (
						<MasterPage>
							<Switch>
								<Route exact path="/" component={HomePage} />
								<Route exact path="/products" component={ProductListing} />
								<Route exact path="/product/:id" component={ProductDetails} />
								<PrivateRoute
									exact
									path="/product/review/:id"
									redirect="/authenticate"
									component={ProductRating}
									isAuthenticated={authenticated}
								/>
								<PrivateRoute
									path="/my-account"
									redirect="/authenticate"
									component={MyAccount}
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
	<Router>
		<Fade clear>
			<Auth>
				<LastLocationProvider>
					<Favicon url="/img/favicon.png" />
					<Switch>
						<Route exact path="/authenticate" component={AuthPage} />
						<Route path="/" component={App} />
					</Switch>
				</LastLocationProvider>
			</Auth>
		</Fade>
	</Router>,
	document.getElementById('root')
);
