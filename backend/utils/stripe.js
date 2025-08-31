const Secret_Api_Key = process.env.Secret_Api_Key
const stripe = require('stripe')(Secret_Api_Key);


module.exports = {
   generateAccountIdForSeller: async function(email = 'bhavna.kumrawat@bacancy.com') {
    const account = await stripe.accounts.create({
            country: 'US',
            type: 'express',
            capabilities: {
              card_payments: {
                requested: true,
              },
              transfers: {
                requested: true,
              },
            },
            business_type: 'individual',
          });
          // console.log(account)
            
      const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: process.env.FRONTEND_URL, // Replace with your refresh URL
          return_url: process.env.FRONTEND_URL, // Replace with your success URL
          type: 'account_onboarding',
      });
      
      // console.log("-----accountLink",accountLink)
      return {account_id:account.id,accountLink:accountLink.url};
  }  ,
  createCustomerAndTransfer:  async function (token,totalAmount, account_id) {
    try {
         // Step 1: Transfer the money to the destination account
        const charge = await stripe.charges.create({
          amount: totalAmount * 100,
          currency: 'USD',
          source: token,
          destination:account_id,
        });
        return charge
     }catch(err){
           console.log(err)
     }
  },
  createCustomerAndTransferForNetwork:  async function (token,amount,name,email) {
    try {
        const customer = await stripe.customers.create({
            email: email,
            source: token,
            name: name,
        })
 
       const charge = await stripe.charges.create({
            amount: amount * 100,     // Charging Rs 25
            description: 'Network fee',
            currency: 'USD',
            customer: customer.id
        });

        return charge
     }catch(err){
           console.log(err)
           return err
     }
  },
  generateAccountlink:  async function (account_id) {
    try {
         // Step 1: Transfer the money to the destination account
         const accountLink = await stripe.accountLinks.create({
          account: account_id,
          refresh_url: process.env.FRONTEND_URL, // Replace with your refresh URL
          return_url: process.env.FRONTEND_URL, // Replace with your success URL
          type: 'account_onboarding',
      });
      return accountLink.url
     }catch(err){
           console.log(err)
     }
  },
  checkUserOnboardingOrNot:  async function (account_id) {
    try {
      const account = await stripe.accounts.retrieve(account_id);
  
      const chargesEnabled = account.charges_enabled;
      const payoutsEnabled = account.payouts_enabled;
  
      return chargesEnabled && payoutsEnabled
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      throw error;
    }
    },
    cancelAndRefund:  async function (chargeId) {
      try {
        // Refund the charge
        const refund = await stripe.refunds.create({
          charge: chargeId,
        });
    
        console.log('Refund successful:', refund);
        return refund
      } catch (error) {
        console.error('Error refunding charge:', error);
        throw error;
      }
   }
  
}