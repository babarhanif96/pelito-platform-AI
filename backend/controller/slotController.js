const BookingService = require("../models/bookingServiceModel");
const MemberBreakTime = require("../models/memberBreakTimeModel");
const Member = require("../models/memberModel");
const MemberShift = require("../models/memberShiftModel");
const Slot = require("../models/slotModel");
const { getWeekDay, calculateEndTime } = require("../utils/common");
const moment = require('moment');

var slotController = {};

// Slot
slotController.addSlot = async function (req, res) {
  try {
    const memberShiftsData = req.body.data
    const shiftData = []

    const memberData = await Member.findOne({ salon_id: memberShiftsData[0].salon_id, member_id: memberShiftsData[0].member_id })

    const shiftDataExist = await MemberShift.find({ salon_id: memberShiftsData[0].salon_id, member_id: memberShiftsData[0].member_id })
    if (shiftDataExist.length > 0) {
      const dayArray = memberShiftsData.map((val) => val.shift_day)
      const days = []
      for (let item of shiftDataExist) {
        if (dayArray.includes(item.shift_day)) {
          days.push(item.shift_day)
        }
      }
      if (days.length > 0) {
        return res.status(401).json({ msg: `Slot already exist for this ${days.join(',')}` })
      }
    }
    for (const memberShiftData of memberShiftsData) {
      // Create a new memberShift document
      const newMemberShift = await MemberShift.create(memberShiftData);
      shiftData.push(newMemberShift)
    }

    const shiftMap = new Map()
    for (let item of memberShiftsData) {
      shiftMap.set(item.shift_day, item)
    }
    console.log("shiftMap", shiftMap)
    // Prepare req data for slot (for each day from today to next month)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2); // +2 to go to the next month
    endDate.setDate(0);

    let currentDate = startDate;
    const slotDataArray = [];

    while (currentDate <= endDate) {

      // Construct the date string in the format "yyyy-mm-dd"
      let slot_Date = moment(currentDate).format('YYYY-MM-DD');

      const slot_day = getWeekDay(currentDate.getDay())
      const shiftData = shiftMap.get(slot_day)
      if (shiftData) {
        const slotData = {
          salon_id: memberShiftsData[0].salon_id,
          member_id: memberShiftsData[0].member_id,
          slot_day: slot_day,
          start_time: shiftData.start_time,
          end_time: shiftData.end_time,
          slot_Date: slot_Date,
        };

        slotDataArray.push(slotData);

      }
      // Move to the next day
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create slot documents for each day
    const newSlots = await Slot.create(slotDataArray);

    res.status(201).json({ success: true, memberShift: shiftData, slots: newSlots });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
slotController.getSlotById = async function (req, res) {
  try {
    const slots = await Slot.findById(req.params.id);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
slotController.getSlotByMemberId = async function (req, res) {
  try {
    const slots = await Slot.find({
      member_id: req.params.member_id,
    })
      .sort({ created_date: -1 });

    const slot_id_array = slots.map((val) => val._id)

    const breakTimes = await MemberBreakTime.find({
      slot_id: { $in: slot_id_array },
    })
      .sort({ created_date: -1 });

    const groupedBreakTimes = {};

    breakTimes.forEach((breakTime) => {
      const slotId = breakTime.slot_id;
      if (!groupedBreakTimes[slotId]) {
        groupedBreakTimes[slotId] = [breakTime];
      } else {
        groupedBreakTimes[slotId].push(breakTime);
      }
    });
    const updatedSlots = slots.map((val) => ({
      _id: val._id,
      salon_id: val.salon_id,
      member_id: val.member_id,
      slot_day: val.slot_day,
      start_time: val.start_time,
      end_time: val.end_time,
      slot_Date: new Date(val.slot_Date).toISOString().split('T')[0],
      created: val.created,
      updated: val.updated,
      break_time: groupedBreakTimes[val._id] || [], // or any other value you want to set
    }));

    res.status(200).json(updatedSlots);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get slot data by slot_date for enthu user
slotController.getSlotBySlotDate = async function (req, res) {
  try {

    // const nextDate = new Date(slotDate);
    // nextDate.setDate(slotDate.getDate() + 1); // Get the next day

    const slotDate = new Date(req.params.slot_date);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = days[slotDate.getDay()];


    console.log(dayName)

    const slot = await Slot.findOne({
      // slot_Date: {
      //   $gte: slotDate, // Greater than or equal to '2024-02-05 00:00:00.000'
      //   $lt: nextDate    // Less than '2024-02-06 00:00:00.000'
      // },
      slot_day: dayName,
      member_id: req.params.member_id // Corrected member_id field name
    })


    console.log("slot", slot)

    if (slot) {
      const booking_service = await BookingService.find({
        slot_id: slot._id,
        status: { $nin: ['canceled', 'pending'] }
      })
        .select('slot_id booking_time')
        .populate({
          path: 'service_id',
          select: 'period' // Only select the 'period' field from the 'service_id' document
        })
        .sort({ created_date: -1 });

      // Group the memberShiftData by slot_id
      const groupedData = {};

      // console.log(booking_service)
      // Iterate over memberShiftData and group by shift_id
      for (const bookingServiceData of booking_service) {
        if (!groupedData[bookingServiceData.booking_time]) {
          groupedData[bookingServiceData.booking_time] = [];
        }
        groupedData[bookingServiceData.booking_time].push(bookingServiceData);
      }

      const member = await Member.findOne({
        _id: req.params.member_id,
      })

      const member_capacity = member.capacity

      const breakTimes = await MemberBreakTime.find({
        slot_id: slot._id,
      })
        .sort({ created_date: -1 });

      // console.log("-----------groupedData",groupedData)
      const disableSlot = []
      for (let key of Object.keys(groupedData)) {
        let element = groupedData[key]
        let end_period = element.map((val) => parseInt(val.service_id.period))
        end_period.sort((a, b) => b - a)
        let end_time = calculateEndTime(key, end_period[0])
        const time_string = `${key}, ${end_time}`

        console.log("-------------member_capacity", member_capacity)
        if ((element && element.length == member_capacity) || (member_capacity == null)) {
          disableSlot.push(time_string)
        }
      }

      return res.status(200).json({ slot, disableSlot, breakTimes, member });
    } else {
      return res.status(200).json({ slot: {}, disableSlot: [], breakTimes: [] });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

slotController.updateSlot = async function (req, res) {
  try {
    const updatedSlot = await Slot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedSlot) {
      res
        .status(200)
        .json({ msg: "Slot updated successfully", updatedSlot });
    } else {
      res.status(404).json({ message: "Slot not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
slotController.deleteSlot = async function (req, res) {
  try {
    const deletedSlot = await Slot.findByIdAndDelete(
      req.params.id
    );
    if (deletedSlot) {
      res.json({ message: "Slot deleted successfully" });
    } else {
      res.status(404).json({ message: "Slot not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Break time for slots
slotController.addBreakTime = async function (req, res) {
  try {
    const newBreakTime = new MemberBreakTime(req.body);
    const savedBreakTime = await newBreakTime.save();
    res.status(201).json({ msg: 'BreakTime created successfully', savedBreakTime });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

slotController.getBreakTimeBySlotId = async function (req, res) {
  try {
    const breakTimes = await MemberBreakTime.find({ slot_id: req.params.slot_id }).populate('slot_id');
    res.json(breakTimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
slotController.getBreakTimeByUserId = async function (req, res) {
  try {

    const slots = await Slot.find({
      salon_id: req.params.user_id,
    })
      .sort({ created_date: -1 });

    const slot_id_array = slots.map((val) => val._id)
    console.log(slot_id_array)
    const breakTimes = await MemberBreakTime.find({
      slot_id: { $in: slot_id_array },
    })
      .sort({ created_date: -1 });

    const groupedBreakTimes = {};

    breakTimes.forEach((breakTime) => {
      const slotId = breakTime.slot_id;
      if (!groupedBreakTimes[slotId]) {
        groupedBreakTimes[slotId] = [breakTime];
      } else {
        groupedBreakTimes[slotId].push(breakTime);
      }
    });
    const updatedSlots = slots.map((val) => ({
      _id: val._id,
      salon_id: val.salon_id,
      member_id: val.member_id,
      slot_day: val.slot_day,
      start_time: val.start_time,
      end_time: val.end_time,
      slot_Date: val.slot_Date,
      created: val.created,
      updated: val.updated,
      break_time: groupedBreakTimes[val._id] || [], // or any other value you want to set
    }));

    res.status(200).json(updatedSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
slotController.getBreakTimeByMemberId = async function (req, res) {
  try {
    const breakTimes = await MemberBreakTime.find({ member_id: req.params.member_id }).populate('slot_id');
    res.json(breakTimes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
slotController.updateBreakTime = async function (req, res) {
  try {
    const updatedBreakTime = await MemberBreakTime.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedBreakTime) {
      res
        .status(200)
        .json({ msg: "Break Time updated successfully", updatedBreakTime });
    } else {
      res.status(404).json({ message: "Break Time not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
slotController.deleteBreakTime = async function (req, res) {
  try {
    const deletedBreakTime = await MemberBreakTime.findByIdAndDelete(
      req.params.id
    );
    if (deletedBreakTime) {
      res.json({ message: "BreakTime deleted successfully" });
    } else {
      res.status(404).json({ message: "BreakTime not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
slotController.getShiftDayByMemberId = async function (req, res) {
  try {
    const shifts = await MemberShift.find({ member_id: req.params.member_id });
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
slotController.updateShiftTime = async function (req, res) {
  try {
    const shiftData = req.body.data

    const memberShiftArray = []
    for (let shift of shiftData) {
      const { member_id, salon_id, slot_day, start_time, end_time, shift_id } = shift
      const updateDate = new Date()

      const memberShift = await MemberShift.findByIdAndUpdate(
        {
          _id: shift_id, // Add this condition to filter by shift_id
        },
        {
          $set: {
            start_time: start_time,
            end_time: end_time,
            updated: updateDate
          },
        },
        { new: true }
      );
      if (memberShift) {
        memberShiftArray.push(memberShift)
        const result = await Slot.updateMany(
          { member_id: member_id, salon_id: salon_id, slot_day: slot_day },
          { $set: { start_time: start_time, end_time: end_time, updated: updateDate } }
        );
      }
    }

    return res
      .status(200)
      .json({ msg: "Shift Time updated successfully", memberShiftArray });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
slotController.checkSlotExistOrNot = async function (req, res) {
  try {
    const { slot_id, time } = req.query
    const booking_service = await BookingService.find({
      slot_id: slot_id,
      status: { $in: ['paid', 'completed'] },
      booking_time: time
    })
      .select('slot_id booking_time')
      .populate({
        path: 'service_id',
        select: 'period' // Only select the 'period' field from the 'service_id' document
      })
      .sort({ created_date: -1 });

    // Group the memberShiftData by slot_id
    const groupedData = {};

    // console.log(booking_service)
    // Iterate over memberShiftData and group by shift_id
    for (const bookingServiceData of booking_service) {
      if (!groupedData[bookingServiceData.booking_time]) {
        groupedData[bookingServiceData.booking_time] = [];
      }
      groupedData[bookingServiceData.booking_time].push(bookingServiceData);
    }

    const member = await Member.findOne({
      _id: req.params.member_id,
    })

    const member_capacity = member.capacity

    // console.log("-----------groupedData",groupedData)
    const disableSlot = []
    for (let key of Object.keys(groupedData)) {
      let element = groupedData[key]
      let end_period = element.map((val) => parseInt(val.service_id.period))
      end_period.sort((a, b) => b - a)
      let end_time = calculateEndTime(key, end_period[0])
      const time_string = `${key}, ${end_time}`

      console.log("-------------member_capacity", member_capacity)
      if ((element && element.length == member_capacity) || (member_capacity == null)) {
        disableSlot.push(time_string)
      }
    }
    disableSlot.length > 0 ? res.status(201).json({ msg: 'Already booked', disableSlot }) : res.status(201).json({ msg: 'Not booked yet', disableSlot })

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = slotController;
