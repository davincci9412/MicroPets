/**
 * Author : Vadim
 * Create Date : 8/16/2021
 * Email : snowfirst312@outlook.com
 * Skype : live:.cid.d66694e683af316e
 * Description : MicroPets project
 */

 import React from 'react';
 import Web3 from 'web3';
 import PuppyNFT from '../../proxies/PuppyNFT';
 import Market from '../../proxies/Market';
 import jsonData from '../data.json';
 import { toast } from 'react-toastify';
 
 let web3;
 

class AdminContent extends React.Component {
  
  constructor(props) {
    super(props);
    const loadData = JSON.parse(JSON.stringify(jsonData));
    this.state = { temps: [], PuppyAddress:"", MarketAddress:"", data:loadData};
    web3 = new Web3(window.ethereum);    
  }

  async componentDidMount() {
    if (window.ethereum !== undefined) {
      if (window.ethereum.isConnected()) {  
        let adminLogin=false;
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (Array.isArray(accounts)){
          const temps =this.state.data[0].address.split(",");
          temps.map((temp, i)=>{
            if (accounts[0].toLowerCase() === temp.toLowerCase()) {
              document.getElementById("admin").classList.remove("no-show");
              adminLogin = true;
            };
            return i;
          }) 
          if (!adminLogin){
            if (!document.getElementById("admin").classList.contains("no-show")){
              document.getElementById("admin").className += " no-show";
            }
            window.location.href="/shop";
          }           
          this.setState({"status":true});
        } else {
          window.location.href="/shop";
        }
      } else {
        window.ethereum.on('connect', () => {
          window.location.reload();
        });
        window.ethereum.on('connect', window.ethereum.chainId);
      }
    } 

    const initiator = await web3.eth.getCoinbase();
    const cratePrice = await PuppyNFT.methods.getCratePrice().call({from: initiator});
    this.setState({price:web3.utils.fromWei(cratePrice, 'ether')});
    document.getElementById("price").value=web3.utils.fromWei(cratePrice, 'ether');
    
    this.setState({MarketAddress: this.state.data[2].address});         
    this.setState({PuppyAddress: this.state.data[3].address});
    await this.updateTables();
  }

  updateTables = async () => {
    try {
        const initiator = await web3.eth.getCoinbase();   
      
        let name;
        let price;
        let totalSupply;
        let saleId;  
            
        name = "Akita";
        price = await PuppyNFT.methods.getAkitaPrice().call({from:initiator});
        totalSupply = await PuppyNFT.methods.puppyCounts(0).call({from:initiator});
        saleId = await PuppyNFT.methods.getNextSalePuppyId(0).call({from:initiator});

        const akita = <tr>
          <td className="center">{name}</td>
          <td className="center">{web3.utils.fromWei(price, 'ether')}</td>
          <td className="center">{totalSupply}</td>
          <td className="center">{saleId}</td>
          <td className="center">{totalSupply - saleId}</td>
        </tr>;
        this.setState({akita:akita});

        name = "Kishu";
        price = await PuppyNFT.methods.getKishuPrice().call({from:initiator});
        totalSupply = await PuppyNFT.methods.puppyCounts(1).call({from:initiator});
        saleId = await PuppyNFT.methods.getNextSalePuppyId(1).call({from:initiator});
        const kishu = <tr>
          <td className="center">{name}</td>
          <td className="center">{web3.utils.fromWei(price, 'ether')}</td>
          <td className="center">{totalSupply}</td>
          <td className="center">{saleId}</td>
          <td className="center">{totalSupply - saleId}</td>
        </tr>;
        this.setState({kishu:kishu});

        name = "Hokkaido";
        price = await PuppyNFT.methods.getHokkaidoPrice().call({from:initiator});
        totalSupply = await PuppyNFT.methods.puppyCounts(2).call({from:initiator});
        saleId = await PuppyNFT.methods.getNextSalePuppyId(2).call({from:initiator});
        const hokkaido = <tr>
          <td className="center">{name}</td>
          <td className="center">{web3.utils.fromWei(price, 'ether')}</td>
          <td className="center">{totalSupply}</td>
          <td className="center">{saleId}</td>
          <td className="center">{totalSupply - saleId}</td>
        </tr>;
        this.setState({hokkaido:hokkaido});

        name = "Shiba";
        price = await PuppyNFT.methods.getShibaPrice().call({from:initiator});
        totalSupply = await PuppyNFT.methods.puppyCounts(3).call({from:initiator});
        saleId = await PuppyNFT.methods.getNextSalePuppyId(3).call({from:initiator});
        const shiba = <tr>
          <td className="center">{name}</td>
          <td className="center">{web3.utils.fromWei(price, 'ether')}</td>
          <td className="center">{totalSupply}</td>
          <td className="center">{saleId}</td>
          <td className="center">{totalSupply - saleId}</td>
        </tr>;
        this.setState({shiba:shiba});

        name = "Micro Shiba";
        price = await PuppyNFT.methods.getMicroPrice().call({from:initiator});
        totalSupply = await PuppyNFT.methods.puppyCounts(4).call({from:initiator});
        saleId = await PuppyNFT.methods.getNextSalePuppyId(4).call({from:initiator});
        const micro = <tr>
          <td className="center">{name}</td>
          <td className="center">{web3.utils.fromWei(price, 'ether')}</td>
          <td className="center">{totalSupply}</td>
          <td className="center">{saleId}</td>
          <td className="center">{totalSupply - saleId}</td>
        </tr>;
        this.setState({micro:micro}); 

        name = "Special Editions";
        price = await PuppyNFT.methods.getSpecialPrice().call({from:initiator});
        totalSupply = await PuppyNFT.methods.puppyCounts(5).call({from:initiator});
        saleId = await PuppyNFT.methods.getNextSalePuppyId(5).call({from:initiator});
        const special = <tr>
          <td className="center">{name}</td>
          <td className="center">{web3.utils.fromWei(price, 'ether')}</td>
          <td className="center">{totalSupply}</td>
          <td className="center">{saleId}</td>
          <td className="center">{totalSupply - saleId}</td>
        </tr>;
        this.setState({special:special}); 
    } catch (err) {
      toast.dismiss();  
      toast.error("Error while fetching the crates", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:5000});
    }
  }

  onMint = async (e) => {
    try {
      toast.info("Minting new NFTs...", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:false});
      e.preventDefault();

      const organiser = await web3.eth.getCoinbase();
      const { NFTAddress, supply } = this.state;
      const batches = Math.ceil(supply / 100);
      let batchSupply = 100;
      let curCount = 0
      let prevCount = 0
      if (supply < 101) {
        switch(NFTAddress) {
          case "1":  
            await web3.eth.sendTransaction({
              from: organiser,
              to:this.state.PuppyAddress,
              gas: 6700000,
              data:PuppyNFT.methods.bulkMintPuppys(supply, this.state.MarketAddress, 0).encodeABI()
            }).on('receipt', async function(receipt){           
              toast.dismiss();    
              window.location.reload();
            });
            return false;
          case "2":  
            await web3.eth.sendTransaction({
              from: organiser,
              to:this.state.PuppyAddress,
              gas: 6700000,
              data:PuppyNFT.methods.bulkMintPuppys(supply, this.state.MarketAddress, 1).encodeABI()
            }).on('receipt', async function(receipt){           
              toast.dismiss();    
              window.location.reload();
            });
            return false;
          case "3":  
            await web3.eth.sendTransaction({
              from: organiser,
              to:this.state.PuppyAddress,
              gas: 6700000,
              data:PuppyNFT.methods.bulkMintPuppys(supply, this.state.MarketAddress, 2).encodeABI()
            }).on('receipt', async function(receipt){           
              toast.dismiss();    
              window.location.reload();
            });
            return false;
          case "4":  
            await web3.eth.sendTransaction({
              from: organiser,
              to:this.state.PuppyAddress,
              gas: 6700000,
              data:PuppyNFT.methods.bulkMintPuppys(supply, this.state.MarketAddress, 3).encodeABI()
            }).on('receipt', async function(receipt){           
              toast.dismiss();    
              window.location.reload();
            });
            return false;
          case "5":  
            await web3.eth.sendTransaction({
              from: organiser,
              to:this.state.PuppyAddress,
              gas: 6700000,
              data:PuppyNFT.methods.bulkMintPuppys(supply, this.state.MarketAddress, 4).encodeABI()
            }).on('receipt', async function(receipt){           
              toast.dismiss();    
              window.location.reload();
            });
            return false;
          case "6":  
            await web3.eth.sendTransaction({
              from: organiser,
              to:this.state.PuppyAddress,
              gas: 6700000,
              data:PuppyNFT.methods.bulkMintPuppys(supply, this.state.MarketAddress, 5).encodeABI()
            }).on('receipt', async function(receipt){           
              toast.dismiss();    
              window.location.reload();
            });
            return false;
          default : return false;
        }        
      } else {
        for (let i = 0; i < batches; i++) {
          prevCount = curCount;
          curCount += 100;
          if (supply < curCount) {
            batchSupply = supply - prevCount;
          }
          switch(NFTAddress) {
            case "1":  
              await web3.eth.sendTransaction({
                from: organiser,
                to:this.state.PuppyAddress,
                gas: 6700000,
                data:PuppyNFT.methods.bulkMintPuppys(batchSupply, this.state.MarketAddress, 0).encodeABI()
              }).on('receipt', async function(receipt){           
                toast.dismiss();    
                window.location.reload();
              });
              return false;
            case "2":  
              await web3.eth.sendTransaction({
                from: organiser,
                to:this.state.PuppyAddress,
                gas: 6700000,
                data:PuppyNFT.methods.bulkMintPuppys(batchSupply, this.state.MarketAddress, 1).encodeABI()
              }).on('receipt', async function(receipt){           
                toast.dismiss();    
                window.location.reload();
              });
              return false;
            case "3":  
              await web3.eth.sendTransaction({
                from: organiser,
                to:this.state.PuppyAddress,
                gas: 6700000,
                data:PuppyNFT.methods.bulkMintPuppys(batchSupply, this.state.MarketAddress, 2).encodeABI()
              }).on('receipt', async function(receipt){           
                toast.dismiss();    
                window.location.reload();
              });
              return false;
            case "4":  
              await web3.eth.sendTransaction({
                from: organiser,
                to:this.state.PuppyAddress,
                gas: 6700000,
                data:PuppyNFT.methods.bulkMintPuppys(batchSupply, this.state.MarketAddress, 3).encodeABI()
              }).on('receipt', async function(receipt){           
                toast.dismiss();    
                window.location.reload();
              });
              return false;
            case "5":  
              await web3.eth.sendTransaction({
                from: organiser,
                to:this.state.PuppyAddress,
                gas: 6700000,
                data:PuppyNFT.methods.bulkMintPuppys(batchSupply, this.state.MarketAddress, 4).encodeABI()
              }).on('receipt', async function(receipt){           
                toast.dismiss();    
                window.location.reload();
              });
              return false;
            case "6":  
              await web3.eth.sendTransaction({
                from: organiser,
                to:this.state.PuppyAddress,
                gas: 6700000,
                data:PuppyNFT.methods.bulkMintPuppys(batchSupply, this.state.MarketAddress, 5).encodeABI()
              }).on('receipt', async function(receipt){           
                toast.dismiss();    
                window.location.reload();
              });
              return false;
            default : return false;
          }

        }
      }
      await this.updateTables();                
    } catch (err) {
      toast.dismiss();  
      toast.error("rror while minting new NFTs", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:5000});
    }
  }

  onCrate = async (e) => {
    try {
      toast.info("Changing the crate price...", {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:false});
      e.preventDefault();

      const organiser = await web3.eth.getCoinbase();
      const { price } = this.state;
          
      await web3.eth.sendTransaction({
        from: organiser,
        to:this.state.PuppyAddress,
        //to:this.state.MarketAddress,
        gas: 6700000,
        data:PuppyNFT.methods.setCratePrice(web3.utils.toWei(price, 'ether')).encodeABI()
        //data:Market.methods.DepositToken(web3.utils.toWei(price, 'ether')).encodeABI()
      }).on('receipt', async function(receipt){           
        toast.dismiss();    
        window.location.reload();
      });        
    } catch (err) {
      toast.dismiss();  
      toast.error(err.message, {position: toast.POSITION.BOTTOM_RIGHT,  autoClose:5000});
    }
  }

  selectChangeHandler = async (e) => {
      const state = this.state;
      state[e.target.name] = e.target.value;
      this.setState(state);
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render(){
    return <div className="admin">
        <section className="container-fluid">       
            <h1 className="mb-5 text-center">DASHBOARD</h1>
            <div className="row">
              <div className="col-md-7 mb-4">
                <div className="feature-item">
                  <h2>NFT STATUS</h2>
                  <table id='requests' className="table" >
                    <thead>
                      <tr>
                        <th key='name' className="center">Name</th>
                        <th key='price' className="center">Price</th>
                        <th key='total' className="center">Total NFT</th>
                        <th key='sold' className="center">Sold NFT</th>
                        <th key='remain' className="center">Remnant NFT</th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {this.state.crate}
                      {this.state.akita}
                      {this.state.kishu}
                      {this.state.hokkaido}
                      {this.state.shiba}
                      {this.state.micro}
                      {this.state.special}
                    </tbody>
                  </table>   
                </div>          
              </div>
              <div className="col-md-5 mb-4">
                <div className="feature-item ">
                  <h2 className="mb-5">NFT MINT</h2>
                  <div className="text-left">
                    <div className="form-group mb-3">
                      <label>NFT type : </label>
                      <select className="form-control" name='NFTAddress' onChange={this.selectChangeHandler}>
                        <option defaultValue="">Select NFT type</option>
                        <option value="1" >Akita</option>  
                        <option value="2" >Kishu</option>  
                        <option value="3" >Hokkaido</option>  
                        <option value="4" >Shiba</option>  
                        <option value="5" >Micro Shiba</option>  
                        <option value="6" >Special Editions</option>  
                      </select>  
                    </div>
                    <div className="form-group mb-4">
                      <label>Number to mint : </label>
                      <input name="supply" placeholder="0" type="text" className="form-control" onChange={this.inputChangedHandler} />
                    </div>
                    <div className="text-center my-5">
                      <button type="submit" className="btn btn-purple" onClick={this.onMint}>MINT</button>
                    </div>
                  </div>
                  <h2 className="my-5">CRATE PRICE</h2>
                  <div className="text-left">
                    <div className="form-group mb-4">
                      <label>NEW PRICE : </label>
                      <input id="price" name="price" placeholder="0" type="text" className="form-control" onChange={this.inputChangedHandler} />
                    </div>
                    <div className="text-center my-5">
                      <button type="submit" className="btn btn-purple" onClick={this.onCrate}>CHANGE</button>
                    </div>
                  </div>
                </div>                
              </div>
            </div>
        </section>
    </div> 
  }
}
export default AdminContent;
