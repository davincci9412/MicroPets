// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const config = require('../config/mongoose'); 
config.mongoose.set('useFindAndModify', false);


// Create Transactions Schema for BSCScan API
const TokenTransactionsSchema = new config.Schema({
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
   * token decimal
   */
  tokenDecimal: {
    type: Number
  },
  /**
   * transaction hash 
   */
  hash: {
    type: String
  },
  /**
   * the latest transaction timestamp 
   */
  timeStamp: {
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
   * transaction value 
   */
  value: {
    type: String
  },
  /**
   * token address 
   */
  contractAddress: {
    type: String
  },
  /**
   * Date that the transaction is added.
   */
  create: {
	type: Date,
	default: Date.now 	
  }
});

module.exports = TokenTransactions = config.mongoose.model("tokenTransactions", TokenTransactionsSchema);
