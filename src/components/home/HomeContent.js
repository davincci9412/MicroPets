/**
 * Author : Vadim
 * Create Date : 8/16/2021
 * Email : snowfirst312@outlook.com
 * Skype : live:.cid.d66694e683af316e
 * Description : MicroPets project
 */

import React from 'react';
import jsonData from '../data.json';
import Connect from "../Connect";

const datasByRow = [];

class HomeContent extends React.Component {
  
  constructor(props) {
    super(props);
    const loadData = JSON.parse(JSON.stringify(jsonData));
    this.state = { datas: datasByRow, chainId:"", status:false, admin:false, data:loadData};
    
    this.onConnection = this.onConnection.bind(this);
  }

  async componentDidMount() {
    // if (window.ethereum !== undefined) {
    //   if (window.ethereum.isConnected()) {  
    //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //     if (Array.isArray(accounts)){     
    //       let adminLogin;     
    //       const temps =this.state.data[0].address.split(",");
    //       temps.map((temp, i)=>{
    //         if (accounts[0].toLowerCase() === temp.toLowerCase()) {
    //           document.getElementById("admin").classList.remove("no-show");
    //           adminLogin = true;
    //         };
    //         return i;
    //       }) 
    //       if (!adminLogin){
    //         if (!document.getElementById("admin").classList.contains("no-show")){
    //           document.getElementById("admin").className += " no-show";
    //         }
    //         window.location.href="/shop";
    //       }     
    //     } 
        
    //   } else {
    //     window.ethereum.on('connect', () => {
    //       window.location.reload();
    //     });
    //     window.ethereum.on('connect', window.ethereum.chainId);
    //   }
    // } 
  }

  async onConnection() {
    
    try {
      if (window.ethereum === undefined) {
        window.open("https://metamask.io/download.html");
      } else {
        this.chainId = window.ethereum.chainId;
        if (document.getElementById("connect").classList.contains("connect")){
          // await window.ethereum.request({
          //   method: "eth_requestAccounts",
          //   params: [
          //     {
          //       eth_accounts: {}
          //     }
          //   ]
          // });
          // this.setState({"status":false});
        } else {
          if (window.ethereum.isConnected()) {                    
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (Array.isArray(accounts)){
              this.setState({address: accounts[0].substr(0,5)+"..."+accounts[0].substr(-4, 4)});
              this.setState({"status":true});   
              window.location.reload();
            } 
          } else {
            window.ethereum.on('connect', () => {
              window.location.reload();
            });
          }    
        }                      
      }        
    } catch (error) {
      console.error(error);
    }
  }  
   
  render(){
	  return <div className="home">
        <section className="banner">
          <div className="banner-label">
            <h2>NFT GAMES PLATFORM & DECENTRALIZED YIELD FARM APPLICATIONS</h2>
            <p className="banner-text my-4">
                MicroSHIBA game is a play to earn NFT RPG developed on the Binance Smart Chain
            </p>
            <img src="/img/crate.mp4" className="dog" alt=""></img>
            <div className="banner-btns">
                <a href="/home" className="btn btn-yellow">Buy Shiba</a>
                <Connect />
            </div>
            </div>
        </section>
        <section className="feature container-fluid text-center">            
            <h2 className="my-3">FEATURES</h2>
            <div className="row">
              <div className="col-md-3 mb-4">
                <div className="feature-item">
                  <img src="/img/NFTFarming.png" alt=""></img>
                  <h5 className="mb-3">NFT Farming</h5>
                  <p className="feature-text">
                    Stake your dog NFT at the farm on Mars. It will generate MicroSHIBA tokens for your every block.
                  </p>
                </div>                
              </div>
              <div className="col-md-3 mb-4">
                <div className="feature-item">
                  <img src="/img/PlayToEarn.png" alt=""></img>
                  <h5 className="mb-3">PLAY TO EARN</h5>
                  <p className="feature-text">
                    Defeat the invaders to win valuable items, you can sell these items for MicroSHIBA tokens or keep them to increase strength in the next battles.
                  </p>
                </div>                
              </div>
              <div className="col-md-3 mb-4">
                <div className="feature-item">
                  <img src="/img/Marketplace.png" alt=""></img>
                  <h5 className="mb-3">MARKETPLACE</h5>
                  <p className="feature-text">
                    You can buy or sell the dogs or rare gear to everyone on a completely decentralized NFT open market.
                  </p>
                </div>                
              </div>
              <div className="col-md-3 mb-4">
                <div className="feature-item">
                  <img src="/img/Deflation.png" alt=""></img>
                  <h5 className="mb-3">DEFLATION</h5>
                  <p className="feature-text">
                    Each sell transaction will be charged at a 5% fee. The charge would be automatically added to the locked staking contract for disbursing interest to participants in this operation.
                  </p>
                </div>                
              </div>
            </div>
        </section>
        <section className="friend">
            <h1>FRIENDS OF MICROPETS</h1>
            <div className="friend-main">
                <a href="/home" ><img src="/img/friend/coingecko.webp" alt=""></img></a>
                <a href="/home" ><img src="/img/friend/binance.webp" alt=""></img></a>
                <a href="/home" ><img src="/img/friend/pancake.png" alt=""></img></a>
                <a href="/home" ><img src="/img/friend/coinmarket.webp" alt=""></img></a>
                <a href="/home" ><img src="/img/friend/policedoge.png" alt=""></img></a>
            </div>
        </section>
    </div> 
  }
}	
export default HomeContent;
