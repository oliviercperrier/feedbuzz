import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

class HighestRatedProduct extends Component {
	constructor(props) {
		super(props);

		this.state = {
			product: {
				img: 'img/test-product.png',
				name: 'Blue Dream',
				rating: 4.78, // /5
				nb_reviews: 297,
				effects: [
					{ name: 'Creative', value: 50 },
					{ name: 'Relaxed', value: 48 },
					{ name: 'Energic', value: 26 },
					{ name: 'Focused', value: 15 }
				],
				description:
					'Blue Dream, a sativa-dominant hybrid originating in California, has achieved legendary status among West Coast strains.',
				flavors: [ 'Blueberry', 'Berry', 'Sweet' ],
				uri: 'blue-dream'
			}
		};
	}

	componentDidMount() {
		//fetch highest rated product
	}

	render() {
		const { product } = this.state;

		const flavors = product.flavors.map((flavor) => <li key={flavor}>{flavor}</li>);

		const effects = product.effects.map((effect) => (
			<li key={effect.name}>
				<div className="v-and-h-centered">
					<h1 className="effect-title">{effect.name}</h1>
					<progress className="progress" value={effect.value} max="100" />
				</div>
			</li>
		));

		return (
			<div className="highest-rated-product">
				<div className="has-text-centered">
					<h1 className="container-title">Highest rated products!</h1>
				</div>
				<div className="columns">
					<div className="column product-image is-one-quarter">
						<Link to={'#'}>
							<img className="image" alt="product" src={product.img} />
						</Link>
					</div>
					<div className="column">
						<div className="columns">
							<div className="column v-and-h-centered product-header">
								<Link to={'#'}>
									<h1 className="product-title">{product.name}</h1>
								</Link>
								<div className="product-rating">
									<StarRatings
										rating={2.403}
										starRatedColor="gold"
										starDimension="25px"
										starSpacing=""
									/>
								</div>
								<h1 className="product-reviews">{product.nb_reviews} reviews</h1>
							</div>
						</div>
						<div className="columns">
							<div className="column is-one-fifth">
								<h1 className="product-flavor-title section-title">Flavors</h1>
								<ul className="product-flavors">{flavors}</ul>
							</div>
							<div className="column">
								<h1 className="product-effect-title section-title">Common effects</h1>
								<ul className="product-effects">{effects}</ul>
							</div>
							<div className="column">
								<h1 className="product-effect-title section-title">Description</h1>
								<p>{product.description}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default HighestRatedProduct;
