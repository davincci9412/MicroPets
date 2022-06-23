const express = require('express');	
const router = express.Router();

const dotenv = require('dotenv');
const env = dotenv.config().parsed;
const config = require('../config/mongoose'); 
const Transactions = require('../models/Transactions');
const TokenTransactions = require('../models/TokenTransactions');

const History = require('../models/History');

router.post('/add', (req, res) => {
	history = {user_id:req.body.user_id, wallet_address:req.body.wallet_address, wallet_name:req.body.wallet_name, wallet_description:req.body.wallet_description, wallet_chain:req.body.wallet_chain, create:new Date()}
	History.findOneAndUpdate({ user_id: req.body.user_id, wallet_address:req.body.wallet_address }, history).then((result)=>{
		if (result){	
			return res.status(200).json({status:"ok"});	
		} else {
			History.create(history, function (err, doc){
				if (err){
					return res.status(400).json({status:"fail"});
				} else {
					return res.status(200).json({status:"ok"});
				}					
			})
		}
	})						
});

router.get('/history', (req, res) => {
	result = History.find({user_id:req.query.user_id}).lean().then((result)=>{
		return res.status(200).json(result);
	})
});

router.get('/delete', (req, res) => {
	History.findOneAndDelete({ user_id: req.query.user_id, wallet_address:req.query.wallet_address }).then((result)=>{
		if (result){	
			return res.status(200).json({status:"ok"});	
		} else {
			History.create(history, function (err, doc){
				if (err){
					return res.status(400).json({status:"fail"});
				} else {
					return res.status(200).json({status:"ok"});
				}					
			})
		}
	})	
});

router.get('/transactions', (req, res) => {
	Transactions.find({wallet_address:req.query.wallet_address}).lean().sort({ timeStamp : "desc"}).then((result)=>{
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
	TokenTransactions.find({wallet_address:req.query.wallet_address}).lean().sort({ timeStamp : "desc"}).then((result)=>{
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

module.exports = router;

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}