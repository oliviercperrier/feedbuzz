import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import Fade from 'react-reveal/Fade';

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
		var product_img_url = 'img/review-place-holder.png';

		const reviews = data.map((review) => {
			return (
				<Fade>
					<div key={review.id} className="my-reviews-listing-item">
						<div className="product-img" style={{ backgroundImage: 'url(' + product_img_url + ')' }} />
						<div className="review-info">
							<h1>Product name</h1>
						</div>
					</div>
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
						reviews
					)}
				</div>
			</div>
		);
	}
}

export default MyReviews;
