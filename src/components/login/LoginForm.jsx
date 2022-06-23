/**
 * Author : Vadim
 * Create Date : 8/16/2021
 * Email : snowfirst312@outlook.com
 * Skype : live:.cid.d66694e683af316e
 * Description : MicroPets project
 */

import React, { useState } from 'react';
import { Box, Flex, Text, FormControl, FormLabel, Input } from '@blockstack/ui';
import isEmpty from 'is-empty';
import GoogleLogin from 'react-google-login';
import {useHistory} from "react-router-dom";
import setAuthToken from '../../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import store from '../../store';
import { setCurrentUser } from '../../actions/authActions';

import hlogo from '../../assets/images/logo.png';

const LoginForm = ({ SigninOrUp, EventHandler, Errors }) => {
  const history = useHistory();
  const responseGoogle = response => {
    if (response.tokenId) {
      //localStorage.setItem('token', response.tokenId);
      localStorage.setItem('jwtToken', response.tokenId);
      // Set token to Auth header
      setAuthToken(response.tokenId);
      
      // Decode token to get user data
      const decoded = jwt_decode(response.tokenId);
      if (decoded.email_verified) {
        store.dispatch(setCurrentUser(decoded));
        localStorage.setItem('email', decoded.email);
        history.push('/dashboard');
      } else {
        history.push('/login');
      }
    } else {
      localStorage.setItem('token', false);
    }
  };

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = event => {
    event.preventDefault();
    const userData = {
      email: username,
      password: password,
    };
    EventHandler(userData);
  };

  const onRegister = event => {
    event.preventDefault();
    const userData = {
      email: username,
      password: password,
    };
    EventHandler(userData);
  };

  //useEffect(() => {}, []);

  return (
    <Box className="border-box">
      <Box
        p={['8% 4% 6% 4%']}
        backgroundColor="#0d192c"
        border="1px solid #aaa"
        borderRadius={['40px 40px 0 0']}
        textAlign="center"
      >
        <Box as="img" src={hlogo} maxWidth="125px" />
        <h2 className="logo mt-2">Minr<span className="thin">($minr)</span></h2>
      </Box>
      <Box
        px={['8%']}
        textAlign="center"
        border="1px solid #aaa"
      >
        {/* Login Header */}
        <Box mt={[4, 4]} pb={[2,2]}>
          <h2 className="mb-3">{SigninOrUp}</h2>
          <Text display="block" mb={[3, 3]}>Please check that you are visiting the correct URL</Text> 
          <Text display="block"><span className="text-success">https://</span>MicroPets.minr.tech:3000/login</Text> 
        </Box>
        {/* Login Form */}
        <FormControl textAlign="left" mb="4%">
          <FormLabel mt="10px" mb="0">Email:</FormLabel>
          <Input
            fontSize={['14px', '16px']}
            borderColor="#ced4da"
            py="20px"
            borderRadius="0.25rem"
            color="white"
            onChange={e => setUserName(e.target.value)}
            name="email"
            backgroundColor="transparent"
          />
          {isEmpty(Errors.email) ? null : (
            <Box
              mt="10px"
              backgroundColor="#f8d7da"
              color="#721c24"
              border="1px solid #f5c6cb"
              borderRadius="0.25rem"
              p="10px"
            >
              {Errors.email}
            </Box>
          )}
          <FormLabel  mt="10px" mb="0">Password:</FormLabel>
          <Input
            fontSize={['14px', '16px']}
            borderColor="#ced4da"
            borderRadius="0.25rem"
            py="20px"
            onChange={e => setPassword(e.target.value)}
            color="white"
            type="password"
            name="password"
            backgroundColor="transparent"
            autoComplete="off"
          />
          {isEmpty(Errors.password) ? null : (
            <Box
              mt="10px"
              backgroundColor="#f8d7da"
              color="#721c24"
              border="1px solid #f5c6cb"
              borderRadius="0.25rem"
              p="10px"
            >
              {Errors.password}
            </Box>
          )}
          <Box
            fontSize={['14px', '16px']}
            fontWeight="bold"
            as="input"
            width="100%"
            type="submit"
            value={SigninOrUp}
            backgroundColor="#2dce89"
            border="none"
            outline="none"
            cursor="pointer"
            mt="7%"
            py="2%"
            color="white"
            borderRadius="2rem"
            transition="all ease .2s"
            onClick={SigninOrUp === 'Log in' ? onLogin : onRegister}
          />
          <Flex flexWrap="wrap" justifyContent="space-between" alignItems="center" py="7%">
            {SigninOrUp === 'Log in' ? (
              <Box
                as="a"
                href="/register"
                color="#007bff"
                textDecoration="underline"
                fontWeight="100"
                px="10px"
                pt="10px"
                transition="color ease .2s"
                _hover={{ color: '#0056b3' }}
              >
                <strong>Register</strong>
              </Box>
            ) : (
              <Box
                as="a"
                href="/login"
                color="#007bff"
                textDecoration="underline"
                fontWeight="100"
                px="10px"
                pt="10px"
                transition="color ease .2s"
                _hover={{ color: '#0056b3' }}
              >
                <strong>Log in</strong>
              </Box>
            ) }
            <GoogleLogin
              clientId="26682806119-cuin6rjst4fr3m37p96l71m2knkn5s0v.apps.googleusercontent.com"
              buttonText="Register or Sign in with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
            />
          </Flex>          
        </FormControl>
      </Box>
    </Box>
  );
};

export default LoginForm;
