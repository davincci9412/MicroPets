import Provider from './Provider';
import KishuNFTABI from '../abi/contracts/KishuNFT.json';
import jsonData from '../components/data.json';

const provider = new Provider();

class KishuNFT {
  constructor() {
    const web3 = provider.web3;
    const loadData = JSON.parse(JSON.stringify(jsonData));
    
    this.instance = new web3.eth.Contract(
      KishuNFTABI.abi,
      loadData[5].address
    );
  }

  getInstance = () => this.instance;
}

const kishuNFT = new KishuNFT();
Object.freeze(kishuNFT);

export default kishuNFT.getInstance();
