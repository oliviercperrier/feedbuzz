import React, { Component } from 'react';

import Header from './Header';
import Footer from './Footer';

class MasterPage extends Component {
	render() {
		return (
			<div id="feedbuzz-master">
				<Header />
				<div id="feedbuzz-body">
					{this.props.children}
					<Footer />
				</div>
			</div>
		);
	}
}

export default MasterPage;
