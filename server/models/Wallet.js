// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const config = require('../config/mongoose'); 
// Create Wallet Schema
const WalletSchema = new config.Schema({
  /**
   * wallet owner's user ID
   */
  user_id: config.mongoose.Schema.Types.ObjectId,
  /**
   * wallet address
   */
  wallet_address: {
    type: String,
    required: true
  },
  /**
   * chain ID that the wallet belongs to
   */
  chain_id: {
    type: Number,
	enum: [
	  0,
      1,
      2,
      3,
	  4,
	  5,
	  6,
    ],
    default: 0
  },
  /**
   * chain name that the wallet belongs to
   */
  chain_name: {
    type: String,
	enum: [
      "BSC Chain",
      "ETH Chain",
      "Undefined",
    ],
    default: "Undefined"
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
   * number of BNB transactions for ROI
   */
  rois: {
    type: Number,
	default: 0
  },
  /**
   * number of token transactions for ROI
   */
  tokenRois: {
    type: Number,
	default: 0
  },
  /**
   * the timestamp of the last BNB transaction
   */
  timeStamp: {
    type: Number,
	default: 0
  },
  /**
   * the timestamp of the last Token transaction
   */
  tokenTimeStamp: {
    type: Number,
	default: 0
  },
  /**
   * the timestamp of the last BNB transaction for ROI
   */
  roiTimeStamp: {
    type: Number,
	default: 0
  },
  /**
   * the timestamp of the last Token transaction for ROI
   */
  roiTokenTimeStamp: {
    type: Number,
	default: 0
  },
  /**
   * ROI status(0: incomplete, 1: BNB ROI complete, 2: total complete)
   */
  status: {
    type: Number,
	enum: [
	  0,
      1,
      2
    ],
    default: 0
  },
  /**
   * Date that the wallet was registered.
   */
  create: {
	type: Date,
	default: Date.now 	
  }
});

module.exports = Wallet = config.mongoose.model("wallets", WalletSchema);
