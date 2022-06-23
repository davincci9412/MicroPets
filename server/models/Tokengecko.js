// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const config = require('../config/mongoose'); 
config.mongoose.set('useFindAndModify', false);

// Create Token Schema for coingecko API
const TokengeckoSchema = new config.Schema({
  /**
   * token ID
   */
  token_id: {
    type: String
  },
  /**
   * token symbol
   */
  token_symbol: {
    type: String
  },
  /**
   * token name
   */
  token_name: {
    type: String
  },
  /**
   * token platform
   */
  token_platform: {
    type: String
  },
  /**
   * token contract address
   */
  token_address: {
    type: String
  },
  /**
   * Date that the token information is updated
   */
  token_update: {
	type: Date,
	default: Date.now 	
  },
  /**
   * token price
   */
  token_price: {
    type: String
  },
  /**
   * token contract address
   */
  token_24h_change: {
    type: String
  },
  /**
   * Date that the token is registered
   
  create: {
	type: Date,
	default: Date.now 	
  },*/
  /**
   * Date that the token information is updated
   */
  price_update: {
	type: Date	
  }
});

module.exports = Tokengecko = config.mongoose.model("tokengeckos", TokengeckoSchema);
