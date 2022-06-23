import Provider from './Provider';
import PuppyNFTABI from '../abi/contracts/PuppyNFT.json';
import jsonData from '../components/data.json';

const provider = new Provider();

class PuppyNFT {
  constructor() {
    const web3 = provider.web3;
    const loadData = JSON.parse(JSON.stringify(jsonData));
    
    this.instance = new web3.eth.Contract(
      PuppyNFTABI.abi,
      loadData[3].address
    );
  }

  getInstance = () => this.instance;
}

const puppyNFT = new PuppyNFT();
Object.freeze(puppyNFT);

export default puppyNFT.getInstance();
