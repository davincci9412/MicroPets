const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const request = require('postman-request');

const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Tokenbsc = require('../models/Tokenbsc');
const Tokengecko = require('../models/Tokengecko');

router.get('/exchange2', (req, res) => {
	var url  = 'https://api-cloud.bitmart.com/spot/v1/ticker?symbol='+req.query.symbol+'_USDT'
	request(url, function (error, response, body) {
		return res.status(200).json(body);
	});
});

router.get('/exchange3', (req, res) => {
	var url  = 'https://whitebit.com/api/v1/public/ticker?market='+req.query.symbol+'_USDT'
	request(url, function (error, response, body) {
		return res.status(200).json(body);
	});
});

router.get('/transaction', (req, res) => {
	var url  = "https://api.coingecko.com/api/v3/coins/binance-smart-chain/contract/"+req.query.token+"/market_chart/?vs_currency=usd&days=1"
	request(url, function (error, response, body) {
		return res.status(200).json(body);
	});
});

router.get('/trend', (req, res) => {
	var url  = "https://api.coingecko.com/api/v3/coins/"+req.query.chain+"/market_chart?vs_currency=usd&days=2"
  
	request(url, function (error, response, body) {
    //body = {"prices":[[1623816165025,0.23062592110552738],[1623873829309,0.23062592110552738],[1623888310807,0.23062592110552738],[1623899023254,0.23062592110552738],[1623902640510,0.23062592110552738],[1623913459011,0.23062592110552738],[1623931331763,0.23062592110552738],[1623935086133,0.23062592110552738],[1623938675631,0.23062592110552738],[1623936683000,0.23062592110552738]],"market_caps":[[1623816165025,16886.849426462857],[1623873829309,16886.849426462857],[1623888310807,16886.849426462857],[1623899023254,16886.849426462857],[1623902640510,16886.849426462857],[1623913459011,16886.849426462857],[1623931331763,16886.849426462857],[1623935086133,16886.849426462857],[1623938675631,16886.849426462857],[1623936683000,16886.849426462857]],"total_volumes":[[1623816165025,0.0],[1623873829309,0.0],[1623888310807,0.0],[1623899023254,0.0],[1623902640510,0.0],[1623913459011,0.0],[1623931331763,0.0],[1623935086133,0.0],[1623938675631,0.0],[1623936683000,0.0]]}
		return res.status(200).json(body);
	});
});


module.exports = router;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}