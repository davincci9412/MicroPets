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
import MarketplaceContent from '../components/marketplace/MarketplaceContent.js';

class Marketplace extends Component {
  componentDidMount() {
    
  }

  render() {
    return (
      <div>
        <Menu ActivePage={4} />
        <div className="main-body">          
          <MarketplaceContent />  
        </div>
      </div>
    );
  }
}
export default Marketplace;
