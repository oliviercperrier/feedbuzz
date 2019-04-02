import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
import Avatar from 'react-avatar';
import Fade from 'react-reveal/Fade';

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
			reviews: [],
			show_spec: false
		};
	}

	async componentDidMount() {
		var product = null;
		const state = this.props.location.state;

		if (state) {
			product = this.props.location.state.product;
		} else {
			const response = await API.get('/api/products/' + this.state.product_id);
			product = response.data;
		}

		const reviews = await API.get('/api/rating/product/' + this.state.product_id);

		this.setState({
			product: product,
			reviews: reviews.data
		});
	}

	handleSectionChange(e) {}

	//TODO : Séparer dans des components avait pas le temps pour l'oral
	renderSpecSection() {
		const { product } = this.state.product;
		console.log(product);
		return <div />;
	}

	renderReviewsSection() {
		const { reviews } = this.state;
		console.log(reviews);

		const product_reviews = reviews.map((review) => {
			return (
				<Fade>
					<li key={review.id} className="is-clearfix product-reviews-listing-item">
						<div className="is-clearfix">
							<Avatar className="user-image" round={true} size={'50px'} src="/img/favicon.svg" />
							<div className="user-review-content">
								<h1 className="user-name">{review.user.name}</h1>
								<div className="user-rating-starts">
									<StarRatings
										rating={review.rating}
										starRatedColor="gold"
										starDimension="15px"
										starSpacing=""
									/>
								</div>
								<p className="review-info-comment">{review.comment}</p>
							</div>
						</div>
					</li>
				</Fade>
			);
		});

		return <ul className="product-reviews-listing">{product_reviews}</ul>;
	}

	render() {
		const { product, show_spec } = this.state;

		if (!product) {
			return <div />;
		}

		return (
			<div className="product-details-container">
				<div className="product-details-banner-container">
					<div className="product-detail-img">
						<img src={product.image_url} />
					</div>
					<div className="product-detail-header-info">
						<h1 className="product-name">{product.name}</h1>
						<div className="product-rating-starts">
							<StarRatings
								rating={product.avg[0] ? product.avg[0] : 4}
								starRatedColor="gold"
								starDimension="25px"
								starSpacing=""
							/>
						</div>
					</div>
				</div>
				<div class="tabs is-centered">
					<ul>
						<li>
							<a className="tab-item">Specification</a>
						</li>
						<li className="is-active">
							<a className="tab-item">Reviews</a>
						</li>
					</ul>
				</div>
				<div className="product-details-content container">
					<div className="product-detail-section-content">
						{show_spec ? this.renderSpecSection() : this.renderReviewsSection()}
					</div>
				</div>
			</div>
		);
	}
}

export default ProductDetails;
