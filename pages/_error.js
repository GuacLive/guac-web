import React from 'react'

import initialize from '../utils/initialize';
class Error extends React.Component {
  static getInitialProps({store, isServer, pathname, query, req, res, err}) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    initialize({store, isServer, pathname, query, req});
    return { statusCode }
  }

  render() {
    return (
      <p>
        {this.props.statusCode
          ? `An error ${this.props.statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    )
  }
}

export default Error
