import React, { Component } from 'react';
import ReactNotification from 'react-notifications-component';
import NotificationSystem from 'react-notification-system';

import { AuthConsumer } from '../../../Contexts/authContext';

class MyProfile extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: '',
			username: '',
			email: '',
			gender: '',
			loading: false
		};

		this.notificationSystem = React.createRef();

		this.addNotification = this.addNotification.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleGenderChange = this.handleGenderChange.bind(this);
	}

	componentDidMount() {
		this._notificationSystem = this.refs.notificationSystem;
	}

	addNotification() {
		const notification = this.notificationSystem.current;
		notification.addNotification({
			title: 'Success',
			message: 'Your information were saved successfully!',
			level: 'success',
			dismissible: false
		});
	}

	handleInputChange(e) {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value });
	}

	handleGenderChange(e) {
		this.setState({ gender: e.currentTarget.value });
	}

	handleSave(e) {
		this.setState({ loading: true });

		//FAKE LOADING FOR TEST
		setTimeout(function() {
			this.setState({ loading: false });
			this.addNotification();
		}.bind(this), 2000);
		/* SAVE DATA TO BACK END */
		// API.updateUser
	}

	render() {
		return (
			<AuthConsumer>
				{({ user }) => {
					const { name, username, email, gender, loading } = this.state;

					var style = {
						NotificationItem: {
							DefaultStyle: {
								margin: '10px 5px 2px 1px'
							},

							success: {
								borderTop: '2px solid #20bd67',
								color: 'white',
								backgroundColor: '#20bd67'
							}
						},
						Title: {
							success: {
								color: 'white'
							}
						}
					};

					return (
						<div className="my-profile">
							<NotificationSystem ref={this.notificationSystem} style={style} />
							<div className="section-title">My Profile</div>
							<div className="field is-horizontal">
								<div className="field-label is-normal">
									<label className="label">Name</label>
								</div>
								<div className="field-body">
									<div className="field">
										<p className="control">
											<input
												className="input"
												onChange={this.handleInputChange}
												type="text"
												name="name"
												value={name === '' ? user.first_name + ' ' + user.last_name : name}
												placeholder="Name"
											/>
										</p>
									</div>
								</div>
							</div>
							<div className="field is-horizontal">
								<div className="field-label is-normal">
									<label className="label">Username</label>
								</div>
								<div className="field-body">
									<div className="field">
										<p className="control">
											<input
												className="input"
												value={username === '' ? user.username : username}
												onChange={this.handleInputChange}
												type="text"
												name="username"
												placeholder="Username"
											/>
										</p>
									</div>
								</div>
							</div>
							<div className="field is-horizontal">
								<div className="field-label is-normal">
									<label className="label">Email</label>
								</div>
								<div className="field-body">
									<div className="field">
										<p className="control">
											<input
												className="input"
												onChange={this.handleInputChange}
												type="text"
												name="email"
												value={email === '' ? user.email : email}
												placeholder="Email"
											/>
										</p>
									</div>
								</div>
							</div>
							<div className="field is-horizontal">
								<div className="field-label is-normal">
									<label className="label">Gender</label>
								</div>
								<div className="field-body">
									<div className="field">
										<div className="control">
											<div className="select">
												<select
													value={gender === '' ? 'Male' || user.gender : gender}
													onChange={this.handleGenderChange}
												>
													<option>Male</option>
													<option>Female</option>
													<option>Other</option>
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="field">
								<div className="control is-clearfix">
									<button
										className={'button bg-color-trans ' + (loading ? 'is-loading' : '')}
										onClick={this.handleSave}
										type="save"
									>
										Save
									</button>
								</div>
							</div>
						</div>
					);
				}}
			</AuthConsumer>
		);
	}
}

export default MyProfile;
