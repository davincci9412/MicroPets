const Wallet = require('../models/Wallet');
const Tokenbsc = require('../models/Tokenbsc');
const Tokengecko = require('../models/Tokengecko');
const Transactions = require('../models/Transactions');
const Tokenbalances = require('../models/Tokenbalances');
const TokenTransactions = require('../models/TokenTransactions');
const request = require('postman-request');
const promiseForeach = require('promise-foreach')

const dotenv = require('dotenv');
const env = dotenv.config().parsed;
const config = require('../config/mongoose'); 
const e = require('express');
config.mongoose.set('useFindAndModify', false);

module.exports = {	
  connection_awake: function(){
	config.mongoose
	.connect(env.REACT_APP_MONGO_URL, {
		dbName: env.REACT_APP_MONGO_DB,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		poolSize: 5, // Maintain up to 5 socket connections
		socketTimeoutMS:33000
	}).then(() => console.log("Connection Awake________"+ new Date()))  		
	.catch((err) => console.log("Connection Awake Fail________"+err));
  },
  roi_update: function(){
	config.mongoose
	.connect(env.REACT_APP_MONGO_URL, {
		dbName: env.REACT_APP_MONGO_DB,
		useNewUrlParser: true,
		useUnifiedTopology: true,
		poolSize: 2, // Maintain up to 2 socket connections for ROI update
		socketTimeoutMS:30000
	})
	.then(() => console.log("Roi Check________"+ new Date()))  		
	.catch((err) => console.log("Connection Awake Fail________"+err));

	Wallet.find().lean().sort({ create : "asc"}).then((wallets)=>{
		wallet_number = wallets.length;
		saved_roi = missed_roi = []
		complete_number = 0
		searched = false
		type = 2
		k= 0
		if (wallet_number >0){
			result = "success"
			wallets.map((wallet, i)=>{
				if(wallet.status == 0 && !searched) {
					search_wallet_address = wallet.wallet_address
					type = 0;
					searched = true;
					timeStamp = wallet.roiTimeStamp		
					before_number = wallet.rois		
					before_status = wallet.status;
				} else if (wallet.status == 1 && !searched){
					search_wallet_address = wallet.wallet_address
					type = 1;
					searched = true;
					timeStamp = wallet.roiTokenTimeStamp	
					before_number = wallet.tokenRois		
					before_status = wallet.status;	
				}
			})
			if (type == 0){
				Transactions.find({wallet_address: search_wallet_address}).lean().sort({timeStamp:"asc"}).then((transactions)=>{
					transactions.map((transaction, j)=>{
						if (Number(transaction.timeStamp > Number(timeStamp)) && k < 50){
							transaction.tokenName = "Binance Coin"
							transaction.tokenSymbol = "BNB"
							transaction.contractAddress = "0xb8c77482e45f1f44de1745f52c74426c631bdd52"
							transaction.tokenDecimal = 18
							transaction.qty = Number(transaction.value)/(10**transaction.tokenDecimal)
							saved_roi = saved_roi.concat(transaction)
							k = k+1;
							last_timeStamp = transaction.timeStamp;
						}
					})
					if (saved_roi.length > 0){
						if (transactions.length == (before_number+k) ) before_status = 1;
						buy_values = []
						promiseForeach.each(saved_roi,
							table => { 
								return getBuyValue(table);
							},
							(arrResult, table) => {
								table.token_acquire = arrResult[0];
								table.create = new Date();
								buy_values = buy_values.concat(table);
							},
							(err, newList) => {
								if (err) { 
									console.log("ROI BNB fail__________"+ new Date())
								}
								if (newList.length == saved_roi.length) {
									Roi.insertMany(buy_values).then(function(){
										wallet = {rois:before_number+k, roiTimeStamp:last_timeStamp, status:before_status}
										Wallet.updateOne({wallet_address:search_wallet_address}, wallet).then((result)=>{
											console.log("ROI BNB success________"+ new Date())
										})
									}).catch(function(error){
										console.log("ROI BNB fail________"+ new Date())
									});	
								} else {
									console.log("ROI BNB fail__________"+ new Date())
								}
							}
						)	
					} else {
						Roi.find({wallet_address: search_wallet_address}).lean().sort({timeStamp:"asc"}).then((rois)=>{
							transactions.map((transaction, j)=>{
								exist = false;
								rois.map((roi, k)=>{
									if (roi.hash == transaction.hash) exist = true
								})
								if (!exist) {
									transaction.qty = Number(transaction.value)/(10**18)
									missed_roi = missed_roi.concat(transaction)
								} 
							})
							if (missed_roi.length>0){
								if (transactions.length == (before_number+missed_roi.length) ) before_status = 2;
								buy_values = []
								promiseForeach.each(missed_roi,
									table => { 
										return getBuyValue(table);
									},
									(arrResult, table) => {
										table.token_acquire = arrResult[0];
										table.create = new Date();
										buy_values = buy_values.concat(table);
									},
									(err, newList) => {
										if (err) { 
											console.log("Missed ROI BNB fail"+ new Date())
										}
										if (newList.length == missed_roi.length) {
											Roi.insertMany(buy_values).then(function(){
												wallet = {rois:before_number+missed_roi.length, status:before_status}
												Wallet.updateOne({wallet_address:search_wallet_address}, wallet).then((result)=>{
													console.log("Missed ROI BNB success________"+ new Date())
												})
											}).catch(function(error){
												console.log("Missed ROI BNB fail_______"+ new Date())
											});	
										} else {
											console.log("Missed ROI BNB fail_________"+ new Date())
										}
									}
								)	
							} else {
								wallet = {status:1}
								Wallet.updateOne({wallet_address:search_wallet_address}, wallet).then((result)=>{
									console.log("ROI BNB complete________"+ new Date())
								})
							}
						})
					}
				})
			} else if(type ==1){
				TokenTransactions.find({wallet_address: search_wallet_address}).lean().sort({timeStamp:"asc"}).then((transactions)=>{
					transactions.map((transaction, j)=>{
						if (Number(transaction.timeStamp > Number(timeStamp)) && k < 50){
							transaction.qty = Number(transaction.value)/(10**transaction.tokenDecimal)
							saved_roi = saved_roi.concat(transaction)
							k = k+1;
							last_timeStamp = transaction.timeStamp;
						}
					})
					if (saved_roi.length > 0){
						if (transactions.length == (before_number+k) ) before_status = 2;
						buy_values = []
						promiseForeach.each(saved_roi,
							table => { 
								return getBuyValue(table);
							},
							(arrResult, table) => {
								table.token_acquire = arrResult[0];
								table.create = new Date();
								buy_values = buy_values.concat(table);
							},
							(err, newList) => {
								if (err) { 
									console.log("ROI Token fail___________"+ new Date())
								}
								if (newList.length == saved_roi.length) {
									Roi.insertMany(buy_values).then(function(){
										wallet = {tokenRois:before_number+k, roiTokenTimeStamp:last_timeStamp, status:before_status}
										Wallet.updateOne({wallet_address:search_wallet_address}, wallet).then((result)=>{
											console.log("ROI Token success________"+ new Date())
										})
									}).catch(function(error){
										console.log("ROI Token fail__________"+ new Date())
									});	
								} else {
									console.log("ROI Token fail___________"+ new Date())
								}
							}
						)	
					} else {
						Roi.find({wallet_address: search_wallet_address}).lean().sort({timeStamp:"asc"}).then((rois)=>{
							transactions.map((transaction, j)=>{
								exist = false;
								rois.map((roi, k)=>{
									if (roi.hash == transaction.hash) exist = true
								})
								if (!exist) {
									transaction.qty = Number(transaction.value)/(10**transaction.tokenDecimal)
									missed_roi = missed_roi.concat(transaction)
								} 
							})
							if (missed_roi.length>0){
								if (transactions.length == (before_number+missed_roi.length) ) before_status = 2;
								buy_values = []
								promiseForeach.each(missed_roi,
									table => { 
										return getBuyValue(table);
									},
									(arrResult, table) => {
										table.token_acquire = arrResult[0];
										table.create = new Date();
										buy_values = buy_values.concat(table);
									},
									(err, newList) => {
										if (err) { 
											console.log("Missed ROI Token fail_______"+ new Date())
										}
										if (newList.length == missed_roi.length) {
											Roi.insertMany(buy_values).then(function(){
												wallet = {tokenRois:before_number+missed_roi.length, status:before_status}
												Wallet.updateOne({wallet_address:search_wallet_address}, wallet).then((result)=>{
													console.log("Missed ROI Token success________"+ new Date())
												})
											}).catch(function(error){
												console.log("Missed ROI Token fail______"+ new Date())
											});	
										} else {
											console.log("Missed ROI Token fail______"+ new Date())
										}
									}
								)	
							} else {
								wallet = {status:2}
								Wallet.updateOne({wallet_address:search_wallet_address}, wallet).then((result)=>{
									console.log("ROI Token complete________"+ new Date())
								})
							}
						})
					}
				})
			} else {
				console.log("Don't have the ROI to add________"+ new Date())
			}
		} else {
			console.log("Don't have any wallet________"+ new Date())
		}
	})

  },

  token: function () {

	request('https://api.coingecko.com/api/v3/coins/list?include_platform=true', function (error, response, body) {
		tokens = []
		results = JSON.parse(body);
		results.map((result, i)=>{	
			temp_name = "";
			temp_value = "";
            for(const name in result.platforms) {
				temp_name = temp_name + name+","
				temp_value = temp_value + result.platforms[name] +","
			}
			temp_name = temp_name.slice(0,-1)
			if (temp_name == ",") temp_name = "";
			temp_value = temp_value.slice(0,-1)
			if (temp_value == ",") temp_value = "";

			tokens = tokens.concat([{token_id:result.id, token_symbol:result.symbol, token_name:result.name, token_platform:temp_name, token_address:temp_value}]);
		})
		if (Number(tokens.length) >0){
			temps = [];
			tokens.map((token,i)=>{
				temps[i] = token.token_id;
			})
			api_array = []
			page = Math.ceil(temps.length/500);
			for (j=0; j<page; j++){
				temp = temps.slice(j*500, j*500+500)
				query =temp.join();
				api_array = api_array.concat([{item: query}])
			}
			prices = []
			promiseForeach.each(api_array,
				token => { 
					return getPrices(token.item);
				},
				(arrResult, token) => {
					Object.keys(arrResult[0]).forEach(key => {
						tokens.map((token, j)=>{
							if (token.token_id == key) prices = prices.concat([{token_id:key, token_name:token.token_name, token_symbol:token.token_symbol, token_platform:token.token_platform, token_address:token.token_address, token_price:arrResult[0][key].usd, token_24h_change: arrResult[0][key].usd_24h_change }])
						})						
					})
				},
				(err, newList) => {
					if (err) { 
						console.log("Token API call fail------------- Main error---------------------")
					}
					if (api_array.length == newList.length){
						Tokengecko.collection.drop().then(function(){
							Tokengecko.insertMany(prices).then(function(){
								console.log("Token success_______________________"+ new Date());  		//success
							}).catch(function(error){
								console.log("Token fail _________________________"+ new Date() + error);       //error
							});
						});						
					}					
				}
			)
		} 
	});		
  },

  mainBalance: function(){
	Wallet.find().lean().then(results => {
        i = 0
		if (results.length >0){
			promiseForeach.each(results,
				result => { 
					i = i+1;
					return setTimeout(async function(){await updateBNBBalance(result.wallet_address);}, i*320) 
				},
				(arrResult, result) => {					
				},
				(err, newList) => {
					if (results.length == newList.length){
						console.log("BNB Balance success_________"+ new Date());  		//success
					} else {
						console.log("BNB Balance fail_________"+ new Date())       // fail
					}				
				}
			)
		}
	})
  },

  balance: function(){
	Wallet.find().lean().then(async results => {
		i = 0
		if(results.length > 0){
			promiseForeach.each(results,
				result => { 
					i = i+1;
					return setTimeout(async function(){await updateBalance(result.wallet_address);}, i*800) 
				},
				(arrResult, result) => {					
				},
				(err, newList) => {
					if (results.length == newList.length){
						console.log("Balance success___________"+ new Date());  		//success
					} else {
						console.log("Balance fail___________"+ new Date())       // fail
					}				
				}
			)
		}	
	})
  },

//   balance: function(){
// 	Wallet.find().lean().then(async results => {
// 		if(results.length > 0){
// 			await Promise.all(
// 				results.map(async(data1, i)=>  {
// 					//Because balance API rate limit is 500ms, we calls this API every 800ms considering the delay
// 					setTimeout(async function(){
// 						await fetch('https://api.bscscan.com/api?module=account&action=addresstokenbalance&address='+data1.wallet_address+'&page=1&offset=1000&apikey=536NCBDYVREIJDEM66KFETYK6N76PY89GT').then(async response => {
// 							token_list = [];
// 							results1 = await response.json();
// 							if (results1.result.length >= 1) {
// 								results1.result.map((data, i) => {
// 									temp1 = Number(data.TokenQuantity)/(10**data.TokenDivisor)
// 									token_list = token_list.concat([{wallet_address:data1.wallet_address, tokenName:data.TokenName, tokenSymbol:data.TokenSymbol, tokenDecimal:data.TokenDivisor, qty:temp1, contractAddress:data.TokenAddress}]);           
// 								})
// 							}							
// 							Tokenbalances.deleteMany({wallet_address:data1.wallet_address})
// 								.then(()=>Tokenbalances.insertMany(token_list)
// 									.then(()=>console.log("Balance update success____"+results1.message+"_______"+ new Date()))
// 									.catch(function(err){
// 										console.log("Balance update DB fail_____"+err+"_____"+new Date());
// 									})
// 								)	
// 						})
// 						.catch(err => {
// 							console.log("Balance update API fail_____"+err+"_____"+new Date());
// 						})
// 					}, i*800) 
// 				})
// 			)	
// 		}	
// 	})
//   },

  transactions: function(){
	Wallet.find().lean().then(async results => {
		i = 0
        if (results.length >0){
			promiseForeach.each(results,
				result => { 
					i = i+1;
					return setTimeout(async function(){await updateTransactions(result.wallet_address, result.timeStamp);}, i*320) 
				},
				(arrResult, result) => {					
				},
				(err, newList) => {
					if (results.length == newList.length){
						console.log("Transactions success___________"+ new Date());  		//success
					} else {
						console.log("Transactions fail___________"+ new Date())       // fail
					}				
				}
			)
		}
	})
  },

  tokenTransactions: function(){
	Wallet.find().lean().then(results => {
        i = 0
		if (results.length >0){
			promiseForeach.each(results,
				result => { 
					i = i+1;
					return setTimeout(async function(){await updateTokenTransactions(result.wallet_address, result.tokenTimeStamp);}, i*320) 
				},
				(arrResult, result) => {					
				},
				(err, newList) => {
					if (results.length == newList.length){
						console.log("Token transations success___________"+ new Date());  		//success
					} else {
						console.log("Token transactions fail___________"+ new Date())       // fail
					}				
				}
			)
		}
	})
  },

  
};

async function getBuyValue(table) {
	return await new Promise(function (resolve, reject) {
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
			} else {
				return reject(error)
			}	
		})
	})
}

async function getPrices(item) {
	return await new Promise( function (resolve, reject) {
		request('https://api.coingecko.com/api/v3/simple/price?ids='+item+'&vs_currencies=usd&include_24hr_change=true', function (error, response, body) {
			if (error) reject(error);
			if (body ) resolve(JSON.parse(body));
		})
	})
}

async function updateBNBBalance(wallet_address) {
	return await new Promise( function (resolve, reject) {
		var url = 'https://api.bscscan.com/api?module=account&action=balance&address='+wallet_address+'&tag=latest&apikey=536NCBDYVREIJDEM66KFETYK6N76PY89GT'
		request(url, function (error, response, body) {
			results = JSON.parse(body);
			if (results.message === "OK"){
				qty = (Number(results.result)/(10**18))
				Wallet.findOneAndUpdate({wallet_address:wallet_address},{qty:qty}).then((result)=>{
					if (result) { resolve(result); } else { reject("Fail"); }
				})
			} 
		})	
	})
}

function updateBalance(wallet_address) {
	return new Promise( function (resolve, reject) {
		//var url  ='https://api.covalenthq.com/v1/56/address/'+wallet_address+'/balances_v2/?nft=true&no-nft-fetch=true&key=ckey_daca4efda85b4837961727b8cbb'
		url = 'https://api.bscscan.com/api?module=account&action=addresstokenbalance&address='+wallet_address+'&page=1&offset=1000&apikey=536NCBDYVREIJDEM66KFETYK6N76PY89GT'
		request(url, function (error, response, body) {
			token_list = [];
			results = JSON.parse(body);
			if (results.result.length >= 1) {
				results.result.map((data, i) => {
					temp1 = Number(data.TokenQuantity)/(10**data.TokenDivisor)
					token_list = token_list.concat([{wallet_address:wallet_address, tokenName:data.TokenName, tokenSymbol:data.TokenSymbol, tokenDecimal:data.TokenDivisor, qty:temp1, contractAddress:data.TokenAddress}]);           
				})
			}	
			Tokenbalances.deleteMany({wallet_address:wallet_address}).then(function(){			
				Tokenbalances.insertMany(token_list).then(function(){
					resolve(token_list); // Success
				}).catch(function(error){
					reject(error); // Failure
				});	
			})					
		})			
	})
}

function updateTransactions(wallet_address, timeStamp) {
	return new Promise( function (resolve, reject) {
		url  ='https://api.bscscan.com/api?module=account&action=txlist&address='+wallet_address+'&startblock=1&endblock=99999999&sort=asc&apikey=536NCBDYVREIJDEM66KFETYK6N76PY89GT'
		request(url, function (error, response, body) {
			transactions = []
			last_timeStamp = timeStamp;
			results = JSON.parse(body);
			results.result.map((result, i)=>{
				if (Number(result.timeStamp) > Number(timeStamp)) {
					transactions = transactions.concat([{wallet_address:wallet_address, hash:result.hash, timeStamp:result.timeStamp, from:result.from, to:result.to, value:result.value}]);
					last_timeStamp = result.timeStamp
				}
			})	
			if (transactions.length > 0){
				Transactions.insertMany(transactions).then(function(){
					wallet = {status:0, timeStamp:last_timeStamp}
					Wallet.updateOne({wallet_address:wallet_address}, wallet).then((result)=>{
						resolve(transactions); // Success
					}).catch(function(error){
						reject(error); // Failure
					});				
				}).catch(function(error){
					reject(error); // Failure
				});	
			} else {
				resolve(transactions)
			}		
		})				
	})
}

async function updateTokenTransactions(wallet_address, timeStamp) {
	return await new Promise( function (resolve, reject) {
		//var url  ='https://api.covalenthq.com/v1/56/address/'+wallet_address+'/balances_v2/?nft=true&no-nft-fetch=true&key=ckey_daca4efda85b4837961727b8cbb'
		var url  ='https://api.bscscan.com/api?module=account&action=tokentx&address='+wallet_address+'&startblock=1&endblock=99999999&sort=asc&apikey=536NCBDYVREIJDEM66KFETYK6N76PY89GT'
		request(url, function (error, response, body) {
			transactions = []
			last_timeStamp = timeStamp;
			results = JSON.parse(body);
			results.result.map((result, i)=>{
				if (Number(result.timeStamp) > Number(timeStamp)) {
					transactions = transactions.concat([{wallet_address:wallet_address, tokenName:result.tokenName, tokenSymbol:result.tokenSymbol, tokenDecimal:result.tokenDecimal, hash:result.hash, timeStamp:result.timeStamp, from:result.from, to:result.to, value:result.value, contractAddress:result.contractAddress}]);
					last_timeStamp = result.timeStamp
				}
			})
			if (transactions.length > 0){
				TokenTransactions.insertMany(transactions).then(function(){
					wallet = {status:1, tokenTimeStamp:last_timeStamp}
					Wallet.updateOne({wallet_address:wallet_address}, wallet).then((result)=>{
						resolve(transactions); // Success
					}).catch(function(error){
						reject(error); // Failure
					});
				}).catch(function(error){
					reject(error); // Failure
				});
			} else {
				resolve(transactions)
			}						
		})			
	})
}


