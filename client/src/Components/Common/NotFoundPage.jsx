import React, { Component } from "react";

class NotFoundPage extends Component {
  render() {
    return (
        <h1>Page not found for : {this.props.location.pathname}</h1>
    );
  }
}

export default NotFoundPage;
