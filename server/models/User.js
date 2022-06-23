//const mongoose = require("mongoose");
//const Schema = mongoose.Schema;
const config = require('../config/mongoose'); 



// Create User Schema
const UserSchema = new config.Schema({
  /**
   * user's email
   */
  email: {
    type: String,
    required: true
  },
  /**
   * user's password
   */
  password: {
    type: String,
    required: true
  },
  /**
   * User's status(if the email is verified, then "true")
   */
  verified: {
	type: Boolean,
	default: false 	
  },
  /**
   * Date that the user registers
   */
  create: {
	type: Date,
	default: Date.now 	
  }
});

module.exports = User = config.mongoose.model("users", UserSchema);
