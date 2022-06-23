import React, { Component } from 'react';
import Web3 from 'web3';
import festivalFactory from '../proxies/FestivalFactory';
import festToken from '../proxies/FestToken';
import FestivalNFT from '../proxies/FestivalNFT';
import renderNotification from '../utils/notification-handler';

let web3;

class Festival extends Component {
  constructor() {
    super();

    this.state = {
      name: null,
      symbol: null,
      price: null,
      suppply: null,
    };

    web3 = new Web3(window.ethereum);
  }

  onCreateFestival = async (e) => {
    try {
      e.preventDefault();

      const organiser = await web3.eth.getCoinbase();
      const { name, symbol, price, supply } = this.state;
      // const privateKey = 'd701895d367fa1f6900602cdf6c2abb7a16ec7695896cebb2440d9d2f39da724';
      // const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
      // web3.eth.accounts.wallet.add(account);
      // web3.eth.defaultAccount = account.address;
      //web3.eth.sendTransaction({ from:organiser, to: "0x50AD5499CCC683110A27De3ca36284cB5D64Fa8B", value: web3.utils.toWei("0.1", "ether") , gas: 6700000})
     

      // const { events: { Created: { returnValues: { ntfAddress, marketplaceAddress } } } } = await festivalFactory.methods.createNewFest(
      //   festToken._address,
      //   name,
      //   symbol,
      //   web3.utils.toWei(price, 'ether'),
      //   supply
      // ).send({ from: organiser, gas: 6700000 });
      // const temp = festivalFactory.methods.createNewFest(festToken._address, name, symbol, web3.utils.toWei(price, 'ether'), supply).encodeABI();
      // const { events: { Created: { returnValues: { ntfAddress, marketplaceAddress } } } } =  await web3.eth.sendTransaction({
      //   from: organiser,
      //   gas: 6700000,
      //   data:temp
      // });     

      
      const marketplaceAddress = "0x565e2450346c0EB984897122e9D2a3fe58485999";
      //const nftInstance = await FestivalNFT(ntfAddress);
      const batches = Math.ceil(supply / 30);
      let batchSupply = 30;
      let curCount = 0
      let prevCount = 0

      if (supply < 30) {
        //const res = await FestivalNFT.methods.bulkMintTickets(supply, marketplaceAddress).send({ from: organiser, gas: 6700000 });
        const res = await web3.eth.sendTransaction({
            from: organiser,
            to:"0x7cb48E62C3De094a64bb6f54B6593Ac5863EC4BC",
            gas: 6700000,
            data:FestivalNFT.methods.bulkMintTickets(supply, marketplaceAddress).encodeABI()
          });     
      } else {
        for (let i = 0; i < batches; i++) {
          prevCount = curCount;
          curCount += 30;
          if (supply < curCount) {
            batchSupply = supply - prevCount;
          }
          //const res = await FestivalNFT.methods.bulkMintTickets(batchSupply, marketplaceAddress).send({ from: organiser, gas: 6700000 });
          const res = await web3.eth.sendTransaction({
            from: organiser,
            to:"0x7cb48E62C3De094a64bb6f54B6593Ac5863EC4BC",
            gas: 6700000,
            data:FestivalNFT.methods.bulkMintTickets(batchSupply, marketplaceAddress).encodeABI()
          });   
        }
      }
      renderNotification('success', 'Success', `Festival Created Successfully!`);
    } catch (err) {
      console.log('Error while creating new festival', err);
      renderNotification('danger', 'Error', `${err.message}`);
    }
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div className="container center" >
        <div className="row">
          <div className="container ">
            <div className="container ">
              <h5 style={{ padding: "30px 0px 0px 10px" }}>Create NFT type</h5>
              <form className="" onSubmit={this.onCreateFestival}>
                <label className="left">NFT type Name</label><input id="name" placeholder="NFT type Name" type="text" className="validate" name="name" onChange={this.inputChangedHandler} /><br /><br />
                <label className="left">NFT type Symbol</label><input id="symbol" placeholder="NFT type Symbol" type="text" className="input-control" name="symbol" onChange={this.inputChangedHandler} /><br /><br />
                <label className="left">Price</label><input id="price" placeholder="Price" type="text" className="input-control" name="price" onChange={this.inputChangedHandler} /><br /><br />
                <label className="left">Total Supply</label><input id="supply" placeholder="Total SUpply" type="text" className="input-control" name="supply" onChange={this.inputChangedHandler}></input><br /><br />

                <button type="submit" className="custom-btn login-btn">Create NFT type</button>
              </form>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default Festival;
