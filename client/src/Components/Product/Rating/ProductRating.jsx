import React, { Component } from 'react';

import Step1 from './RatingSteps/Step1';
import Step2 from './RatingSteps/Step2';
import Step3 from './RatingSteps/Step3';

/**
 * Product rating Component
 * Display rating steps to review a specific product
 * 
 * Route: /product/review/:id
 */
class ProductRating extends Component {
	constructor(props) {
		super(props);

		this.steps = {
			0: Step1,
			1: Step2,
			2: Step3
		};

		this.state = {
			current_step: 0
		};
	}

	render() {
		const { current_step } = this.state;
		const CurrentStep = this.steps[current_step];
		return <CurrentStep />;
	}
}

export default ProductRating;
