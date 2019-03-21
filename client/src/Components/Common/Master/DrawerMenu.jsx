import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import Fade from 'react-reveal/Fade';
import CheeseburgerMenu from 'cheeseburger-menu';

import { AuthConsumer } from '../../../Contexts/authContext';

class DrawerMenu extends Component {
	onKeyDown = (e) => {
		if (e.keyCode === 27) {
			this.props.closeCallback(e);
		}
	};

	onLogoutClick = (logout) => {
		this.props.closeCallback();
		logout();
	};

	render() {
		const { menuOpen, closeCallback } = this.props;

		if (menuOpen) {
			document.addEventListener('keydown', this.onKeyDown, false);
		} else {
			document.removeEventListener('keydown', this.onKeyDown, false);
		}

		return (
			<AuthConsumer>
				{({ authenticated, logout }) => {
					return (
						<CheeseburgerMenu
							className="fdb-drawer-menu"
							innerClassName="drawer-menu-inner"
							outerClassName="drawer-menu-outer"
							overlayClassName="overlay"
							isOpen={menuOpen}
							transitionTime={0.5}
							width={500}
							closeCallback={closeCallback}
						>
							<Fade clear when={menuOpen}>
								<div className="drawer-menu-content v-and-h-centered">
									<MdClose className="full-pg-close big-btn" onClick={closeCallback} />
									<div className="menu-items">
										<ul>
											<li>
												<Link to="/" onClick={closeCallback}>
													Home
												</Link>
											</li>
											<li>
												<Link to="/products" onClick={closeCallback}>
													SQDC products
												</Link>
											</li>
											<li role="separator" className="divider" />
										</ul>
										{authenticated ? (
											<ul>
												<li>
													<Link to="/my-account" onClick={closeCallback}>
														My account
													</Link>
												</li>
												<li>
													<Link to="/" onClick={() => this.onLogoutClick(logout)}>
														Log out
													</Link>
												</li>
											</ul>
										) : (
											<ul>
												<li>
													<Link to={{ pathname: '/authenticate', state: { showSignupForm: true} }} onClick={closeCallback}>
														Sign up
													</Link>
												</li>
												<li>
													<Link to="/authenticate" onClick={closeCallback}>
														Log in
													</Link>
												</li>
											</ul>
										)}
									</div>
								</div>
							</Fade>
						</CheeseburgerMenu>
					);
				}}
			</AuthConsumer>
		);
	}
}

export default DrawerMenu;
