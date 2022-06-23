/**
 * Author : Vadim
 * Create Date : 8/16/2021
 * Email : snowfirst312@outlook.com
 * Skype : live:.cid.d66694e683af316e
 * Description : MicroPets project
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';
// import jwt_decode from 'jwt-decode';
// import { setCurrentUser, logoutUser } from './actions/authActions';
// import setAuthToken from './utils/setAuthToken';
import Home from './pages/home';
import Admin from './pages/admin';
import Shop from './pages/shop';
import Approve from './pages/approve';
import Inventory from './pages/inventory';
import Marketplace from './pages/marketplace';
import jsonData from './components/data.json';


class App extends Component {
  constructor() {
    
    super();
    const loadData = JSON.parse(JSON.stringify(jsonData));

    // new Promise((resolve, reject) => {
    //   if (typeof window.ethereum !== 'undefined') {
    //     window.ethereum.enable()
    //       .then(() => {
    //         resolve(
    //           new Web3(window.ethereum)
    //         );
    //       })
    //       .catch(e => {
    //         reject(e);
    //       });
    //     return;
    //   }
    //   if (typeof window.web3 !== 'undefined') {
    //     return resolve(
    //       new Web3(window.web3.currentProvider)
    //     );
    //   }
    //   resolve(new Web3('http://127.0.0.1:8545'));
    // });
    if (window.ethereum !== undefined) {
      window.ethereum.on('accountsChanged', (accounts)=>{
        if (accounts.length > 0) {
          let adminLogin=false;
          const temps =loadData[0].address.split(",");
          temps.map((temp, i)=>{
            if (accounts[0].toLowerCase() === temp.toLowerCase()) {
              document.getElementById("admin").classList.remove("no-show");
              adminLogin = true;
            };
            return i;
          }) 
          if (!adminLogin){
            if (!document.getElementById("admin").classList.contains("no-show")){
              document.getElementById("admin").className += " no-show";
            }
          }        
        } else {
          if (!document.getElementById("admin").classList.contains("no-show")){
            document.getElementById("admin").className += " no-show";
          }
        }
      });
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">    
            <ReactNotification />   
            <ToastContainer />     
            <Switch>
              {/* <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} /> */}
              <Route exact path="/" component={Home} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/admin" component={Admin} />
              <Route exact path="/shop" component={Shop} />
              <Route path="/approve/:productId" component={Approve} />
              <Route exact path="/inventory" component={Inventory} />
              <Route exact path="/marketplace" component={Marketplace} />
              <Redirect to="/login" />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

