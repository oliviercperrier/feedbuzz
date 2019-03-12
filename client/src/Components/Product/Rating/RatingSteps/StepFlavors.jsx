import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

/**
 * Product rating step 2
 */
class StepFlavors extends Component {
	id = 3;

	constructor(props) {
		super(props);

		this.flavors = [
			'Apple',
			'Blueberry',
			'Tangerine',
			'Mint',
			'Lemon',
			'Tea',
			'Cheese',
			'Berry',
			'Coffee',
			'Orange',
			'Vanilla',
			'Pine',
			'Flowery',
			'Grape'
		];

		this.state = {
			additonalFlavor: '',
			commonFlavors: this.props.data.commonFlavors ? this.props.data.commonFlavors : [],
			addedFlavors: this.props.data.addedFlavors ? this.props.data.addedFlavors : []
		};

		this.handleChange = this.handleChange.bind(this);
		this.addCommonFlavor = this.addCommonFlavor.bind(this);
		this.addAdditionalFlavor = this.addAdditionalFlavor.bind(this);
		this.removeAdditionalFlavor = this.removeAdditionalFlavor.bind(this);
		this.handleAdditonalFlavorChange = this.handleAdditonalFlavorChange.bind(this);
	}

	addCommonFlavor(e) {
		var commonFlavors = this.state.commonFlavors;
		var toAddCommonFlavor = e.currentTarget.getAttribute('data-name');
		var index = commonFlavors.indexOf(toAddCommonFlavor);

		if (index > -1) {
			commonFlavors.splice(index, 1);
		} else {
			commonFlavors.push(toAddCommonFlavor);
		}

		this.setState({ commonFlavors }, function() {
			this.handleChange();
		});
	}

	addAdditionalFlavor(e) {
		var toAddFlavor = this.state.additonalFlavor;
		var addedFlavors = this.state.addedFlavors;

		if (toAddFlavor.trim() !== '') {
			if (this.state.commonFlavors.indexOf(toAddFlavor) === -1 && addedFlavors.indexOf(toAddFlavor) === -1) {
				addedFlavors.push(toAddFlavor);
				this.setState({ addedFlavors: addedFlavors, additonalFlavor: '' }, function() {
					this.handleChange();
				});
			}
		}
	}

	removeAdditionalFlavor(e) {
		var addedFlavors = this.state.addedFlavors;
		var index = addedFlavors.indexOf(e.currentTarget.getAttribute('data-name'));
		if (index > -1) {
			addedFlavors.splice(index, 1);
		}
		this.setState({ addedFlavors }, function() {
			this.handleChange();
		});
	}

	handleAdditonalFlavorChange(e) {
		this.setState({ additonalFlavor: e.currentTarget.value });
	}

	handleChange() {
		this.props.onDataChange(this.id, {
			commonFlavors: this.state.commonFlavors,
			addedFlavors: this.state.addedFlavors
		});
	}

	render() {
		const { additonalFlavor, addedFlavors, commonFlavors } = this.state;
		const commonFlavorsHtml = this.flavors.map((flavor) => (
			<span
				key={flavor}
				data-name={flavor}
				onClick={this.addCommonFlavor}
				className={
					'tag is-info is-large common-flavor ' +
					(commonFlavors.indexOf(flavor) > -1 ? 'selected-flavor' : '')
				}
			>
				{flavor}
			</span>
		));

		const addedFlavorsHtml = addedFlavors.map((flavor) => (
			<span key={flavor} className="tag is-info is-large common-flavor">
				{flavor}
				<button data-name={flavor} onClick={this.removeAdditionalFlavor} className="delete" />
			</span>
		));

		return (
			<div className="step4-container">
				<div className="step-header">
					<h1 className="step-title">What flavors did you taste?</h1>
				</div>
				<div className="common-flavors">{commonFlavorsHtml}</div>
				<div className="add-more-flavors">
					<div className="pl-input-container v-and-h-centered">
						<input
							type="text"
							className="pl-input"
							value={additonalFlavor}
							onChange={this.handleAdditonalFlavorChange}
							placeholder="Add other flavor"
						/>
						<a className="search-btn v-and-h-centered" onClick={this.addAdditionalFlavor}>
							<div className="b-input-icon-wrapper v-and-h-centered">
								<FaPlus />
							</div>
						</a>
					</div>
					<div className="additional-flavors-container">{addedFlavorsHtml}</div>
				</div>
			</div>
		);
	}
}

StepFlavors.propTypes = {
	onDataChange: PropTypes.func.isRequired
};

export default StepFlavors;
