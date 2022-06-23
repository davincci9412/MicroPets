import Provider from './Provider';
import HokkaidoNFTABI from '../abi/contracts/HokkaidoNFT.json';
import jsonData from '../components/data.json';

const provider = new Provider();

class HokkaidoNFT {
  constructor() {
    const web3 = provider.web3;
    const loadData = JSON.parse(JSON.stringify(jsonData));
    
    this.instance = new web3.eth.Contract(
      HokkaidoNFTABI.abi,
      loadData[6].address
    );
  }

  getInstance = () => this.instance;
}

const hokkaidoNFT = new HokkaidoNFT();
Object.freeze(hokkaidoNFT);

export default hokkaidoNFT.getInstance();
