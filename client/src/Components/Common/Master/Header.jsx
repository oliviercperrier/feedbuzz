import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MdMenu } from 'react-icons/md';
import { IoIosSearch } from 'react-icons/io';

import SearchBar from '../../SearchBar';
import DrawerMenu from './DrawerMenu';

class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSticky: false,
			isDown: false,
			menuOpen: false,
			searchOpen: false
		};
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll.bind(this), false);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll.bind(this));
	}

	handleScroll() {
		if (window.pageYOffset === 0) {
			this.setState({
				isSticky: false,
				isDown: false
			});
		} else if (window.pageYOffset >= 250) {
			if (!this.state.isSticky) {
				this.setState({
					isSticky: true
				});
			} else {
				this.setState({
					isDown: true
				});
			}
		}
	}

	toggleSearch = (e) => {
		e.preventDefault();
		console.log("close");
		this.setState({ searchOpen: !this.state.searchOpen });
	};

	toggleMenu = (e) => {
		this.setState({ menuOpen: !this.state.menuOpen });
	};

	render() {
		const { isSticky, isDown, menuOpen, searchOpen } = this.state;

		return (
			<div>
				<header className={'fdb-header' + (isSticky ? ' sticky' : '') + (isDown ? ' down' : '')}>
					<nav className="container fdb-navbar" role="navigation" aria-label="main navigation">
						<div className="fdb-navbar-items-start">
							<div className="v-and-h-centered fdb-navbar-item">
								<button className="v-and-h-centered" href="#" onClick={this.toggleMenu}>
									<MdMenu className="fdb-navbar-icon" />
								</button>
							</div>
						</div>
						<div className="fdb-navbar-brand">
							<Link className="logo" to="/">
								<img src="img/feedbuzz_logo_small_cropped.png" alt="FeedBuzz" />
							</Link>
						</div>
						<div className="fdb-navbar-items-end">
							<div className="v-and-h-centered fdb-navbar-item">
								<Link className="v-and-h-centered" to="" onClick={this.toggleSearch}>
									<IoIosSearch className="fdb-navbar-icon" />
								</Link>
							</div>
						</div>
					</nav>
					<DrawerMenu menuOpen={menuOpen} closeCallback={this.toggleMenu} />
				</header>
				<SearchBar isOpen={searchOpen} closeCallback={this.toggleSearch} />
				<div className={isSticky ? 'header-spacer' : ''}></div>
			</div>
		);
	}
}

export default Header;
