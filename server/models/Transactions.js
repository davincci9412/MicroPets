// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const config = require('../config/mongoose'); 
config.mongoose.set('useFindAndModify', false);


// Create Transactions Schema for BSCScan API
const TransactionsSchema = new config.Schema({
  /**
   * wallet address
   */
  wallet_address: {
    type: String,
    required: true
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
   * Date that the transaction is added.
   */
  create: {
	type: Date,
	default: Date.now 	
  }
});

module.exports = Transactions = config.mongoose.model("transactions", TransactionsSchema);
