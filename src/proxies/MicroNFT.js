import Provider from './Provider';
import MicroNFTABI from '../abi/contracts/MicroNFT.json';
import jsonData from '../components/data.json';

const provider = new Provider();

class MicroNFT {
  constructor() {
    const web3 = provider.web3;
    const loadData = JSON.parse(JSON.stringify(jsonData));
    
    this.instance = new web3.eth.Contract(
      MicroNFTABI.abi,
      loadData[8].address
    );
  }

  getInstance = () => this.instance;
}

const microNFT = new MicroNFT();
Object.freeze(microNFT);

export default microNFT.getInstance();
