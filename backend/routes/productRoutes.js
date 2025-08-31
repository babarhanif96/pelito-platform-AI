const express = require("express")
const router = express.Router();
const productController = require("../controller/productController");
const { protect } = require("../middleware/authMiddleware");

// Product Routes
router.post('/',protect,productController.addProduct);
router.get('/get-all-product/:user_id',productController.getAllProductByUserId);
router.get('/:id',protect,productController.getProductById);
router.put('/:id',protect,productController.updateProduct);
router.delete('/:id',protect,productController.deleteProduct);

// Cart
router.post('/add-to-cart',protect,productController.addToCart);
router.put('/update-cart/:id',protect,productController.updateCart);
router.get('/cart-details/:user_id',protect,productController.getCartDetails);
router.post('/add-payment',protect,productController.addPaymentForProduct);
router.post('/add-payment/crypto',protect,productController.addPaymentForProductCrypto);
router.delete('/delete-product-from-cart/:id',protect,productController.deleteProductFromCart);
router.get('/purchase-products/:user_id',protect,productController.getPaidProducts);
router.get('/canceled-products/:user_id',protect,productController.getCanceledProducts);
router.put('/cancel-order/:cart_id',protect,productController.cancelOrder);

//Shipping address
router.post('/shipping-address/',protect,productController.addShippingAddress);
router.get('/shipping-address-by-user_id/:user_id',protect,productController.getShippingAddressByUserId);
router.get('/shipping-address/:id',protect,productController.getShippingAddressById);
router.put('/shipping-address/:id',protect,productController.updateShippingAddress);
router.delete('/shipping-address/:id',protect,productController.deleteShippingAddress);

module.exports = router