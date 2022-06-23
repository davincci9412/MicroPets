import Provider from './Provider';
import MarketABI from '../abi/contracts/Market.json';
import jsonData from '../components/data.json';

const provider = new Provider();

class Market {
  constructor() {
    const web3 = provider.web3;
    const loadData = JSON.parse(JSON.stringify(jsonData));

    this.instance = new web3.eth.Contract(
      MarketABI.abi,
      loadData[2].address
    );
  }

  getInstance = () => this.instance;
}

const market = new Market();
Object.freeze(market);

export default market.getInstance();
