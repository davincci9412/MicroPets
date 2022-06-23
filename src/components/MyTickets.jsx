import React, { Component } from 'react';
import Web3 from 'web3';
import festivalFactory from '../proxies/FestivalFactory';
import FestivalNFT from '../proxies/FestivalNFT';
import renderNotification from '../utils/notification-handler';

let web3;

class MyTickets extends Component {
  constructor() {
    super();

    this.state = {
      tickets: [],
      fests: [],
      ticket: null,
      fest: null,
      marketplace: null,
      price: null,
      test: null,
    };

    web3 = new Web3(window.ethereum);
  }

  async componentDidMount() {
    await this.updateFestivals();
  }

  onListForSale = async (e) => {
    try {
      e.preventDefault();
      const initiator = await web3.eth.getCoinbase();
      const { ticket, price, marketplace } = this.state;
      //const nftInstance = await FestivalNFT(this.state.fest);
      //await FestivalNFT.methods.setSaleDetails(ticket, web3.utils.toWei(price, 'ether'), marketplace).send({ from: initiator, gas: 6700000 });
      await web3.eth.sendTransaction({
        from: initiator,
        to:"0x7cb48E62C3De094a64bb6f54B6593Ac5863EC4BC",
        gas: 6700000,
        data: FestivalNFT.methods.setSaleDetails(ticket, web3.utils.toWei(price, 'ether'), marketplace).encodeABI()
      })
      renderNotification('success', 'Success', `Ticket is listed for sale in secondary market!`);
      
    } catch (err) {
      console.log('Error while lisitng for sale', err);
      renderNotification('danger', 'Error', err.message.split(' ').slice(8).join(' '));
    }
  }

  updateFestivals = async () => {
    try {
      const initiator = await web3.eth.getCoinbase();
      //const activeFests = await festivalFactory.methods.getActiveFests().call({ from: initiator });
      //const festDetails = await festivalFactory.methods.getFestDetails(activeFests[0]).call({ from: initiator });
      const activeFests=["0x7cb48E62C3De094a64bb6f54B6593Ac5863EC4BC"];
      const renderData = await Promise.all(activeFests.map(async (fest, i) => {
        //const festDetails = await festivalFactory.methods.getFestDetails(activeFests[i]).call({ from: initiator });
        const temp = "crate2";
        return (
          //<option key={fest} value={fest} >{festDetails[0]}</option>
          <option key={fest} value={fest} >{temp}</option>
        )
      }));

      //this.setState({ fests: renderData, fest: activeFests[0], marketplace: festDetails[4] });
      this.setState({ fests: renderData, fest: activeFests[0], marketplace: "0x565e2450346c0EB984897122e9D2a3fe58485999" });
      this.updateTickets();
    } catch (err) {
      renderNotification('danger', 'Error', 'Error while updating the fetivals');
      console.log('Error while updating the fetivals', err);
    }
  }

  updateTickets = async () => {
    try {
      const initiator = await web3.eth.getCoinbase();
      //const nftInstance = await FestivalNFT(this.state.fest);
      const tickets = await FestivalNFT.methods.getTicketsOfCustomer(initiator).call({ from: initiator });
      const renderData = tickets.map((ticket, i) => (
        <option key={ticket} value={ticket} >{ticket}</option>
      ));

      this.setState({ tickets: renderData, ticket: tickets[0] });
    } catch (err) {
      renderNotification('danger', 'Error', 'Error in updating the ticket for festival');
      console.log('Error in updating the ticket', err);
    }
  }

  onFestivalChangeHandler = async (e) => {
    try {
      const state = this.state;
      state[e.target.name] = e.target.value;
      this.setState(state);

      const { fest } = this.state;
      await this.updateTickets(fest);

      const initiator = await web3.eth.getCoinbase();
      const festDetails = await festivalFactory.methods.getFestDetails(fest).call({ from: initiator });

      this.setState({ marketplace: festDetails[4] });
    } catch (err) {
      console.log('Error while tickets for festival', err.message);
      renderNotification('danger', 'Error', 'Error while tickets for festival');
    }
  }

  selectHandler = (e) => {
    this.setState({ ticket: e.target.value });
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div class="container center" >
        <div class="row">
          <div class="container ">
            <div class="container ">
              <h5 style={{ padding: "30px 0px 0px 10px" }}>My NFTs</h5>
              <form class="" onSubmit={this.onListForSale}>

                <label class="left">NFT type</label>
                <select className="browser-default" name='fest' value={this.state.fest || undefined} onChange={this.onFestivalChangeHandler}>
                  <option value="" disabled >Select NFT type</option>
                  {this.state.fests}
                </select><br /><br />

                <label class="left">NFT Id</label>
                <select className="browser-default" name='ticket' value={this.state.ticket || undefined} onChange={this.selectHandler}>
                  <option value="" disabled>Select NFT id</option>
                  {this.state.tickets}
                </select><br /><br />

                <label class="left">Marketplace Price</label><input id="price" placeholder="Sale Price" type="text" className="input-control" name="price" onChange={this.inputChangedHandler} /><br /><br />

                <button type="submit" className="custom-btn login-btn">Send to Marketplace</button>
              </form>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default MyTickets;  