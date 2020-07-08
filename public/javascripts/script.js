var stripe = Stripe('pk_test_pl3SWtFEhV77OUoDp1ccxQi700UaEXdZkc');

document.getElementById('checkout').addEventListener("click", function(){
    stripe.redirectToCheckout({
        sessionId: sessionStripeID
      }).then(function (result) {

      });

})