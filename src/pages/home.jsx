/**
 * Author : Vadim
 * Create Date : 8/16/2021
 * Email : snowfirst312@outlook.com
 * Skype : live:.cid.d66694e683af316e
 * Description : MicroPets project
 */

import React, { Component } from 'react';
//import { Flex } from '@blockstack/ui';

import Menu from '../components/common/Menu.js';
import HomeContent from '../components/home/HomeContent.js';

class Index extends Component {
  componentDidMount() {
    //if (!this.props.auth.isAuthenticated) {
      //this.props.history.push('/');
    //}
  }
  

  render() {
    return (
      <div>
        <Menu ActivePage={0} />
        <div className="main-body">
          <HomeContent />
        </div>
      </div>
    );
  }
}

export default Index;
