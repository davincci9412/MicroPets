// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const config = require('../config/mongoose'); 
// Create Product Schema
const ProductSchema = new config.Schema({
  /**
   * product creator's ID
   */
  creator_id: config.mongoose.Schema.Types.ObjectId,
  /**
   * product name
   */
  product_name: {
    type: String,
    required: true
  },
  /**
   * product type
   */
  product_type: {
    type: String,
	enum: [
      "Shop",
      "Market",
    ],
    default: "Undefined"
  },
  /**
   * product price
   */
  product_price: {
    type: Number
  },
  /**
   * product amount
   */
  product_amount: {
    type: Number,
  },
  /**
   * product image url
   */
  product_image: {
    type: String
  },
  /**
   * Date that the product is registered.
   */
  create_date: {
	type: Date,
	default: Date.now 	
  }
});

module.exports = Product = config.mongoose.model("products", ProductSchema);
