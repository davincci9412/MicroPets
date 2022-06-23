const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const routes = require('./routes/index.route');

//const webpack = require('webpack');
// const cron = require('node-cron');
// var cron_work = require('./src/cron');

// cron.schedule('*/30 * * * * *', () => { //Awake new connection every 30s
// 	cron_work.connection_awake();
// });

// cron.schedule('*/2 * * * *', () => { //Update ROI status every 2 min
// 	cron_work.roi_update();
// });

// cron.schedule('20 7 */6 * * *', () => { //Update token price, 24hours changing information every 6 hour 7 min 20s
// 	cron_work.token();
// });

// cron.schedule('20 17 */1 * * *', () => { //Update BNB balance every 1 hour 17 minutes 20s
// 	cron_work.mainBalance();
// });

// cron.schedule('20 27 */1 * * *', () => { //Update each token balance every 1 hour 27 minutes 20s
// 	cron_work.balance();
// });

// cron.schedule('20 37 */1 * * *', () => { //Update BNB transactions every 1 hour 37 minutes 20s
// 	cron_work.transactions();
// });

// cron.schedule('25 47 */1 * * *', () => { //Update token transactions every 1 hour 47 minutes 20s
// 	cron_work.tokenTransactions();
// });

const app = express();

const cors = require('cors')
app.use(cors());

app.use(bodyParser.json());

app.use(express.urlencoded({
  extended: true
}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Headers" , "Origin, X-Requested-With, x-token-secret, x-csrf-token, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Credentials', false);
  res.cookie({ sameSite: 'strict', secure: true });
  next();
});

// call dotenv and it will return an Object with a parsed key 
const env = dotenv.config().parsed;
const PORT = env.REACT_APP_SERVER_PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// main router
app.use('', routes);

module.exports = app;

/*
module.exports = () => {
  
  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ]
  };
};
*/