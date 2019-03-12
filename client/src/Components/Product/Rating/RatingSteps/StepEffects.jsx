import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

/**
 * Product rating step 2
 */
class StepEffects extends Component {
	id = 2;

	constructor(props) {
		super(props);

		this.effects = [
			'Sleepy',
			'Creative',
			'Energetic',
			'Euphoric',
			'Focused',
			'Happy',
			'Anxious',
			'Hungry',
			'Dry eye',
			'Dry mouth',
			'Headache',
			'Paranoid'
		];

		this.state = {
			additonalEffect: '',
			commonEffects: this.props.data.commonEffects ? this.props.data.commonEffects : [],
			addedEffects: this.props.data.addedEffects ? this.props.data.addedEffects : []
		};

		this.handleChange = this.handleChange.bind(this);
		this.addCommonEffect = this.addCommonEffect.bind(this);
		this.addAdditionalEffect = this.addAdditionalEffect.bind(this);
		this.removeAdditionalEffect = this.removeAdditionalEffect.bind(this);
		this.handleAdditonalEffectChange = this.handleAdditonalEffectChange.bind(this);
	}

	addCommonEffect(e) {
		var commonEffects = this.state.commonEffects;
		var toAddCommonEffect = e.currentTarget.getAttribute('data-name');
		var index = commonEffects.indexOf(toAddCommonEffect);

		if (index > -1) {
			commonEffects.splice(index, 1);
		} else {
			commonEffects.push(toAddCommonEffect);
		}

		this.setState({ commonEffects });
		this.handleChange();
	}

	addAdditionalEffect(e) {
		var toAddEffect = this.state.additonalEffect;
		var addedEffects = this.state.addedEffects;

		if (toAddEffect.trim() !== '') {
			if (this.state.commonEffects.indexOf(toAddEffect) === -1 && addedEffects.indexOf(toAddEffect) === -1) {
				addedEffects.push(toAddEffect);
				this.setState({ addedEffects: addedEffects, additonalEffect: '' }, function() {
					this.handleChange();
				});
			}
		}
	}

	removeAdditionalEffect(e) {
		var addedEffects = this.state.addedEffects;
		var index = addedEffects.indexOf(e.currentTarget.getAttribute('data-name'));
		if (index > -1) {
			addedEffects.splice(index, 1);
		}
		this.setState({ addedEffects }, function() {
			this.handleChange();
		});
	}

	handleAdditonalEffectChange(e) {
		this.setState({ additonalEffect: e.currentTarget.value });
	}

	handleChange() {
		this.props.onDataChange(this.id, {
			commonEffects: this.state.commonEffects,
			addedEffects: this.state.addedEffects
		});
	}

	render() {
		const { additonalEffect, addedEffects, commonEffects } = this.state;
		const commonEffectsHtml = this.effects.map((effect) => (
			<span
				key={effect}
				data-name={effect}
				onClick={this.addCommonEffect}
				className={
					'tag is-info is-large common-effect ' +
					(commonEffects.indexOf(effect) > -1 ? 'selected-effect' : '')
				}
			>
				{effect}
			</span>
		));

		const addedEffectsHtml = addedEffects.map((effect) => (
			<span key={effect} className="tag is-info is-large common-effect">
				{effect}
				<button data-name={effect} onClick={this.removeAdditionalEffect} className="delete" />
			</span>
		));

		return (
			<div className="step3-container">
				<div className="step-header">
					<h1 className="step-title">What effects did you feel?</h1>
				</div>
				<div className="common-effects">{commonEffectsHtml}</div>
				<div className="add-more-effects">
					<div className="pl-input-container v-and-h-centered">
						<input
							type="text"
							className="pl-input"
							value={additonalEffect}
							onChange={this.handleAdditonalEffectChange}
							placeholder="Add other effect"
						/>
						<a className="search-btn v-and-h-centered" onClick={this.addAdditionalEffect}>
							<div className="b-input-icon-wrapper v-and-h-centered">
								<FaPlus />
							</div>
						</a>
					</div>
					<div className="additional-effects-container">{addedEffectsHtml}</div>
				</div>
			</div>
		);
	}
}

StepEffects.propTypes = {
	onDataChange: PropTypes.func.isRequired
};

export default StepEffects;
