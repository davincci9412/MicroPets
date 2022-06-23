const config = require('../config/mongoose'); 
const dotenv = require('dotenv');
const env = dotenv.config().parsed;

const express = require('express');
const router = express.Router();
const request = require('postman-request');

const User = require('../models/User');
const Product = require('../models/Product');

router.get('/products', (req, res) => {	
	Product.find().lean().sort({ create_date: "asc"}).then(results => {
		if (results.length >0){
			return res.status(200).json(results); // Success					
		} else {
			return res.status(200).json({status:"zero"}); // fail
		}
	})
});

router.get('/product', (req, res) => {
	Product.findById(req.query.product_id).lean().then((result)=>{
		return res.status(200).json(result); //success
	}).catch(function(error){
		return res.status(200).json({status:"zero"}); //fail
	});
});

module.exports = router;