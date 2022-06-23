import Provider from './Provider';
import AkitaNFTABI from '../abi/contracts/AkitaNFT.json';
import jsonData from '../components/data.json';

const provider = new Provider();

class AkitaNFT {
  constructor() {
    const web3 = provider.web3;
    const loadData = JSON.parse(JSON.stringify(jsonData));
    
    this.instance = new web3.eth.Contract(
      AkitaNFTABI.abi,
      loadData[4].address
    );
  }

  getInstance = () => this.instance;
}

const akitaNFT = new AkitaNFT();
Object.freeze(akitaNFT);

export default akitaNFT.getInstance();
