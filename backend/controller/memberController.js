const Member = require("../models/memberModel");
const Rating = require("../models/ratingModel");

var memberController = {};

// Member
memberController.addMember = async function (req, res) {
  try {
    const newMember = new Member(req.body);
    const savedMember = await newMember.save();
    res.status(201).json({msg:'Member created successfully',savedMember});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
memberController.getMemberById = async function (req, res) {
  try {
    const member = await Member.findById(req.params.id);
      res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
memberController.getAllMemberByUserId = async function (req, res) {
  try {
      const member = await Member.find({salon_id:req.params.user_id}).sort({created:-1});
      const memberIdArray = member.map((val)=>val._id)
      const ratingResult = await Rating.aggregate([
        {
          $match: { member_id: { $in: memberIdArray } },
        },
        {
          $group: {
            _id: '$member_id',
            avgRating: { $avg: '$rating' },
            totalRatings: { $sum: 1 },
          },
        },
      ]);
        
     const resultMap  = {}
     
  
     for(let item of ratingResult){
      resultMap[item._id] = item
     }
     console.log("ratingResult",resultMap)
  
     let finalResult = []
    
     for(let item of member){
      const rating = resultMap[item._id]
      console.log(rating,item._id)
      finalResult.push({item,rating})
     }
  
  
      res.json(finalResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
memberController.updateMember = async function (req, res) {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedMember) {
      res.status(200).json({msg:'Member updated successfully',updatedMember});
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
memberController.deleteMember = async function (req, res) {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (deletedMember) {
      res.json({ message: 'Member deleted successfully' });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = memberController