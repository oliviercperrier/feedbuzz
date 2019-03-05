import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import queryString from 'query-string';

/**
 * Product listing Component
 * Show the listing of sqdc products
 * 
 * Route: /products?q=xxx
 */
class ProductListing extends Component {
	constructor(props) {
		super(props);

		const search = queryString.parse(this.props.location.search);

		this.state = {
			search: search.q === undefined ? '' : search.q,
			changed: false
		};

		this.handleSearch = this.handleSearch.bind(this);
		this.searchChange = this.searchChange.bind(this);
	}

	componentDidMount() {
		/* TODO FETCH DATA */
	}

	handleSearch(e) {
		if (this.state.changed) {
			/* TODO FETCH DATA */
			console.log('Fetching data');
			this.setState({
				changed: false
			});
		}
	}

	searchChange(e) {
		this.setState({
			search: e.currentTarget.value,
			changed: true
		});
	}

	render() {
		const { search } = this.state;
		const to = '/products?q=' + search;

		return (
			<div className="product-listing-container container">
				<div className="pl-input-container v-and-h-centered">
					<input
						type="text"
						className="pl-input"
						placeholder="What are you looking for?"
						onChange={this.searchChange}
						value={search}
					/>
					<Link className="search-btn v-and-h-centered" to={to} onClick={this.handleSearch}>
						<div className="b-input-icon-wrapper v-and-h-centered">
							<IoIosSearch className="fdb-navbar-icon" />
						</div>
					</Link>
				</div>
			</div>
		);
	}
}

export default ProductListing;
