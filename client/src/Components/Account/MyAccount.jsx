import React, { Component } from 'react';
import Avatar from 'react-avatar';
import queryString from 'query-string';

import MyFavorites from './Sections/MyFavorites';
import MyReviews from './Sections/MyReviews';
import MyProfile from './Sections/MyProfile';
import MySettings from './Sections/MySettings';

import { AuthConsumer } from '../../Contexts/authContext';
import { updateUser } from '../../Utils/api';

/**
 * Show the account information of the current user
 * 
 * Route: /my-account
 */
class MyAccount extends Component {
	constructor(props) {
		super(props);

		const search = queryString.parse(this.props.location.search);

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
			component: search.view === undefined || (search.view < 0 || search.view > 3) ? 0 : parseInt(search.view),
			image_loading: false,
			image_url: null
		};

		this.handleSectionChange = this.handleSectionChange.bind(this);
		this.handleRealFileInputChange = this.handleRealFileInputChange.bind(this);
	}

	handleSectionChange(e) {
		this.setState({ component: parseInt(e.currentTarget.getAttribute('data-component')) });
	}

	handleUploadImage(e) {
		e.preventDefault();
		document.getElementById('real-input').click();
	}

	handleRealFileInputChange(e) {
		if (e.currentTarget.files && e.currentTarget.files[0]) {
			var fileReader = new FileReader();
			var that = this;
			that.setState({ image_loading: true });

			fileReader.addEventListener('load', function(e) {
				//REMOVE name, username, etc.. when vincent make the update on unique param
				updateUser({
					name: 'name',
					username: 'username',
					gender: 'Male',
					email: 'email',
					image: e.target.result.split(',')[1]
				}).then((response) => {
					that.setState({
						image_loading: false,
						image_url: response.image_url
					});
				});
			});

			fileReader.readAsDataURL(e.currentTarget.files[0]);
		}
	}

	render() {
		const { component, image_loading, image_url } = this.state;
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
			<AuthConsumer>
				{({ user }) => {
					return (
						<div className="my-account-container container">
							<div className="columns">
								<div className="column is-one-quarter account-sidebar">
									<input type="file" id="real-input" onChange={this.handleRealFileInputChange} />
									<button onClick={this.handleUploadImage} className="browse-btn edit-user-image">
										Edit image
									</button>
									<Avatar
										className="user-image"
										round={false}
										src={
											image_loading ? (
												'img/loader.gif'
											) : user.image_url || image_url ? (
												(user.image_url || image_url) + ('?t=' + new Date().getTime())
											) : (
												'img/favicon.svg'
											)
										}
									/>
									<ul className="account-menu">{menuItems}</ul>
								</div>
								<div className="column section-container">
									<CurrentView user={user} />
								</div>
							</div>
						</div>
					);
				}}
			</AuthConsumer>
		);
	}
}

export default MyAccount;
