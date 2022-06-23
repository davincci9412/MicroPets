/**
 * Author : Vadim
 * Create Date : 8/16/2021
 * Email : snowfirst312@outlook.com
 * Skype : live:.cid.d66694e683af316e
 * Description : MicroPets project
 */

import React from 'react';
import Web3 from 'web3';
import PuppyNFT from '../../proxies/PuppyNFT';
import Market from '../../proxies/Market';
import Token from '../../proxies/Token';
import jsonData from '../data.json';
import { toast } from 'react-toastify';
import Provider from '../../proxies/Provider';

let web3;
const colors = ["yellow", "pink", "lawngreen", "red", "blue"];
const provider = new Provider();

class MarketplaceContent extends React.Component {
   
  constructor(props) {
    super(props);
    const loadData = JSON.parse(JSON.stringify(jsonData));
    this.state = { colors: colors, crates: [], data:loadData, dogs: [], marketplace: null,   price: null}

    try {
      web3 = new Web3(window.ethereum);
    } catch(err){      
      toast.info("Please connect your wallet...", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:5000});
    }
    //web3 = provider.web3;
  }
 
  async componentDidMount() {
    if (window.ethereum !== undefined) {
      let accounts;
      if (window.ethereum.isConnected()) {  
        try {
          accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (err){

        }
        if (Array.isArray(accounts)){
          const temps =this.state.data[0].address.split(",");
          temps.map((temp, i)=>{
            if (accounts[0].toLowerCase() === temp.toLowerCase()) {
              document.getElementById("admin").classList.remove("no-show");
            };
            return i;
          })   
          this.setState({"status":true});
        } 
      } else {
        // window.ethereum.on('connect', () => {
        //   window.location.reload();
        // });
        // window.ethereum.on('connect', window.ethereum.chainId);
        try {
          accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (err){
          
        }
        if (Array.isArray(accounts)){
          const temps =this.state.data[0].address.split(",");
          temps.map((temp, i)=>{
            if (accounts[0].toLowerCase() === temp.toLowerCase()) {
              document.getElementById("admin").classList.remove("no-show");
            };
            return i;
          })             
          this.setState({"status":true});
        } 
      }
    } 
    if (typeof window.ethereum === 'undefined') {
      window.open("https://metamask.io/download.html"); 
      toast.error("No Metamask. Please install it.", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:10000});
    } else {
      await this.updateDogs();
    }
  }

  updateDogs = async () => {
    try {
      const puppys = await PuppyNFT.methods.getPuppysForSale().call();
      const puppy = await Promise.all(puppys.map(async (dogId, i) => {
        const { sellingPrice, forSale } = await PuppyNFT.methods.getPuppyDetails(dogId).call();
        let displayPrice;
        displayPrice = web3.utils.fromWei(sellingPrice, 'ether');
        if (displayPrice > 1000000000){
          displayPrice = displayPrice / 1000000000;
          displayPrice = displayPrice.toString() + 'B';
        } else if (displayPrice > 1000000){
          displayPrice = displayPrice / 1000000;
          displayPrice = displayPrice.toString() + 'MM';
        }
        let name;
        let url;
        let rarity;
        let multi;

        if (dogId.charAt(0) === "1") {   name = "Akita";    url = "/img/dogs/akita.mp4";       multi = 1;     rarity = "Common"    } 
        if (dogId.charAt(0) === "2") {   name = "Kishu";    url = "/img/dogs/kishu.mp4";       multi = 1.25;  rarity = "Uncommon"} 
        if (dogId.charAt(0) === "3") {   name = "Hokkaido"; url = "/img/dogs/hokkaido.mp4";    multi = 1.5;   rarity = "Rare" } 
        if (dogId.charAt(0) === "4") {   name = "Shiba";    url = "/img/dogs/shiba.mp4";       multi = 2;     rarity = "Epic"} 
        if (dogId.charAt(0) === "5") {   name = "Micro";    url = "/img/dogs/micro.mp4";       multi = 3;     rarity = "Legendary"} 
        if (dogId.charAt(0) === "6") {name = "Special Editions";  url = "/img/dogs/santa.mp4"; multi = 4;     rarity="Special Editions"}; 
        if (forSale) {
          return (
            <div className="col-md-3" key={i}>
              <div className="shop-item text-center" >
                <div className="item-content">
                  <h3 className="box-name">{name}</h3>
                  <h3 className="multi">{multi}<img src="/img/red-close.png" className="multi" alt=""></img></h3>
                </div>
                <video className="dog" autoPlay loop>
                  <source src={url} type="video/mp4"/>
                  Your browser does not support the video tag.
                </video>
                <div className="item-content my-2">
                  <h6 className="name">{rarity}</h6>
                  <h6 className="price">NFT ID: {dogId}</h6>
                </div>
                <div className="text-center">
                  <h4 className="price"><img src="/img/logo.png" alt=""></img> {displayPrice}</h4>
                </div>
                <div className="mt-4">                  
                  <button type="submit" className="btn btn-purple" onClick={this.onBuy.bind(this, dogId, sellingPrice)}>Buy</button>
                </div>
              </div>  
            </div>
          );
        }
      }));
      this.setState({ puppy: puppy });

    } catch (err) {
      toast.dismiss();  
      toast.error(err.message, {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:5000});
    }
  }
  
  onBuy = async (dogId, sellingPrice) => {
    const initiator = await web3.eth.getCoinbase();
    //const initiator = await web3.eth.getAccounts()[0];
    try {
      const marketplace = this.state.data[2].address;
      toast.info("Buying the dog...", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:false});

      // await web3.eth.sendTransaction({
      //   from: initiator,
      //   to: this.state.data[1].address,
      //   gas: 6700000,
      //   data: Token.methods.approve(marketplace, sellingPrice).encodeABI()
      // }).on('transactionHash', async function(hash){
        await web3.eth.sendTransaction({
          from: initiator,
          to: marketplace,
          gas: 6700000,
          data: Market.methods.secondaryPurchase(marketplace, dogId).encodeABI()
        }).on('receipt', async function(receipt){          
          toast.dismiss();  
          //window.location.href = "/inventory";
          window.location.reload();
        })
        .on('error', function (error){ // If a out of gas error, the second parameter is the receipt
          toast.dismiss();  
          toast.error("Transaction Fail", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:5000});
        });         
      // }).on('error', function (error){ // If a out of gas error, the second parameter is the receipt
      //   toast.dismiss();  
      //   toast.error("The transaction is not approved", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:5000});
      // }); 
           
      
    } catch (err) {
      toast.dismiss();  
      toast.error(err.message, {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:5000});
    }

  }

  onStake = async (type, id, initiator) => {

  }

  onFarming = async (type, id, initiator) => {

  }

  render(){
      return <div className="home shop marketplace">         
        <section className="banner">
          <div className="banner-label">
            <h2>MARKETPLACE</h2>
            <p className="banner-text my-4">
              The right to sell and trade is totally owned by the player! 
              There is a small buy fee added to each transaction
            </p>
          </div>        
        </section>
        <section className="shop-main">            
          <div className="row" >  
            {this.state.puppy}  
          </div>
        </section>          
      </div> 
  }
}	
export default MarketplaceContent;
 
