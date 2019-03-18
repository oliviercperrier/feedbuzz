import React, { Component } from 'react';

import { API } from '../../Utils/api';

/**
 * Product details Component
 * Show product details and option to start a review on it
 * 
 * Route: /products/:name
 */
class ProductDetails extends Component {
	constructor(props) {
		super(props);

		const product_id = this.props.match.params.id;

		this.state = {
			product_id: product_id,
			product: null,
			reviews: []
		};

		this.fetchCurrentProduct = this.fetchCurrentProduct.bind(this);
	}

	async componentDidMount() {
		this.fetchCurrentProduct();
	}

	async fetchCurrentProduct() {
		var product = null;
		const state = this.props.location.state;

		if (state) {
			product = this.props.location.state.product;
		} else {
			const response = await API.get('/api/products/' + this.state.product_id);
			product = response.data;
		}

		//TODO Fetch reviews

		this.setState({ product: product });
	}

	render() {
		return <div></div>;
	}
}

export default ProductDetails;
