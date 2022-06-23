// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const config = require('../config/mongoose'); 
// Create History of My Address Tracker page
const HistorySchema = new config.Schema({
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
  wallet_chain: {
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
   * name of the wallet on "Address Tracker" page
   */
  wallet_name: {
	type: String
  },
  /**
   * describe of the wallet on "Address Tracker" page
   */
  wallet_description: {
	type: String
  },
  /**
   * Date that the wallet was registered.
   */
  create: {
	type: Date,
	default: Date.now 	
  }
});

module.exports = History = config.mongoose.model("histories", HistorySchema);
