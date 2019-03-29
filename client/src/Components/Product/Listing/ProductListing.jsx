import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import queryString from 'query-string';
import StarRatings from 'react-star-ratings';
import ReactLoading from 'react-loading';
import Fade from 'react-reveal/Fade';

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
			last_search: '',
			current_page: 1,
			search: search.q === undefined ? '' : search.q,
			data: [],
			total: 0,
			nb_pages: 0,
			isLoading: true
		};

		this.handleSearch = this.handleSearch.bind(this);
		this.searchChange = this.searchChange.bind(this);
		this.renderPaginator = this.renderPaginator.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);
	}

	async componentDidMount() {
		if (!this.state.search) {
			this.fetchAll(0);
		} else {
			this.fetch(this.state.search, 0);
		}
	}

	handleSearch(e) {
		const { search, last_search } = this.state;
		if (search.trim() !== last_search.trim()) {
			var search_term = this.state.search.trim();
			if (search_term) {
				this.fetch(this.state.search.trim(), 0);
			} else {
				this.fetchAll(0);
			}
		}
	}

	async fetchAll(page) {
		const response = await API.get('/api/products/all?pageOffset=' + page);
		this.setState({
			last_search: '',
			current_page: page,
			total: response.data.total,
			data: response.data.products,
			nb_pages: Math.ceil(response.data.total / 20),
			isLoading: false
		});
	}

	async fetch(search, page) {
		const response = await API.get('/api/products/find/' + search + '?pageOffset=' + page);
		this.setState({
			last_search: this.state.search,
			current_page: page,
			total: response.data.total,
			nb_pages: Math.ceil(response.data.total / 20),
			data: response.data,
			isLoading: false
		});
	}

	searchChange(e) {
		this.setState({
			search: e.currentTarget.value
		});
	}

	handlePageChange(e) {
		const page = parseInt(e.currentTarget.getAttribute('data-page'));
		if (this.state.last_search) {
			this.fetch(this.state.last_search, page);
		} else {
			this.fetchAll(page);
		}
	}

	renderPaginator(total, current_page) {
		var nb_pages = Math.ceil(total / 20);
		var pages = [];

		for (var i = 0; i < nb_pages; i++) {
			pages.push(
				<li key={i}>
					<a
						class={'pagination-link' + (current_page == i ? ' is-current' : '')}
						onClick={this.handlePageChange}
						data-page={i}
						aria-label={'Go to page ' + i}
					>
						{i + 1}
					</a>
				</li>
			);
		}

		return pages;
	}

	render() {
		const { search, data, total, current_page, nb_pages, isLoading } = this.state;
		const to = '/products?q=' + search;

		console.log(data);

		const products = data.map((product) => {
			return (
				<Fade>
					<div key={product.id} className="product-listing-item">
						<div className="product-image-container">
							<Link to={{ pathname: '/product/' + product.id, state: { product: product } }}>
								<img src={product.image_url} alt={product.name} />
							</Link>
						</div>
						<div className="item-content">
							<div className="product-info">
								<div>
									<h1 className="product-name">{product.name}</h1>
									<span className="product-price">${product.price[0].price}</span>
								</div>
								<div className="rating-info">
									<StarRatings
										rating={product.avg[0] ? product.avg[0] : 4}
										starRatedColor="gold"
										starDimension="15px"
										starSpacing=""
									/>
								</div>
							</div>
							<Link
								className="button"
								to={{ pathname: '/product/review/' + product.id, state: { product: product } }}
							>
								Review
							</Link>
						</div>
					</div>
				</Fade>
			);
		});

		const previous_page = current_page - 1;
		const next_page = current_page + 1;

		var prev_ops = {};
		var next_ops = {};
		if (previous_page < 0) {
			prev_ops['disabled'] = 'disabled';
		}

		if (next_page > nb_pages - 1) {
			next_ops['disabled'] = 'disabled';
		}

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
				<div className="product-listing-content">
					{isLoading ? (
						<ReactLoading
							className="product-loader"
							type="bubbles"
							color="#20bd67 "
							height={'90px'}
							width={'90px'}
						/>
					) : data.length == 0 ? (
						<h1 className="not-products">No products found!</h1>
					) : (
						products
					)}
				</div>
				<nav class="pagination is-centered" role="navigation" aria-label="pagination">
					<a
						class="pagination-previous"
						{...prev_ops}
						onClick={this.handlePageChange}
						data-page={previous_page}
					>
						Previous
					</a>
					<a class="pagination-next" {...next_ops} onClick={this.handlePageChange} data-page={next_page}>
						Next page
					</a>
					<ul class="pagination-list">{this.renderPaginator(total, current_page)}</ul>
				</nav>
			</div>
		);
	}
}

export default ProductListing;
