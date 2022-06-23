/**
 * Author : Vadim
 * Create Date : 8/16/2021
 * Email : snowfirst312@outlook.com
 * Skype : live:.cid.d66694e683af316e
 * Description : MicroPets project
 */

import {React} from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

const Menu = ({ ActivePage }) => {
    
  return (
    <header className="">
      <Navbar collapseOnSelect expand="lg" bg="transparent" className="header-link navbar-dark">
        <Navbar.Brand href="/home" className={ActivePage === 0 ? 'logo active' : 'logo'}>
          <img src="/img/logo.png" alt=""></img>
          <p>MICROPETS</p>
        </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav.Link href="/admin" id="admin" className={ActivePage === 1 ? 'no-show active' : 'no-show'}>Add NFTs</Nav.Link>
            <Nav.Link href="/shop" className={ActivePage === 2 ? 'active' : ''}>Shop</Nav.Link>
            <Nav.Link href="/inventory" className={ActivePage === 3 ? 'active' : ''}>Inventory</Nav.Link>
            <Nav.Link href="/marketplace" className={ActivePage === 4? 'active' : ''}>Marketplace</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Menu;

	
