/**
 * Author : Vadim
 * Create Date : 8/16/2021
 * Email : snowfirst312@outlook.com
 * Skype : live:.cid.d66694e683af316e
 * Description : MicroPets project
 */

import React from 'react';

import Web3 from 'web3';
import Market from '../../proxies/Market';
import PuppyNFT from '../../proxies/PuppyNFT';
import Token from '../../proxies/Token';
import { Modal } from 'react-bootstrap';
import jsonData from '../data.json';
import Connect from "../Connect";
import { toast } from 'react-toastify';
import Provider from '../../proxies/Provider';

let web3;
const colors = ["yellow", "pink", "blank", "red", "blue"];
const provider = new Provider();

class ModalWindow extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {show: false, new_name:'', type:0};
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  handleClose = () => this.setState({show:false});
  handleShow = async() => {
    
    const initiator = await web3.eth.getCoinbase();
        const akitaPrice = await PuppyNFT.methods.getAkitaPrice().call();
        const kishuPrice = await PuppyNFT.methods.getKishuPrice().call();
        const hokkaidoPrice = await PuppyNFT.methods.getHokkaidoPrice().call();
        const shibaPrice = await PuppyNFT.methods.getShibaPrice().call();
        const microPrice = await PuppyNFT.methods.getMicroPrice().call();
        const dog = await PuppyNFT.methods.getNextSalePuppyId(this.props.type).call({from:initiator});
        
        
        if (this.props.type === 0) {this.setState({name:"Akita"});        this.setState({url:"/img/dogs/akita.mp4"});    this.setState({multi:1});    this.setState({price:web3.utils.fromWei(akitaPrice, 'ether')});    this.setState({rarity:"Common"});  this.setState({dogId: Number(this.props.type)*100000 + Number(dog) + 100000}) };
        if (this.props.type === 1) {this.setState({name:"Kishu"});        this.setState({url:"/img/dogs/kishu.mp4"});    this.setState({multi:1.25}); this.setState({price:web3.utils.fromWei(kishuPrice, 'ether')});    this.setState({rarity:"Uncommon"}); this.setState({dogId: Number(this.props.type)*100000 + Number(dog) + 100000})};
        if (this.props.type === 2) {this.setState({name:"Hokkaido"});     this.setState({url:"/img/dogs/hokkaido.mp4"}); this.setState({multi:1.5});  this.setState({price:web3.utils.fromWei(hokkaidoPrice, 'ether')}); this.setState({rarity:"Rare"}); this.setState({dogId: Number(this.props.type)*100000 + Number(dog) + 100000})};
        if (this.props.type === 3) {this.setState({name:"Shiba"});        this.setState({url:"/img/dogs/shiba.mp4"});    this.setState({multi:2});    this.setState({price:web3.utils.fromWei(shibaPrice, 'ether')});    this.setState({rarity:"Epic"}); this.setState({dogId: Number(this.props.type)*100000 + Number(dog) + 100000})};
        if (this.props.type === 4) {this.setState({name:"Micro Shiba"});  this.setState({url:"/img/dogs/micro.mp4"});    this.setState({multi:3});    this.setState({price:web3.utils.fromWei(microPrice, 'ether')});    this.setState({rarity:"Legendary"}); this.setState({dogId: Number(this.props.type)*100000 + Number(dog) + 100000})};
        
    this.setState({show:true});
  }
  handleSave = () => {  
    this.setState({show:false});
  }
  handleChange(propertyName, e) {	  
    const change = {};
    change[propertyName] = e.target.value;
    this.setState(change);
  } 
  
  render (){    
    return <span>
      <span id="obtained" onClick={this.handleShow}></span>
      <Modal show={this.state.show} onHide={this.handleClose} className="shop App">
        <Modal.Header closeButton>
          <Modal.Title>Congratulations!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center name my-4 explanation">You have got one {this.state.name}.</div>
          <div className="item-content">
            <h3 className="box-name">{this.state.name}</h3>
            <h3 className="multi">{this.state.multi}<img src="/img/red-close.png" className="multi" alt=""></img></h3>
          </div>
          <video className="dog" autoPlay loop>
            <source src={this.state.url} type="video/mp4"/>  
            Your browser does not support the video tag.
          </video>
          <div className="item-content my-2">
            <h6 className="name">{this.state.rarity}</h6>
            <h6 className="price">NFT ID: {this.state.dogId}</h6>
          </div>
          <div className="item-content my-2">
            <h6 className="name">Price</h6>
            <h6 className="price"><img src="/img/logo.png" alt=""></img> {this.state.price}</h6>
          </div>
        </Modal.Body>
      </Modal>
    </span>
  }
}

class ShopContent extends React.Component {
  
  constructor(props) {
    super(props);
    const loadData = JSON.parse(JSON.stringify(jsonData));
    this.state = { colors: colors, crates: [], data:loadData, cratePrice:0, displayPrice:0}
    web3 = new Web3(window.ethereum);
  }

  async componentDidMount() {
    if (window.ethereum !== undefined) {
      if (window.ethereum.isConnected()) {  
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
    
    this.setState({marketplace:this.state.data[2].address});

    const initiator = await web3.eth.getCoinbase();
    let temp;
    temp = await PuppyNFT.methods.getCratePrice().call({from: initiator});
    this.setState({cratePrice: temp});
    temp = web3.utils.fromWei(temp, 'ether');
    if (temp > 1000000000){
      temp = temp / 1000000000;
      temp = temp.toString() + 'B';
    } else if (temp > 1000000){
      temp = temp / 1000000;
      temp = temp.toString() + 'MM';
    }
    this.setState({displayPrice:temp})
    //this.setState({calculated: web3.utils.fromWei(cratePrice, 'ether')});
    //this.setState({amount: 1});

  }

  onPurchaseCrate = async (marketplace, cratePrice) => {
    const initiator = await web3.eth.getCoinbase();

    if (typeof window.ethereum === 'undefined') {
      window.open("https://metamask.io/download.html"); 
      toast.error("No Metamask. Please install it.", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:10000});
    } else {
      // let number = document.getElementById("amount").value;
      // if (number === "" ) number = 1;
      // cratePrice = Number(cratePrice) * Number(number);
      // cratePrice = cratePrice.toString();
      const max = 100;
      const min = 0;      
      const ranNumber = Math.floor(Math.random() * (max - min )) + 1;
      let type;
      // if (ranNumber>0 && ranNumber<=20 ) type = 0;
      // if (ranNumber>20 && ranNumber<=40 ) type = 1;
      // if (ranNumber>40 && ranNumber<=60 ) type = 2;
      // if (ranNumber>60 && ranNumber<=80 ) type = 3;
      // if (ranNumber>80 ) type = 4;
      
      if (ranNumber>0 && ranNumber<=40 ) type = 0;
      if (ranNumber>40 && ranNumber<=65 ) type = 1;
      if (ranNumber>65 && ranNumber<=85 ) type = 2;
      if (ranNumber>85 && ranNumber<=95 ) type = 3;
      if (ranNumber>95 && ranNumber<=99 ) type = 4;
      if (ranNumber===100 ) type = 5;
      
      this.setState({type: type});

      try {
        toast.info("Opening crate...", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:false});
        // await web3.eth.sendTransaction({
        //   from: initiator,
        //   to: this.state.data[1].address,
        //   gas: 6700000,
        //   data: Token.methods.approve(marketplace, web3.utils.toWei(cratePrice, 'ether')).encodeABI()
        // }).on('transactionHash', async function(hash){        
          await web3.eth.sendTransaction({
            from: initiator,
            to: marketplace,
            gas: 6700000,
            data: Market.methods.purchaseCrate(marketplace, cratePrice, type).encodeABI()
            //data: Market.methods.purchaseCrate(crateId, number).encodeABI()
          }).on('receipt', async function(receipt){      
            toast.dismiss();    
            const el = document.getElementById("obtained");
            el.click();
            //window.location.href = "/inventory";
            //window.location.reload();
          }).on('error', function (error){ // If a out of gas error, the second parameter is the receipt
            toast.dismiss();  
            toast.error("Balance Insufficient.", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:5000});
            console.log(error);
          });       
        // }).on('error', function (error){ // If a out of gas error, the second parameter is the receipt
        //   toast.dismiss();  
        //   toast.error("The transaction is not approved", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:5000});
        //   console.log(error);
        // }); 

      } catch (err) {
        toast.dismiss();  
        toast.error(err.message, {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:5000});
      }    
    }  
      
  }

  render(){
    return <div className="home shop">
        <section className="banner">
          <div className="banner-label">
            <h2>SHOP</h2>
            <p className="banner-text my-4">
              All special items are only available here!
            </p>
          </div>      
        </section>
        <section className="shop-main">            
          <div className="row" >                
          <div className="col-md-3">
            <div className="shop-item text-center" >
              <h3 className="box-name mb-2">Crate</h3>
              <video className="dog" autoPlay loop>
                <source src="/img/dogs/crate.mp4" type="video/mp4"/>
                Your browser does not support the video tag.
              </video>
              <div className="item-content my-3">
                <h5 className="name">COST</h5>
                <h4 className="price"><img src="/img/logo.png" alt=""></img> {this.state.displayPrice}</h4>
              </div>
              <button type="submit" className="btn btn-purple" onClick={this.onPurchaseCrate.bind(this, this.state.marketplace, this.state.cratePrice)}>BUY</button>
            </div>  
            </div>
          </div>
        </section>
        <ModalWindow type={this.state.type}/>
        <div className="no-display"><Connect /></div>
    </div> 
  }
}	
export default ShopContent;
