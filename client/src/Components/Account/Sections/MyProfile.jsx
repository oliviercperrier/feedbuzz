import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';

import { Style } from '../../../Utils/notification';
import { updateUser } from '../../../Utils/api';
import Storage from '../../../Utils/browserStorage';

class MyProfile extends Component {
	constructor(props) {
		super(props);

		const { user } = this.props;
		this.state = {
			name: user.name,
			username: user.username,
			email: user.email,
			gender: user.gender ? user.gender : 'Male',
			image_url: user.image_url,
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
			message: 'Your profile was successfully updated!',
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
		const { name, username, gender, email } = this.state;

		updateUser({
			name: name,
			username: username,
			gender: gender,
			email: email
		}).then((response) => {
			this.setState({ loading: false });
			this.addNotification();
		});
	}

	updateStateUserInfo(user) {
		const { name, username, gender, email } = this.state;
		if (!name || !username || !gender || !email) {
			this.setState({
				name: name,
				username: username,
				gender: gender,
				email: email
			});
		}
	}

	render() {
		const { name, username, email, gender, loading } = this.state;

		return (
			<div className="my-profile">
				<NotificationSystem ref={this.notificationSystem} style={Style} />
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
									value={name}
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
									value={username}
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
									value={email}
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
									<select value={gender} onChange={this.handleGenderChange}>
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
	}
}

export default MyProfile;
