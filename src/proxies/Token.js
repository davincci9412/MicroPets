import Provider from './Provider';
import TokenABI from '../abi/contracts/Token.json';
import jsonData from '../components/data.json';

const provider = new Provider();

class Token {
  constructor() {
    const web3 = provider.web3;
    const loadData = JSON.parse(JSON.stringify(jsonData));
    this.instance = new web3.eth.Contract(
      TokenABI.abi,
      loadData[1].address
    );
  }

  getInstance = () => this.instance;
}

const token = new Token();
Object.freeze(token);

export default token.getInstance();
