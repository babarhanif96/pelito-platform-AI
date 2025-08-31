var express = require('express');

var app = express();
var path = require('path')
bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const Web3 = require('web3');

require('dotenv').config({ path: path.resolve(__dirname, './.env') })

var port = process.env.PORT || 9000;

const stripe = require('stripe')(process.env.Secret_Api_Key);

const session = require('express-session');
// Enable CORS for the specified origin
const passport = require("passport");
require("./utils/passport");

app.set('trust proxy', 1); // Trust the first proxy in the chain

// Rate limiting (only apply to API routes, excluding OPTIONS requests)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 5 minutes
  limit: 100, // each IP can make up to 10 requests per `windowsMs` (5 minutes)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});


app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());



app.use(
  cors({
    origin: ['https://pelito-frontend.vercel.app', 'http://localhost:3000', 'http://localhost:5173', 'https://www.pelito.net'],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

const webhook = async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.SIGNIN_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const bodyData = JSON.parse(req.body.toString());

        const address = bodyData.data.object.metadata.address;
        const amount = bodyData.data.object.metadata.value;

        const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));
        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);

        const tokenContract = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS);

        const value = web3.utils.toWei(amount.toString(), 'mwei'); // or change unit if needed

        const tx = tokenContract.methods.transfer(address, value);

        const gas = await tx.estimateGas({ from: account.address });
        const gasPrice = await web3.eth.getGasPrice();

        const txData = {
          from: account.address,
          to: TOKEN_ADDRESS,
          data: tx.encodeABI(),
          gas,
          gasPrice
        };

        await web3.eth.sendTransaction(txData);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).end();
  } catch (err) {
    console.log('Error handling webhook:', err.message);
    res.status(400).end();
  }
};


app.post('/api/webhook', bodyParser.raw({ type: '*/*' }), webhook)



app.use(express.json());

app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))

app.use(limiter);




// app.use(passport.initialize());
// app.use(passport.session());


// Initialize passport
// app.use(passport.initialize());
// app.use(passport.session());



var connectDB = require('./utils/db');
connectDB()

var custom_routes = require('./routes/index');
const { RPC_URL, TOKEN_ADDRESS, TOKEN_ABI } = require('./constant');
custom_routes(app);


//Handle 404
app.use(function (req, res) {
  console.log(req.body)
  var errObj = {};
  errObj.status = 'fail';
  errObj.msg = 'No such url found';

  res.json(errObj);

});


//Handle 500
app.use(function (error, req, res) {

  var errObj = {};
  errObj.status = 'fail';
  errObj.msg = error.message;

  res.json(errObj);

});

console.log('listen on ' + port);
app.listen(port);

