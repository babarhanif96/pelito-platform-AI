const InterestCategory = require("../models/interestCategoryModel");
const InterestSubCategory = require("../models/interestSubCategoryModel");

var interestController = {};

// Category
interestController.addCategory = async function (req, res) {
  try {
    const newInterestCategory = new InterestCategory(req.body);
    const savedInterestCategory = await newInterestCategory.save();
    res.status(201).json({msg:'Category created successfully',savedInterestCategory});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
interestController.getCategoryById = async function (req, res) {
  try {
    const interestCategory = await InterestCategory.findById(req.params.id);
    if (interestCategory) {
      res.json(interestCategory);
    } else {
      res.status(404).json({ message: 'Interest category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
interestController.getAllCategory = async function (req, res) {
  try {
    const interestCategory = await InterestCategory.find();
      res.json(interestCategory);
    // } else {
    //   res.status(404).json({ message: 'Interest category not found' });
    // }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
interestController.updateCategory = async function (req, res) {
  try {
    const updatedInterestCategory = await InterestCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedInterestCategory) {
      res.status(200).json({msg:'Category updated successfully',updatedInterestCategory});
    } else {
      res.status(404).json({ message: 'Interest category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
interestController.deleteCategory = async function (req, res) {
  try {
    const deletedInterestCategory = await InterestCategory.findByIdAndDelete(req.params.id);
    if (deletedInterestCategory) {
      res.json({ message: 'Interest category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Interest category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Sub category
interestController.addSubCategory = async function (req, res) {
  try {
    const newInterestSubCategory = new InterestSubCategory(req.body);
    const savedInterestSubCategory = await newInterestSubCategory.save();
    res.status(201).json({msg:'Sub-Category created successfully',savedInterestSubCategory});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
interestController.getSubCategoryById = async function (req, res) {
  try {
    const interestSubCategory = await InterestSubCategory.findById(req.params.id);
    if (interestSubCategory) {
      res.json(interestSubCategory);
    } else {
      res.status(404).json({ message: 'Interest sub-category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
interestController.getSubCategoryByCategoryId = async function (req, res) {
  try {
    const interestSubCategory = await InterestSubCategory.find({category_id:req.params.category_id});
    // if (interestSubCategory.length>0) {
      res.json(interestSubCategory);
    // } else {
    //   res.status(404).json({ message: 'Interest sub-category not found' });
    // }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
interestController.updateSubCategory = async function (req, res) {
  try {
    const updatedInterestSubCategory = await InterestSubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedInterestSubCategory) {
      res.status(200).json({msg:'Sub-Category updated successfully',updatedInterestSubCategory});
    } else {
      res.status(404).json({ message: 'Interest sub-category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
interestController.deleteSubCategory = async function (req, res) {
  try {
    const deletedInterestSubCategory = await InterestSubCategory.findByIdAndDelete(req.params.id);
    if (deletedInterestSubCategory) {
      res.json({ message: 'Interest sub-category deleted successfully' });
    } else {
      res.status(404).json({ message: 'Interest sub-category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

interestController.getAllSubCategory = async function (req, res) {
  try {
    const interestSubCategory = await InterestSubCategory.find({});
    // if (interestSubCategory.length>0) {
      res.json(interestSubCategory);
    // } else {
    //   res.status(404).json({ message: 'Interest sub-category not found' });
    // }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}


module.exports = interestController