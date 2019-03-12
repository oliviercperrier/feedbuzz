import React, { Component } from 'react';
import Steps, { Step } from 'rc-steps';
import { MdDone } from 'react-icons/md';

import StepHigh from './RatingSteps/StepHigh';
import StepRedEye from './RatingSteps/StepRedEye';
import StepEffects from './RatingSteps/StepEffects';
import StepFlavors from './RatingSteps/StepFlavors';
import StepGeneral from './RatingSteps/StepGeneral';

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
			0: StepHigh,
			1: StepRedEye,
			2: StepEffects,
			3: StepFlavors,
			4: StepGeneral
		};

		this.state = {
			currentStep: 0,
			isLoading: false,
			data: {
				0: {},
				1: {},
				2: {},
				3: {},
				4: {}
			}
		};

		this.changeStep = this.changeStep.bind(this);
		this.onStepDataChange = this.onStepDataChange.bind(this);
	}

	changeStep(e) {
		var toStep = this.state.currentStep + parseInt(e.currentTarget.getAttribute('data-change'));

		if (this.state.isLoading) {
			return;
		}

		if (toStep >= 0 && toStep < 5) {
			this.setState({ currentStep: toStep });
			return;
		}

		if (toStep === 5) {
			this.setState({ isLoading: true });
			//Save
		}
	}

	onStepDataChange(id, data) {
		var stepsData = this.state.data;
		stepsData[id] = data;
		this.setState({ data: stepsData });
	}

	render() {
		const { currentStep, isLoading } = this.state;
		const CurrentStep = this.steps[currentStep];

		return (
			<div className="product-rating-container">
				<div className="steps-progress">
					<Steps icons={{ finish: <MdDone /> }} current={currentStep}>
						<Step />
						<Step />
						<Step />
						<Step />
						<Step />
					</Steps>
				</div>
				<div className="product-rating-step-container">
					<CurrentStep data={this.state.data[currentStep]} onDataChange={this.onStepDataChange} />
				</div>
				<div className="rating-steps-nav">
					<button className="button bg-color-trans previous" data-change={-1} onClick={this.changeStep}>
						Previous
					</button>
					<button
						className={'button bg-color-trans next ' + (isLoading ? 'is-loading' : '')}
						data-change={1}
						onClick={this.changeStep}
					>
						{currentStep === 4 ? 'Finish' : 'Next'}
					</button>
				</div>
			</div>
		);
	}
}

export default ProductRating;
