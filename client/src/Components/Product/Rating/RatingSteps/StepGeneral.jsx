import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';

/**
 * Product rating step 5
 */
class StepGeneral extends Component {
	id = 4;

	constructor(props) {
		super(props);

		this.state = {
			rating: this.props.data.rating ? this.props.data.rating : 0,
			comment: this.props.data.comment ? this.props.data.comment : ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.onRatingChange = this.onRatingChange.bind(this);
		this.onCommentChange = this.onCommentChange.bind(this);
	}

	onRatingChange(newRating, name) {
		console.log(newRating);
		this.setState({ rating: newRating }, function() {
			this.handleChange();
		});
	}

	onCommentChange(e) {
		this.setState({ comment: e.currentTarget.value }, function() {
			this.handleChange();
		});
	}

	handleChange() {
		this.props.onDataChange(this.id, {
			rating: this.state.rating,
			comment: this.state.comment
		});
	}

	render() {
		const { comment, rating } = this.state;
		return (
			<div className="step5-container">
				<div className="step-header">
					<h1 className="step-title">Tell us your experience?</h1>
				</div>
				<div className="general-comments">
					<div className="general-rating">
						<StarRatings
							rating={rating}
							starRatedColor="gold"
							starHoverColor="gold"
							starDimension="40px"
							changeRating={this.onRatingChange}
							numberOfStars={5}
							name="rating"
						/>
					</div>
					<textarea
						className="textarea"
						onChange={this.onCommentChange}
						value={comment}
						placeholder="Write a comment..."
					/>
				</div>
			</div>
		);
	}
}

StepGeneral.propTypes = {
	onDataChange: PropTypes.func.isRequired
};

export default StepGeneral;
