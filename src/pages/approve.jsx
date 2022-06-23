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
import ApproveContent from '../components/shop/ApproveContent.js';

class Approve extends Component {
  constructor(props) {
    super(props);
    const { match: { params } } = this.props;
    this.state = {"productId": params.productId};
  }

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
          <ApproveContent  productId={this.state.productId}/>
        </div>
      </div>
    );
  }
}

export default Approve;
