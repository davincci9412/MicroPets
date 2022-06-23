/**
  * Author : Vadim
  * Create Date : 8/16/2021
  * Email : snowfirst312@outlook.com
  * Skype : live:.cid.d66694e683af316e
  * Description : MicroPets project
  */

import React from 'react';
import Web3 from 'web3';
import { Modal, Button } from 'react-bootstrap';
import CrateNFT from '../../proxies/CrateNFT';
import PuppyNFT from '../../proxies/PuppyNFT';
import Market from '../../proxies/Market';
import Token from '../../proxies/Token';
import renderNotification from '../../utils/notification-handler';
import jsonData from '../data.json';
 
let web3;
const colors = ["yellow", "pink", "lawngreen", "red", "blue"];

class Loading extends React.Component {
  render(){
    if (this.props.loading) {
      return <div className="loader"><img src="/img/2.gif" alt="Please wait for processing the transaction"/></div>
    } else {
      return <div></div>
    }
  }
}

class ModalWindow extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {datas:this.props.state, show: false, new_name:''};
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  handleClose = () => this.setState({show:false});
  handleShow = () => this.setState({show:true});
  handleSave = () => {
    this.props.state[this.props.index].wallet_name = this.state.new_price;
    this.setState({show:false});
	  this.props.sell.call(null, this.props.dog_id, this.props.new_price,  this.props.initiator);
  }
  handleChange(propertyName, e) {	  
    const change = {};
    change[propertyName] = e.target.value;
    this.setState(change);
  } 
  
  render (){
    return <span>
      <span variant="primary" id="test" onClick={this.handleShow} className="btn btn-purple">SELL</span>
      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Input the selling price</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="form-group">
          <label>Initial price: </label>
          <input type='text' name='old_price' className='form-control' value={this.props.price} readOnly/>
        </div>
        <div className="form-group">
          <label>Selling price: </label>
          <input type='text' name='new_price' onChange={this.handleChange.bind(this, 'new_price')} className='form-control' placeholder='Selling price' />
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="btn btn-purple" onClick={this.handleSave.bind(this)}>
            SELL
          </Button>
        </Modal.Footer>
      </Modal>
    </span>
  }
}

class InventoryContent extends React.Component {
   
  constructor(props) {
    super(props);
    const loadData = JSON.parse(JSON.stringify(jsonData));
    this.state = { colors: colors, crates: [], data:loadData, dogs: [], marketplace: null,   price: null, loading:false}
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
        window.ethereum.on('connect', () => {
          window.location.reload();
        });
        window.ethereum.on('connect', window.ethereum.chainId);
      }
    }    
    await this.viewCrates();
    await this.viewDogs();
    // const element = document.getElementById("test");
    // element.click();
  } 
    
  viewCrates = async () => {
    try {
      const initiator = await web3.eth.getCoinbase();
      //const crateNFTs=["0x7cb48E62C3De094a64bb6f54B6593Ac5863EC4BC"];
      const crates = await CrateNFT.methods.getCratesOfCustomer(initiator).call({ from: initiator });
      let renderData = "";
      if (crates.length > 0){
        const cratePrice = await CrateNFT.methods.getCratePrice().call({from:initiator});
        const hatchPrice = await CrateNFT.methods.getHatchPrice().call({from:initiator});
        const marketplace = this.state.data[2].address;
        renderData = crates.map((crate, i) => {
          return (
            <div className="col-md-3" key={i}>
              <div className="shop-item text-center" key={i}>
                <h3 className="box-name mb-2">Crate</h3>
                <img src="/img/crate.gif" className="dog" alt=""></img>
                <div className="item-content my-2">
                  <h5 className="name">COST</h5>
                  <h4 className="price"><img src="/img/logo.png" alt=""></img> {web3.utils.fromWei(cratePrice, 'ether')}</h4>
                </div>
                <div className="item-content mb-4">
                  <h5 className="name">CRATE</h5>
                  <h4 className="price"><img src="/img/logo.png" alt=""></img> {web3.utils.fromWei(hatchPrice, 'ether')}</h4>
                </div>
                <button type="submit" className="btn btn-purple" onClick={this.onHatchCrate.bind(this, crate, marketplace, hatchPrice, initiator)}>STIMULATE</button>
              </div> 
            </div> 
          );
        });
      } else {
        renderData = <div className="col-md-3"><div className="shop-item text-center blue" ><h3 className="name">No Crate</h3></div></div>;  
      }  
      this.setState({ crates: renderData});

    } catch (err) {
      renderNotification('danger', 'Error', err.message);
      console.log('Error while fetching the crates', err);
    }
  }

  onHatchCrate = async (crate, marketplace, hatchPrice, initiator) => {
    try {
      this.setState({loading : true})
      const max = 100;
      const min = 0;      
      const ranNumber = Math.floor(Math.random() * (max - min )) + 1;
      let type;
      // if (ranNumber>0 && ranNumber<=20 ) type = 1;
      // if (ranNumber>20 && ranNumber<=40 ) type = 2;
      // if (ranNumber>40 && ranNumber<=60 ) type = 3;
      // if (ranNumber>60 && ranNumber<=80 ) type = 4;
      // if (ranNumber>80 ) type = 5;

      if (ranNumber>0 && ranNumber<=50 ) type = 1;
      if (ranNumber>50 && ranNumber<=80 ) type = 2;
      if (ranNumber>80 && ranNumber<=95 ) type = 3;
      if (ranNumber>95 && ranNumber<=99 ) type = 4;
      if (ranNumber===100 ) type = 5;
      
      await web3.eth.sendTransaction({
        from: initiator,
        to:this.state.data[1].address,
        gas: 6700000,
        data: Token.methods.approve(marketplace, hatchPrice).encodeABI()
      }).on('transactionHash', async function(hash){
        await web3.eth.sendTransaction({
          from: initiator,
          to: marketplace,
          gas: 6700000,
          data: Market.methods.stimulateCrate(crate, type).encodeABI()
        }).on('receipt', async function(receipt){
          await renderNotification('success', 'Success', `Stimulated the crate successfully!`);
          window.location.reload();
        }).on('error', function (error){ // If a out of gas error, the second parameter is the receipt
          renderNotification('danger', 'Error', error.message);
          console.log(error);
        });         
      }).on('error', function (error){ // If a out of gas error, the second parameter is the receipt
        renderNotification('danger', 'Error', error.message);
        console.log(error);
      });  

    } catch (err) {
      console.log('Error while stimulating the crate', err);
      renderNotification('danger', 'Error', err.message);
      this.setState({loading : false})
    }
  }

  viewDogs = async () => {
    try {
      const initiator = await web3.eth.getCoinbase();
      
      let dogs = [];
      let renderData;
      let dog_exist = false;
      dogs = dogs.concat(await PuppyNFT.methods.getPuppysOfCustomer(initiator).call({ from: initiator }));
      if (dogs.length > 0){
        const akitaPrice = await PuppyNFT.methods.getAkitaPrice().call({from: initiator});
        const kishuPrice = await PuppyNFT.methods.getKishuPrice().call({from: initiator});
        const hokkaidoPrice = await PuppyNFT.methods.getHokkaidoPrice().call({from: initiator});
        const shibaPrice = await PuppyNFT.methods.getShibaPrice().call({from: initiator});
        const microPrice = await PuppyNFT.methods.getMicroPrice().call({from: initiator});

        renderData = await Promise.all(dogs.map(async(dog, i) => {
          dog_exist = true;
          let name;
          let url;
          let price;
          let multi;
          let rarity;
          
          if (dog.charAt(0) === "1") {   name = "Akita";        url = "/img/dogs/akita.gif";    multi = 1;    price = akitaPrice;    rarity="Common"}; 
          if (dog.charAt(0) === "2") {   name = "Kishu";        url = "/img/dogs/kishu.gif";    multi = 1.25; price = kishuPrice;    rarity="Uncommon"};
          if (dog.charAt(0) === "3") {   name = "Hokkaido";     url = "/img/dogs/hokkaido.gif"; multi = 1.5;  price = hokkaidoPrice; rarity="Rare"}; 
          if (dog.charAt(0) === "4") {   name = "Shiba";        url = "/img/dogs/shiba.gif";    multi = 2;    price = shibaPrice;    rarity="Epic"}; 
          if (dog.charAt(0) === "5") {   name = "Micro Shiba";  url = "/img/dogs/micro.gif";    multi = 3;    price = microPrice;    rarity="Legendary"}; 
          const { forSale } = await PuppyNFT.methods.getPuppyDetails(dog).call({ from: initiator });
          let saleHtml;
          if (forSale) {
            saleHtml = <div>
              <div className="mt-4">   
                <h4>Is On Sale</h4>
              </div>
              <div className="my-3">                  
                <button type="submit" className="btn btn-purple" onClick={this.onCancel.bind(this, dog, price, initiator)}>CANCEL SELLING</button>
              </div>
            </div>
          } else {
            saleHtml = <div className="mt-4">      
              <ModalWindow index={i} dog_id={dog} price={web3.utils.fromWei(price, 'ether')} initiator={initiator} sell={this.onSell.bind(this, dog, price, initiator)}/> 
            </div>
          }

          return (
            <div className="col-md-3" key={i}>
              <div className="shop-item text-center" >
                <div className="item-content">
                  <h3 className="box-name">{name}</h3>
                  <h3 className="multi">{multi}<img src="/img/red-close.png" className="multi" alt=""></img></h3>
                </div>
                <img src={url} className="dog" alt="" />
                <div className="item-content my-2">
                  <h6 className="name">{rarity}</h6>
                  <h6 className="price">NFT ID: {dog}</h6>
                </div>
                {saleHtml}      
                <div className="my-3">                  
                  <button type="submit" className="btn btn-purple" onClick={this.onStake.bind(this, dog, price, initiator)}>STAKE</button>
                </div>
                <div>                  
                  <button type="submit" className="btn btn-purple" onClick={this.onFarming.bind(this, dog, price, initiator)}>FARMING</button>
                </div>
              </div>  
            </div>
          );
        })
        )
      } 
       
      if (!dog_exist)  renderData = <div className="col-md-3"><div className="shop-item text-center blue" ><h3 className="name">No Dog</h3></div></div>;     

      this.setState({ puppy: renderData});  

    } catch (err) {
      renderNotification('danger', 'Error', err.message);
      console.log('Error while fetching the crates', err);
    }
  }

  onSell = async (id, price, initiator) => {
    try {
      this.setState({loading : true})
      const marketplace = this.state.data[2].address;
      await web3.eth.sendTransaction({
        from: initiator,
        to:this.state.data[4].address,
        gas: 6700000,
        data: PuppyNFT.methods.setSaleDetails(id, price, marketplace).encodeABI()
      }).on('receipt', async function(receipt){          
        await renderNotification('success', 'Success', `Added the puppy on marketplace successfully!`);
        window.location.href="/marketplace";
      })
      .on('error', function (error){ // If a out of gas error, the second parameter is the receipt
        console.log(error);
      });  
    } catch (err) {
      renderNotification('danger', 'Error', err.message);
      console.log('Error while lisitng for sale', err);
      this.setState({loading : false})
    }
  }

  onCancel = async (id, price, initiator) => {
    try {
      this.setState({loading : true})
      const marketplace = this.state.data[2].address;
      await web3.eth.sendTransaction({
        from: initiator,
        to:this.state.data[4].address,
        gas: 6700000,
        //data: PuppyNFT.methods.setSaleDetails(id, price, marketplace).encodeABI()
        data: PuppyNFT.methods.setCancelDetails(id, price, marketplace).encodeABI()
      }).on('receipt', async function(receipt){          
        await renderNotification('success', 'Success', `Canceled the puppy on marketplace successfully!`);
        window.location.href="/marketplace";
      })
      .on('error', function (error){ // If a out of gas error, the second parameter is the receipt
        console.log(error);
      });  
    } catch (err) {
      renderNotification('danger', 'Error', err.message);
      console.log('Error while lisitng for sale', err);
      this.setState({loading : false})
    }
  }


  onStake = async (type, id, initiator) => {

  }

  onFarming = async (type, id, initiator) => {

  }

  render(){
    return <div className="inventory shop">
         <section className="banner">             
          <div className="banner-label">
            <h2>Inventory</h2>
            <p className="banner-text my-4">
              All special items are only available here!
            </p>
          </div> 
          <Loading loading={this.state.loading} />
         </section>
         <section className="shop-main text-center">            
          <div className="crate" >  
            <h2 className="inventory-title">MY CRATES</h2>
            <div className="row" >
              {this.state.crates} 
            </div>             
          </div>
          <div className="dog mt-5">
            <h2 className="inventory-title">MY DOGS</h2> 
            <div className="row" >
              {this.state.puppy}   
            </div>  
          </div>            
        </section>         
     </div> 
  }
}	
export default InventoryContent;
