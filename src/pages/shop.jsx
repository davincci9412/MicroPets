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
import ShopContent from '../components/shop/ShopContent.js';

class Shop extends Component {
  componentDidMount() {
    //if (!this.props.auth.isAuthenticated) {
      //this.props.history.push('/');
    //}
  }
  

  render() {
    return (
      <div >
        <Menu ActivePage={2} />
        <div className="main-body">
          <ShopContent  />
        </div>
      </div>
    );
  }
}

export default Shop;
