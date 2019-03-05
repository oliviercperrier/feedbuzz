import React, { Component } from 'react';

import MyFavorites from './Sections/MyFavorites';
import MyReviews from './Sections/MyReviews';
import MyProfile from './Sections/MyProfile';
import MySettings from './Sections/MySettings';

/**
 * Show the account information of the current user
 * 
 * Route: /my-account
 */
class MyAccount extends Component {
	constructor(props) {
		super(props);

		this.menuItems = [
			{ title: 'My profile', component: 1 },
			{ title: 'My favorites', component: 2 },
			{ title: 'My reviews', component: 3 },
			{ title: 'My Settings', component: 4 }
		];

		this.state = {
			component: 1
		};

		this.getCurrentSectionComponent = this.getCurrentSectionComponent.bind(this);
	}

	getCurrentSectionComponent() {
		switch (this.state.component) {
			case 1:
				return <MyProfile></MyProfile>;
			case 2:
				return <MyFavorites></MyFavorites>;
			case 3:
				return <MyReviews></MyReviews>;
			case 4:
				return <MySettings></MySettings>;
		}
	}

	render() {
		const menuItems = this.menuItems.map((item) => <li key={item.title}>{item.title}</li>);

		return (
			<div className="my-account-container container">
				<div className="columns">
					<div className="column is-one-quarter">
						<ul>{menuItems}</ul>
					</div>
					<div className="column">
						{this.getCurrentSectionComponent()}
					</div>
				</div>
			</div>
		);
	}
}

export default MyAccount;
