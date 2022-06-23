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
import AdminContent from '../components/admin/AdminContent.js';

class Admin extends Component {
  componentDidMount() {
    //if (!this.props.auth.isAuthenticated) {
      //this.props.history.push('/');
    //}
  }
  

  render() {
    return (
      <div >
        <Menu ActivePage={1} />
        <div className="main-body">
          <AdminContent />
        </div>
      </div>
    );
  }
}

export default Admin;
