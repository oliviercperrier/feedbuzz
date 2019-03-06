import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import queryString from 'query-string';

import { API } from '../../../Utils/api';

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
			changed: false,
			data: []
		};

		this.handleSearch = this.handleSearch.bind(this);
		this.searchChange = this.searchChange.bind(this);
	}

	async componentDidMount() {
		if (!this.state.search) {
			this.fetchAll()
		} else {
			this.fetch(this.state.search);
		}
	}

	handleSearch(e) {
		if (this.state.changed) {
			this.fetch(this.state.search);
		}
	}

	async fetchAll() {
		const response = await API.get('/api/products/all');
		this.setState({ data: response.data });
	}

	async fetch(search) {
		const response = await API.get('/api/products/find/' + search);
		this.setState({
			changed: false,
			data: response.data
		});
	}

	searchChange(e) {
		this.setState({
			search: e.currentTarget.value,
			changed: true
		});
	}

	render() {
		const { search, data } = this.state;
		const to = '/products?q=' + search;

		console.log(data); //SHOULD BE JSON

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
