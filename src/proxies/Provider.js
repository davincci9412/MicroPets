import Web3 from 'web3';

class Provider {
  constructor() {
   
    this.web3 = new Web3(
      //new Web3.providers.HttpProvider('http://127.0.0.1:8545'),
      //new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' ),     
      new Web3.providers.HttpProvider('https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' ),     
      
    );
  }
}

export default Provider;
