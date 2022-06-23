const express = require('express');
const dotenv = require('dotenv');
const config = require('../config/mongoose'); 

const authRoutes = require('./auth.route');
const shopRoutes = require('./shop.route');
const addressRoutes = require('./address.route');
const trackerRoutes = require('./tracker.route');
const exchangeRoutes = require('./exchange.route');

const router = express.Router(); // eslint-disable-line new-cap

//var mongoose = require('mongoose');

const env = dotenv.config().parsed;
config.mongoose
  .connect(env.REACT_APP_MONGO_URL, {
    dbName: env.REACT_APP_MONGO_DB,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 5, // Maintain up to 10 socket connections
    socketTimeoutMS:100000
  })
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(err));
  
/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>{
  res.cookie({ sameSite: 'strict', secure: true });
  res.send('OK')
})

router.use('/auth', authRoutes);
router.use('/shop', shopRoutes);
router.use('/address', addressRoutes);
router.use('/tracker', trackerRoutes);
router.use('/exchange', exchangeRoutes);

module.exports = router;



