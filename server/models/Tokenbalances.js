// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const config = require('../config/mongoose'); 
config.mongoose.set('useFindAndModify', false);

// Create Tokenbalances Schema for BSCScan API
const TokenbalancesSchema = new config.Schema({
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
   * token address
   */
  contractAddress: {
    type: String
  },
  /**
   * token quantity(this is the quantity that is divided by token Decimal)
   */
  qty: {
    type: Number
  },
  /**
   * Date that the transaction is added.
   */
  create: {
	type: Date,
	default: Date.now 	
  }
});

module.exports = Tokenbalances = config.mongoose.model("tokenbalances", TokenbalancesSchema);
