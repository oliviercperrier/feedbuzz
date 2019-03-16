import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Footer extends Component {
	render() {
		return (
			<div className="fdb-footer">
				<h1 className="height-teen-tag">18+</h1>
				<div className="container">
					<div className="columns">
						<div className="column">
							<h1 className="section-title">Feedbuzz</h1>
							<ul>
								<li>
									<a href="https://www.sqdc.ca">SQDC Website</a>
								</li>
								<li>
									<a href="https://www.sqdc.ca/en-CA/about-the-sqdc/frequently-asked-questions">
										SQDC FAQ
									</a>
								</li>
							</ul>
						</div>
						<div className="column">
							<h1 className="section-title">Menu</h1>
							<div className="footer-menu">
								<ul>
									<li>
										<Link to="/">Home</Link>
									</li>
									<li>
										<Link to="/products">SQDC Products</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="column">
							<h1 className="section-title">Contact</h1>
							<div className="footer-menu">
								<ul>
									<li>
										<Link to="/">Contact us</Link>
									</li>
									<li>
										<Link to="/products">About us</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Footer;
