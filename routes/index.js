var express = require('express');
var router = express.Router();

var bikesModel = require('../models/bikeModel')


const stripe = require('stripe')('sk_test_WCe0e88VrvhrZdangkv1hI7c00QjPrsEFd');



/* GET home page. */
router.get('/',async function(req, res, next) {


  var listBikeFromBdd = await bikesModel.find(
 
 )

 let nbProduit = 0 

  if(req.session.dataCardBike == undefined){
    req.session.dataCardBike = []
  }else {

    req.session.dataCardBike.forEach((element) => {
      nbProduit = nbProduit + element.quantity
    
    console.log("boucle :",element.quantity)
    });   
  }
  


  res.render('index', {dataBike:listBikeFromBdd,  nbProduit:nbProduit});
});

router.get('/shop', async function(req, res, next) {

  var alreadyExist = false;

  for(var i = 0; i< req.session.dataCardBike.length; i++){
    if(req.session.dataCardBike[i].name == req.query.bikeNameFromFront){
      req.session.dataCardBike[i].quantity = Number(req.session.dataCardBike[i].quantity) + 1;
      alreadyExist = true;
    }
  }

  if(alreadyExist == false){
    req.session.dataCardBike.push({
      name: req.query.bikeNameFromFront,
      url: req.query.bikeImageFromFront,
      price: req.query.bikePriceFromFront,
      quantity: 1
    })
  }

  var stripeCard = [];

  for(var i=0;i<req.session.dataCardBike.length;i++){
    stripeCard.push({
      name: req.session.dataCardBike[i].name,
      amount: req.session.dataCardBike[i].price * 100,
      currency: 'eur',
      quantity: req.session.dataCardBike[i].quantity,
    })
  }


  var sessionStripeID;

  if(stripeCard.length>0){
    var session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeCard,
      success_url: 'http://127.0.0.1:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://127.0.0.1:3000/',
    });

    sessionStripeID = session.id;
  
  }
  
  

  res.render('shop', {dataCardBike:req.session.dataCardBike, sessionStripeID});
});

router.get('/delete-shop', async function(req, res, next){
  
  req.session.dataCardBike.splice(req.query.position,1)

  var stripeCard = [];

  for(var i=0;i<req.session.dataCardBike.length;i++){
    stripeCard.push({
      name: req.session.dataCardBike[i].name,
      amount: req.session.dataCardBike[i].price * 100,
      currency: 'eur',
      quantity: req.session.dataCardBike[i].quantity,
    })
  }


  var sessionStripeID;

  if(stripeCard.length>0){
    var session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeCard,
      success_url: 'http://127.0.0.1:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://127.0.0.1:3000/',
    });

    sessionStripeID = session.id;
  
  }

  res.render('shop',{dataCardBike:req.session.dataCardBike, sessionStripeID})
})

router.post('/update-shop', async function(req, res, next){
  
  var position = req.body.position;
  var newQuantity = req.body.quantity;

  req.session.dataCardBike[position].quantity = newQuantity;

  var stripeCard = [];

  for(var i=0;i<req.session.dataCardBike.length;i++){
    stripeCard.push({
      name: req.session.dataCardBike[i].name,
      amount: req.session.dataCardBike[i].price * 100,
      currency: 'eur',
      quantity: req.session.dataCardBike[i].quantity,
    })
  }


  var sessionStripeID;

  if(stripeCard.length>0){
    var session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeCard,
      success_url: 'http://127.0.0.1:3000/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://127.0.0.1:3000/',
    });

    sessionStripeID = session.id;
  
  }

  res.render('shop',{dataCardBike:req.session.dataCardBike, sessionStripeID})
})

router.get('/success', function(req, res, next){
  res.render('confirm');
})


router.get('/description',async function(req, res, next){

  nameFront=req.query ; 




  nameFromFront = "Cube Acid 240 Hybrid 400 Adolescents, actionteam (2020)"

  var descBike= await bikesModel.find(
    {name:nameFromFront}
    )

    console.log(descBike)
    res.render('description', {descBike:descBike});
})






module.exports = router;
