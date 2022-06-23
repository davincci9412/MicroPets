import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LoginForm from '../components/login/LoginForm';
import { loginUser } from '../actions/authActions';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = { email:"", username:"", password:""};
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
	    //this.props.history.push('/exchange');
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
	    //this.props.history.push('/exchange');
    }
  }

  render() {
    return (
      <div className="login">
        <LoginForm
          SigninOrUp="Log in"
          EventHandler={this.props.loginUser}
          Errors={this.props.errors}
        />
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
