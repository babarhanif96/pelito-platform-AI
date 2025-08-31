const stripe = require('stripe')(process.env.Secret_Api_Key);


exports.payment = async (req, res, next) => {
    const { address, price: unit_amount, value } = req.body;

    // Step 1: Create a product
    const product = await stripe.products.create({
        name: 'Pelito',
    });

    // Step 2: Create a price for the product
    const price = await stripe.prices.create({
        currency: 'usd',
        unit_amount: unit_amount * 100,
        product: product.id,
    });

    // Step 3: Create a Checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        metadata: {
            address,
            value,
            paidAmount : unit_amount
        },
        line_items: [
            {
                price: price.id,
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}`,
        cancel_url: `${process.env.FRONTEND_URL}`,
    });

    // Attach a custom `payment_intent.succeeded` event to the session
    session.payment_intent_succeeded = true;

    res.json({
        session: session.url,
        success: true
    });
};


