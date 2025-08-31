const Rating = require("../models/ratingModel");

var ratingController = {};

// Rating
ratingController.addRating = async function (req, res) {
  try {
    const newRating = new Rating(req.body);
    const savedRating = await newRating.save();
    res.status(201).json({msg:'Rating created successfully',savedRating});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
ratingController.getRatingById = async function (req, res) {
  try {
    const Rating = await Rating.findById(req.params.id);
    if (Rating) {
      res.json(Rating);
    } else {
      res.status(404).json({ message: 'Rating not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
ratingController.getAllRatingByProductId = async function (req, res) {
  try {
      const Rating = await Rating.find({product_id:req.params.product_id});

      res.json(Rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
ratingController.getAllRatingByServiceId = async function (req, res) {
  try {
      const Rating = await Rating.find({user_id:req.params.service_id});

      res.json(Rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
ratingController.getAllRatingByUserId = async function (req, res) {
  try {
      const Rating = await Rating.find({user_id:req.params.user_id});

      res.json(Rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
ratingController.updateRating = async function (req, res) {
  try {
    const updatedRating = await Rating.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedRating) {
      res.status(200).json({msg:'Rating updated successfully',updatedRating});
    } else {
      res.status(404).json({ message: 'Rating not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
ratingController.deleteRating = async function (req, res) {
  try {
    const deletedRating = await Rating.findByIdAndDelete(req.params.id);
    if (deletedRating) {
      res.json({ message: 'Rating deleted successfully' });
    } else {
      res.status(404).json({ message: 'Rating not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = ratingController