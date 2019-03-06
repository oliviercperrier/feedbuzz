import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';

import ShowHidePW from '../../ShowHidePW';
import { Style } from '../../../Utils/notification';

class MySettings extends Component {
	constructor(props) {
		super(props);

		this.state = {
			password: '',
			newpassword: '',
			confirmpassword: '',
			loading: false
		};

		this.notificationSystem = React.createRef();

		this.handleSave = this.handleSave.bind(this);
		this.addNotification = this.addNotification.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	componentDidMount() {
		this._notificationSystem = this.refs.notificationSystem;
	}

	addNotification() {
		const notification = this.notificationSystem.current;
		notification.addNotification({
			title: 'Success',
			message: 'Your password was successfully updated!',
			level: 'success',
			dismissible: false
		});
	}


	handleInputChange(e) {
		this.setState({ [e.currentTarget.name]: e.currentTarget.value });
	}

	handleSave(e) {
		this.setState({ loading: true });

		//FAKE LOADING FOR TEST
		setTimeout(
			function() {
				this.setState({ loading: false });
				this.addNotification();
			}.bind(this),
			2000
		);
		/* SAVE DATA TO BACK END */
		// API.updateUser
	}

	render() {
		const { loading, password, newpassword, confirmpassword } = this.state;

		return (
			<div className="my-settings">
				<NotificationSystem ref={this.notificationSystem} style={Style} />
				<div className="section-title">My Settings</div>
				<div className="setting-pw-change">
					<div className="sub-section-title">Change my password</div>
					<div className="field is-horizontal">
						<div className="field-label is-normal">
							<label className="label">Current password</label>
						</div>
						<div className="field-body">
							<div className="field">
								<div className="control">
									<ShowHidePW
										pwStrength={false}
										name="password"
										value={password}
										onChange={this.handleInputChange}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="field is-horizontal">
						<div className="field-label is-normal">
							<label className="label">New password</label>
						</div>
						<div className="field-body">
							<div className="field">
								<div className="control">
									<ShowHidePW
										pwStrength={false}
										name="newpassword"
										value={newpassword}
										onChange={this.handleInputChange}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="field is-horizontal">
						<div className="field-label is-normal">
							<label className="label">Confirm password</label>
						</div>
						<div className="field-body">
							<div className="field">
								<div className="control">
									<ShowHidePW
										pwStrength={false}
										name="confirmpassword"
										value={confirmpassword}
										onChange={this.handleInputChange}
									/>
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
								Update my password
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default MySettings;
