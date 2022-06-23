const express = require('express');
const dotenv = require('dotenv');
const env = dotenv.config().parsed;
const config = require('../config/mongoose'); 

const router = express.Router();
const request = require('postman-request');
const promiseForeach = require('promise-foreach')

const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Tokengecko = require('../models/Tokengecko');
const Transactions = require('../models/Transactions');
const TokenTransactions = require('../models/TokenTransactions');
const Tokenbalances = require('../models/Tokenbalances');
const Roi = require('../models/Roi');

router.get('/wallet', (req, res) => {
	wallet = {user_id:req.query.id, chain_id:req.query.chain_id, chain_name:req.query.chain_name, wallet_address:req.query.wallet_address, tokenName:req.query.tokenName,  tokenSymbol:req.query.tokenSymbol, tokenDecimal:req.query.tokenDecimal, contractAddress:req.query.contractAddress, create:new Date()};
	Wallet.findOneAndUpdate({ wallet_address: req.query.wallet_address }, wallet).then((result)=>{
		if (result == null ){
			var url = 'https://api.bscscan.com/api?module=account&action=balance&address='+req.query.wallet_address+'&tag=latest&apikey=536NCBDYVREIJDEM66KFETYK6N76PY89GT'
			request(url, function (error, response, body) {
				results = JSON.parse(body);
				if (results.message === "OK"){
					wallet.qty = (Number(results.result)/(10**req.query.tokenDecimal))
					Wallet.create(wallet).then((result)=>{
						result.create = "create";
						return res.status(200).json(result);
					})
				} 
			})	
		} else {
			return res.status(200).json(result);
		}
	})
});

router.get('/token', (req, res) => {
	Tokenbalances.find({wallet_address:req.query.wallet_address}).lean().sort({ qty : "desc"}).then((results)=>{
		if (results.length > 0) {
			results = results.concat([{tokenSymbol:"BNB"}]);
			var ids = results.map(function(result) { return (result.tokenSymbol).toLowerCase(); });			
			Tokengecko.find({'token_symbol': {'$in':ids}}).then((result)=>{
					return res.status(200).json(result);
			})
		} else {
			Tokengecko.find().lean().then((result)=>{
				return res.status(200).json(result);
			})
		}
	})
	
});

router.get('/tokenBalances', (req, res) => {
	Tokenbalances.find({wallet_address:req.query.wallet_address}).lean().sort({ qty : "desc"}).then((result)=>{
		if (result.length == 0){
			token_list = [];
			//var url  ='https://api.covalenthq.com/v1/56/address/'+req.query.wallet_address+'/balances_v2/?nft=true&no-nft-fetch=true&key=ckey_daca4efda85b4837961727b8cbb'
			url = 'https://api.bscscan.com/api?module=account&action=addresstokenbalance&address='+req.query.wallet_address+'&page=1&offset=1000&apikey=536NCBDYVREIJDEM66KFETYK6N76PY89GT'
			request(url, function (error, response, body) {
				results = JSON.parse(body);
				if (results.result.length >= 1) {
					results.result.map((data, i) => {
						temp1 = Number(data.TokenQuantity)/(10**data.TokenDivisor)
						token_list = token_list.concat([{wallet_address:req.query.wallet_address, tokenName:data.TokenName, tokenSymbol:data.TokenSymbol, tokenDecimal:data.TokenDivisor, qty:temp1, contractAddress:data.TokenAddress}]);           
					})
				}				
				Tokenbalances.insertMany(token_list).then(function(){
					return res.status(200).json(token_list); // Success
				}).catch(function(error){
					return res.status(200).json(token_list); // Failure
				});				
			})	
		} else {
			return res.status(200).json(result); // return the DB data
		}
	})
});

router.get('/transactions', (req, res) => {
	Transactions.find({wallet_address:req.query.wallet_address}).lean().sort({ qty : "desc"}).then((result)=>{
		if (result.length == 0){
			var url  ='https://api.bscscan.com/api?module=account&action=txlist&address='+req.query.wallet_address+'&startblock=1&endblock=99999999&sort=desc&apikey=536NCBDYVREIJDEM66KFETYK6N76PY89GT'
			request(url, function (error, response, body) {
				transactions = []
				timeStamp = 0;
				results = JSON.parse(body);
				results.result.map((result, i)=>{
					if(i==0) timeStamp = result.timeStamp;
					transactions = transactions.concat([{wallet_address:req.query.wallet_address, hash:result.hash, timeStamp:result.timeStamp, from:result.from, to:result.to, value:result.value}]);
				})
				Transactions.insertMany(transactions).then(function(){
					Wallet.findOneAndUpdate({ wallet_address: req.query.wallet_address }, {timeStamp:timeStamp}).then((result)=>{
						return res.status(200).json(transactions); // Success
					}).catch(function(error){
						return res.status(200).json(transactions); // Failure
					})
				}).catch(function(error){
					return res.status(200).json(transactions); // Failure
				});	
			});
		} else {
			return res.status(200).json(result); // return the DB data
		}
	})
});

router.get('/tokenTransactions', (req, res) => {
	TokenTransactions.find({wallet_address:req.query.wallet_address}).lean().sort({ qty : "desc"}).then((result)=>{
		if (result.length == 0){
			var url  ='https://api.bscscan.com/api?module=account&action=tokentx&address='+req.query.wallet_address+'&startblock=1&endblock=99999999&sort=desc&apikey=536NCBDYVREIJDEM66KFETYK6N76PY89GT'
			request(url, function (error, response, body) {
				transactions = []
				tokenTimeStamp = 0
				results = JSON.parse(body);
				results.result.map((result, i)=>{
					if(i==0) tokenTimeStamp = result.timeStamp;
					transactions = transactions.concat([{wallet_address:req.query.wallet_address, tokenName:result.tokenName, tokenSymbol:result.tokenSymbol, tokenDecimal:result.tokenDecimal, hash:result.hash, timeStamp:result.timeStamp, from:result.from, to:result.to, value:result.value, contractAddress:result.contractAddress}]);
				})
				TokenTransactions.insertMany(transactions).then(function(){
					Wallet.findOneAndUpdate({ wallet_address: req.query.wallet_address }, {tokenTimeStamp:tokenTimeStamp}).then((result)=>{
						return res.status(200).json(transactions); // Success
					}).catch(function(error){
						return res.status(200).json(transactions); // Failure
					})
				}).catch(function(error){
					return res.status(200).json(transactions); // Failure
				});	
			});
		} else {
			return res.status(200).json(result); // return the DB data
		}
	})
});

router.get('/test', (req, res) => {
	
});

router.get('/getRoi', (req, res) => {
	Roi.find({wallet_address:req.query.wallet_address}).lean().sort({ timeStamp : "desc"}).then((result)=>{
		return res.status(200).json(result);
	})
});

router.post('/txRoi', (req, res) => {
	buy_values = []
	promiseForeach.each(req.body.tables,
		table => { 
			sleep(200);
			return getBuyValue(table);
		},
		(arrResult, table) => {
			table.wallet_address = req.body.wallet_address;
			table.token_acquire = arrResult[0];
			table.create = new Date();
			buy_values = buy_values.concat(table);
		},
		(err, newList) => {
			if (err) { console.log(err);	
				return res.status(400).json({status:"fail"});	  
			}
			if (newList.length == req.body.tables.length) {
				Roi.insertMany(buy_values).then(function(){
					result = Roi.find({wallet_address:req.body.wallet_address}).sort({ timeStamp : "desc"}).then((result)=>{
						return res.status(200).json(result);
					})
				}).catch(function(error){
					return res.status(200).json(buy_values); // Failure
				});	
			} else {
				return res.status(400).json({status:"fail"});
			}
		}
	)	
});
module.exports = router;

function roi_insert(wallet_address, rois, last_timeStamp, rois_number, wallet_status, type) {
	
}

function getBuyValue(table) {
	return new Promise(function (resolve, reject) {
		url = "https://bscscan.com/tx/"+table.hash
		request(url, function (error, response, body) {
			if (response.statusCode == "200"){
				if (body.indexOf('LitOldPrice')>-1){
					buy_value = body.slice(body.indexOf('LitOldPrice')+15, body.indexOf('LitOldPrice')+50);
					buy_value = buy_value.slice(0, buy_value.indexOf(';')-1);
					buy_value = buy_value.replace(/\s+/g, '').replace('(','').replace(')','').replace("$", "").replace(',','');
					if (buy_value.indexOf('<') > -1 || buy_value=="") buy_value = 0;
					return resolve(buy_value)
				} else if (body.indexOf('Sorry, our servers are currently busy') > -1){
					return reject(error)
				} else {
					return reject(error)
				}
					// buy_value = body.slice(body.indexOf('LitOldPrice')+15, body.indexOf('LitOldPrice')+50);
					// buy_value = buy_value.slice(0, buy_value.indexOf(';')-1);
					// buy_value = buy_value.replace(/\s+/g, '').replace('(','').replace(')','').replace("$", "").replace(',','');
					// if (buy_value.indexOf('<') > -1 || buy_value=="") buy_value = 0;
					// return resolve(buy_value)
			} else {
				return reject(error)
			}	
		})
	})
}

function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
	  currentDate = Date.now();
	} while (currentDate - date < milliseconds);
  }