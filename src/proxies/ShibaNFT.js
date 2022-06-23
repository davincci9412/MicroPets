import Provider from './Provider';
import ShibaNFTABI from '../abi/contracts/ShibaNFT.json';
import jsonData from '../components/data.json';

const provider = new Provider();

class ShibaNFT {
  constructor() {
    const web3 = provider.web3;
    const loadData = JSON.parse(JSON.stringify(jsonData));
    
    this.instance = new web3.eth.Contract(
      ShibaNFTABI.abi,
      loadData[7].address
    );
  }

  getInstance = () => this.instance;
}

const shibaNFT = new ShibaNFT();
Object.freeze(shibaNFT);

export default shibaNFT.getInstance();
