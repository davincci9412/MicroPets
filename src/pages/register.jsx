import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box } from '@blockstack/ui';

import LoginForm from '../components/login/LoginForm';
import { registerUser } from '../actions/authActions';

class Register extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    return (
      <Box className="login">
        <LoginForm
          SigninOrUp="Register"
          EventHandler={userData => this.props.registerUser(userData, this.props.history)}
          Errors={this.props.errors}
        />
      </Box>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(Register);
