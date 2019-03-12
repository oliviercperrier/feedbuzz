import React, { Component } from 'react';
import Avatar from 'react-avatar';

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

		this.views = {
			0: MyProfile,
			1: MyFavorites,
			2: MyReviews,
			3: MySettings
		};

		this.menuItems = [
			{ title: 'My profile', component: 0 },
			{ title: 'My favorites', component: 1 },
			{ title: 'My reviews', component: 2 },
			{ title: 'My Settings', component: 3 }
		];

		this.state = {
			component: 0
		};

		this.getCurrentSectionComponent = this.getCurrentSectionComponent.bind(this);
		this.handleSectionChange = this.handleSectionChange.bind(this);
	}

	handleSectionChange(e) {
		this.setState({ component: this.views[e.currentTarget.getAttribute('data-component')] });
	}

	render() {
		const { component } = this.state;
		const CurrentView = this.views[component];
		const menuItems = this.menuItems.map((item) => {
			return (
				<li
					key={item.title}
					className={'account-menu-item ' + (component === item.component ? 'active' : '')}
					data-component={item.component}
					onClick={this.handleSectionChange}
				>
					{item.title}
				</li>
			);
		});

		return (
			<div className="my-account-container container">
				<div className="columns">
					<div className="column is-one-quarter account-sidebar">
						<Avatar round={true} src="img/favicon.svg" />
						<ul className="account-menu">{menuItems}</ul>
					</div>
					<div className="column section-container">
						<CurrentView />
					</div>
				</div>
			</div>
		);
	}
}

export default MyAccount;
