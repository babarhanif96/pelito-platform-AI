const Wishlist = require("../models/wishlistModel");

var wishlistController = {};

// Wishlist
wishlistController.addWishlist = async function (req, res) {
  try {
    const newWishlist = new Wishlist(req.body);
    const savedWishlist = await newWishlist.save();
    res.status(201).json({msg:'Wishlist created successfully',savedWishlist});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
wishlistController.getWishlistById = async function (req, res) {
  try {
    const wishlist = await Wishlist.findById(req.params.id).populate('product_id');
      res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
wishlistController.getAllWishlistByUserId = async function (req, res) {
  try {
      const wishlist = await Wishlist.find({customer_user_id:req.params.user_id}).populate('product_id');

      res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
wishlistController.updateWishlist = async function (req, res) {
  try {
    const updatedWishlist = await Wishlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedWishlist) {
      res.status(200).json({msg:'Wishlist updated successfully',updatedWishlist});
    } else {
      res.status(404).json({ message: 'Wishlist not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
wishlistController.deleteWishlist = async function (req, res) {
  try {
    const deletedWishlist = await Wishlist.findByIdAndDelete(req.params.id);
    if (deletedWishlist) {
      res.json({ message: 'Wishlist deleted successfully' });
    } else {
      res.status(404).json({ message: 'Wishlist not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = wishlistController