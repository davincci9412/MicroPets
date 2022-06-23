import Provider from './Provider';
import CrateNFTABI from '../abi/contracts/CrateNFT.json';
import jsonData from '../components/data.json';

const provider = new Provider();

class CrateNFT {
  constructor() {
    const web3 = provider.web3;
    const loadData = JSON.parse(JSON.stringify(jsonData));
    
    this.instance = new web3.eth.Contract(
      CrateNFTABI.abi,
      loadData[3].address
    );
  }

  getInstance = () => this.instance;
}

const crateNFT = new CrateNFT();
Object.freeze(crateNFT);

export default crateNFT.getInstance();
