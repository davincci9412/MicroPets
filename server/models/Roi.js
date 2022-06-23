// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const config = require('../config/mongoose'); 
config.mongoose.set('useFindAndModify', false);

// Create Roi Schema of the transactions to calculate the buying price
const RoiSchema = new config.Schema({
  /**
   * wallet address
   */
  wallet_address: {
    type: String,
    required: true
  },  
  /**
   * token name
   */
  tokenName: {
    type: String
  },
  /**
   * token symbol
   */
  tokenSymbol: {
    type: String
  },
  /**
   * transaction timestamp
   */
  timeStamp: {
    type: String
  },
  /**
   * transaction hash
   */
  hash: {
    type: String
  },
  /**
   * sender address
   */
  from: {
    type: String
  },
  /**
   * receiver address
   */
  to: {
    type: String
  },
  /**
   * transaction quantity
   */
  qty: {
    type: String
  },
  /**
   * transaction value(qty*token_average) when the transaction occurs
   */
  token_acquire: {
    type: String
  },
  /**
   * token address 
   */
  contractAddress: {
    type: String
  },
  /**
   * Date that the data is added.
   */
  create: {
	type: Date,
	default: Date.now 	
  }
});

module.exports = Roi = config.mongoose.model("roi", RoiSchema);
