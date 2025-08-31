const MemberShift = require("../models/memberShiftModel");
const ProfessionalWorkingHours = require("../models/professionalWorkingHoursModel");
const Slot = require("../models/slotModel");

var professionalWorkingController = {};

// ProfessionalWorkingHours
professionalWorkingController.addProfessionalWorkingHours = async function (req, res) {
  try {
    const newProfessionalWorkingHours = new ProfessionalWorkingHours(req.body);
    const savedProfessionalWorkingHours = await newProfessionalWorkingHours.save();
    res.status(201).json({msg:'ProfessionalWorkingHours created successfully',savedProfessionalWorkingHours});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
professionalWorkingController.getProfessionalWorkingHoursById = async function (req, res) {
  try {
    const professionalWorkingHours = await ProfessionalWorkingHours.findById(req.params.id);
    if (professionalWorkingHours) {
      res.json(professionalWorkingHours);
    } else {
      res.status(404).json({ message: 'ProfessionalWorkingHours not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
professionalWorkingController.getAllProfessionalWorkingHoursByUserId = async function (req, res) {
  try {
    const professionalWorkingHours = await ProfessionalWorkingHours.find({user_id:req.params.user_id});

      res.json(professionalWorkingHours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
professionalWorkingController.updateProfessionalWorkingHours = async function (req, res) {
  try {
    const updatedProfessionalWorkingHours = await ProfessionalWorkingHours.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedProfessionalWorkingHours) {
      res.status(200).json({msg:'ProfessionalWorkingHours updated successfully',updatedProfessionalWorkingHours});
    } else {
      res.status(404).json({ message: 'ProfessionalWorkingHours not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
professionalWorkingController.deleteProfessionalWorkingHours = async function (req, res) {
  try {
    const deletedProfessionalWorkingHours = await ProfessionalWorkingHours.findByIdAndDelete(req.params.id);
    if (deletedProfessionalWorkingHours) {
      res.json({ message: 'ProfessionalWorkingHours deleted successfully' });
    } else {
      res.status(404).json({ message: 'ProfessionalWorkingHours not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
professionalWorkingController.setOnOff= async function (req, res) {
  try {
       const  { day,member_id, on_off} = req.body
       console.log(req.body)
        const updatedMemberShift = await MemberShift.updateOne(
          {member_id:member_id,shift_day:day},
          { $set: { on_off:on_off} },
          { new: true }
  
        );  
        console.log(updatedMemberShift)
        const updateSlot = await Slot.updateMany(
          {member_id:member_id,slot_day:day},
          { $set: { on_off:on_off} },
          { new: true }
        );  

      res.status(200).json({msg:'Member shift updated successfully',updatedMemberShift});
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}
professionalWorkingController.setOnOffWorkingHours= async function (req, res) {
  try {
       const  { day,user_id, on_off} = req.body

        const updatedShift = await ProfessionalWorkingHours.updateOne(
          {user_id:user_id,day:day},
          { $set: { on_off:on_off} },
          { new: true }
  
        );  
      res.status(200).json({msg:'Professional Working Hours updated successfully',updatedShift});
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}


module.exports = professionalWorkingController