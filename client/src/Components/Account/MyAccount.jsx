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
		this.handleSectionChange = this.handleSectionChange.bind(this);
	}

	getCurrentSectionComponent() {
		switch (parseInt(this.state.component)) {
			case 1:
				return <MyProfile />;
			case 2:
				return <MyFavorites />;
			case 3:
				return <MyReviews />;
			case 4:
				return <MySettings />;
			default:
				return <MyProfile />;
		}
	}

	handleSectionChange(e) {
		this.setState({ component: e.currentTarget.getAttribute('data-component-id') });
	}

	render() {
		const { component } = this.state;
		const menuItems = this.menuItems.map((item) => {
			return (
				<li
					key={item.title}
					className={"account-menu-item " + (component === item.component ? "active" : "") }
					data-component-id={item.component}
					onClick={this.handleSectionChange}
				>
					{item.title}
				</li>
			);
		});

		return (
			<div className="my-account-container container">
				<div className="columns">
					<div className="column is-one-third">
						<Avatar round={true} src="img/avatar-placeholder.png" />
						<ul className="account-menu">{menuItems}</ul>
					</div>
					<div className="column section-container">{this.getCurrentSectionComponent()}</div>
				</div>
			</div>
		);
	}
}

export default MyAccount;
