const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Token Schema for bscscan API
const TokenbscSchema = new Schema({
  /**
   * token ID
   */
  token_id: {
    type: String,
    required: true
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
   * Date that the token is registered
   */
  create: {
	type: Date,
	default: Date.now 	
  },
  /**
   * Date that the token information is updated
   */
  update: {
	type: Date,
	default: Date.now 	
  }
});

module.exports = Tokenbsc = mongoose.model("tokenbscs", TokenbscSchema);
