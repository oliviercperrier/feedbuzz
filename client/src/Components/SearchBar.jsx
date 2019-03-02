import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import Slide from 'react-reveal/Slide';
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Fade';

class SearchBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			escClose: false
		};
	}

	onKeyDown = (e) => {
		if (e.keyCode === 27) {
			this.props.closeCallback(e);
		}
	};

	render() {
		const { isOpen, closeCallback } = this.props;

		if (isOpen) {
			document.addEventListener('keydown', this.onKeyDown, false);
		} else {
			document.removeEventListener('keydown', this.onKeyDown, false);
		}

		return (
			<div>
				<Slide top duration={500} when={isOpen}>
					<div id="search" className={'v-and-h-centered' + (isOpen ? ' open' : '')}>
						<Zoom clear duration={500} when={isOpen}>
							<div className="container">
								<div className="fdb-search-bar">
									<div className="v-and-h-centered">
										<input type="text" placeholder="Search" className="search-input" />
									</div>
									<MdClose className="close big-btn" onClick={closeCallback} />
									<span className="search-tip">Hit enter to search or esc to close</span>
								</div>
							</div>
						</Zoom>
					</div>
				</Slide>
				<Fade clear duration={500} when={isOpen}>
					<div className={'overlay search-overlay' + (isOpen ? '' : ' hide')} onClick={closeCallback} />
				</Fade>
			</div>
		);
	}
}

SearchBar.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	closeCallback: PropTypes.func.isRequired
};

export default SearchBar;
