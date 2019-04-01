import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import Fade from 'react-reveal/Fade';
import { Link } from 'react-router-dom';

import { getUserRating } from '../../../Utils/api';

class MyReviews extends Component {
	constructor(props) {
		super(props);

		const { user } = this.props;
		this.state = {
			user_id: user.user_id,
			data: [],
			isLoading: true
		};
	}

	async componentDidMount() {
		const response = await getUserRating(this.state.user_id);
		console.log(response);
		this.setState({
			data: response,
			isLoading: false
		});
	}

	render() {
		const { isLoading, data } = this.state;

		const reviews = data.map((review) => {
			return (
				<Fade>
					<li key={review.id} className="my-reviews-listing-item">
						<Link to={'/product/' + review.product.id}>
							<div
								className="product-img"
								style={{ backgroundImage: 'url(' + review.product.image_url + ')' }}
							/>
						</Link>
						<h1 className="review-info-title">{review.product.name}</h1>
						<p className="review-info-comment">{review.comment}</p>
					</li>
				</Fade>
			);
		});

		return (
			<div className="my-reviews">
				<div className="section-title">My reviews</div>
				<div className="my-reviews-listing-content">
					{isLoading ? (
						<ReactLoading
							className="reviews-loader"
							type="bubbles"
							color="#20bd67"
							height={'90px'}
							width={'90px'}
						/>
					) : (
						<ul className="my-reviews-listing-content">{reviews}</ul>
					)}
				</div>
			</div>
		);
	}
}

export default MyReviews;
