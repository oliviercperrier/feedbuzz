import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import Zoom from 'react-reveal/Zoom';

import HighestRatedProduct from '../Product/HighestRatedProduct';

/**
 * Home page component
 * 
 * Route: /
 */
class HomePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			search_term: ""
		};

		this.handleSearchChange = this.handleSearchChange.bind(this);
	}

	handleSearchChange(e) {
		this.setState({search_term: e.currentTarget.value});
	}
	
	render() {
		const to = "/products?q=" + this.state.search_term;

		return (
			<div className="home-page-content">
				<div className="hero banner v-and-h-centered">
					<h1 className="home-banner-title">Find SQDC's products you loved and rate them!</h1>
					<Zoom clear>
						<div className="home-banner-input-container v-and-h-centered">
							<input type="text" className="home-banner-input" onChange={this.handleSearchChange} placeholder="What are you looking for?" />
							<Link className="search-btn v-and-h-centered" to={to}>
								<div className="b-input-icon-wrapper v-and-h-centered">
									<IoIosSearch className="fdb-navbar-icon" />
								</div>
							</Link>
						</div>
					</Zoom>
					<h1 className="home-banner-title spacer">spacer</h1>
				</div>
				<div className="highest-rated-product-container container">
					<HighestRatedProduct />
				</div>
				<div className="all-products">
					<Link to="/products" className="button bg-color-trans">View all products</Link>
				</div>
			</div>
		);
	}
}

export default HomePage;
