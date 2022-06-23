import React, { Component } from 'react';
import Web3 from 'web3';
import festivalFactory from '../proxies/FestivalFactory';
import FestivalNFT from '../proxies/FestivalNFT';
import FestivalMarketplace from '../proxies/FestivalMarketplace';
import festToken from '../proxies/FestToken';
import renderNotification from '../utils/notification-handler';

let web3;

class Purchase extends Component {
  constructor() {
    super();

    this.state = {
      festivals: [],
    };

    web3 = new Web3(window.ethereum);
  }

  async componentDidMount() {
    await this.updateFestivals();
  }

  updateFestivals = async () => {
    try {
      const initiator = await web3.eth.getCoinbase();
      //const activeFests = await festivalFactory.methods.getActiveFests().call({ from: initiator });

      const activeFests=["0x86f9a4395197f814b5571f4a4629cfe85d439b3b"];
      
      const fests = await Promise.all(activeFests.map(async fest => {
        //const festDetails = await festivalFactory.methods.getFestDetails(fest).call({ from: initiator });
        //const [festName, festSymbol, ticketPrice, totalSupply, marketplace] = Object.values(festDetails);
        //const nftInstance = await FestivalNFT(fest);
        //const saleId = await nftInstance.methods.getNextSaleTicketId().call({ from: initiator });
        const festName = "crates";
        const festSymbol = "crates";
        const ticketPrice = await FestivalNFT.methods.getTicketPrice().call({from:initiator});
        const totalSupply = await FestivalNFT.methods.ticketCounts().call({from:initiator});
        const marketplace = "0x565e2450346c0EB984897122e9D2a3fe58485999";
        const saleId = await FestivalNFT.methods.getNextSaleTicketId().call({from:initiator});

        return (
          <tr key={fest}>
            <td class="center">{festName}</td>
            <td class="center">{web3.utils.fromWei(ticketPrice, 'ether')}</td>
            <td class="center">{totalSupply - saleId}</td>

            <td class="center"><button type="submit" className="custom-btn login-btn" onClick={this.onPurchaseTicket.bind(this, marketplace, ticketPrice, initiator)}>Buy</button></td>
          </tr>
        );
      }));

      this.setState({ festivals: fests });
    } catch (err) {
      renderNotification('danger', 'Error', err.message);
      console.log('Error while updating the fetivals', err);
    }
  }

  onPurchaseTicket = async (marketplace, ticketPrice, initiator) => {
    try {
      
      //const marketplaceInstance = await FestivalMarketplace(marketplace);
      await web3.eth.sendTransaction({
        from: initiator,
        to:"0x2b13a24dd108db3423093fe0078b0f8929ca10dc",
        gas: 6700000,
        data: festToken.methods.approve(marketplace, ticketPrice).encodeABI()
      }).on('transactionHash', async function(hash){
        await web3.eth.sendTransaction({
          from: initiator,
          to:"0x565e2450346c0EB984897122e9D2a3fe58485999",
          gas: 6700000,
          data: FestivalMarketplace.methods.purchaseTicket().encodeABI()
        })
      })
      .on('receipt', function(receipt){
          console.log('receipt');
      })
      .on('confirmation', function(confirmationNumber, receipt) {
          console.log('confirmation', confirmationNumber);
      })
      .on('error', function (error){ // If a out of gas error, the second parameter is the receipt
        console.log(error);
      }); 
      // const temp = marketplaceInstance.methods.purchaseTicket().encodeABI();
      // await web3.eth.sendTransaction({
      //   from: initiator,
      //   //to:marketplace,
      //   gas: 6700000,
      //   data: marketplaceInstance.methods.purchaseTicket().encodeABI()
      // })
      //await festToken.methods.approve(marketplace, ticketPrice).send({ from: initiator, gas: 6700000 });
      //await marketplaceInstance.methods.purchaseTicket().send({ from: initiator, gas: 6700000 });
      await this.updateFestivals();

      renderNotification('success', 'Success', `Ticket for the Festival purchased successfully!`);
    } catch (err) {
      console.log('Error while creating new festival', err);
      renderNotification('danger', 'Error', err.message);
    }
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div class="container " class="col s12 m6 offset-m3 l4 offset-l4 z-depth-6 card-panel">
        <h4 class="center">Purchase NFTs</h4>
        <table id='requests' class="responsive-table striped" >
          <thead>
            <tr>
              <th key='name' class="center">Name</th>
              <th key='price' class="center">Price</th>
              <th key='left' class="center">NFT Left</th>
              <th key='purchase' class="center">Purchase</th>
            </tr>
          </thead>
          <tbody class="striped highlight">
            {this.state.festivals}
          </tbody>
        </table>
      </div >
    )
  }
}

export default Purchase;  