const mongoose = require('mongoose');
const BookingService = require('../models/bookingServiceModel'); // Update the path to your model file

var path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const stripe = require('stripe')('your_secret_key');


// Connect to MongoDB
var connectDB = require('../utils/db');
const Slot = require('../models/slotModel');
const MemberShift = require("../models/memberShiftModel");
const moment = require('moment');
const { getWeekDay } = require('../utils/common');

connectDB()

async function createSlots() {
  try {
    const memberShiftsData = await MemberShift.find({}); // Fetch all member shifts
    const slotDataArray = [];

    // Group the data by member_id
    const groupedMemberShifts = {};

    // Iterate through memberShiftsData and group by member_id
    memberShiftsData.forEach(memberShift => {
      if (!groupedMemberShifts[memberShift.member_id]) {
        groupedMemberShifts[memberShift.member_id] = [];
      }
      groupedMemberShifts[memberShift.member_id].push(memberShift);
    });

    const memberIds = Object.keys(groupedMemberShifts);

    // console.log(memberIds)
    for(let memberId of memberIds){
      const memberShifts = groupedMemberShifts[memberId];
       await addSlot(memberShifts)
    }

    // Do recurring payment
    // await doRecurring()
    console.log("Slots created successfully.");
  } catch (error) {
    console.error("Error creating slots:", error);
  } finally {
    mongoose.disconnect(); // Close the database connection
  }
}
async function addSlot(memberShiftsData){
  const shiftMap = new Map()
  for(let item of memberShiftsData){
    shiftMap.set(item.shift_day,item)
  }
  console.log("shiftMap",shiftMap)
  // Prepare req data for slot (for each day from today to next month)
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() + 1); // +1 to go to the next month
  startDate.setDate(0);

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 2); // +1 to go to the next month
  endDate.setDate(0);

  let currentDate = startDate;
  const slotDataArray = [];

  while (currentDate <= endDate) {
    
    // Construct the date string in the format "yyyy-mm-dd"
    let  slot_Date = moment(currentDate).format('YYYY-MM-DD');
     console.log(slot_Date)
    const slot_day = getWeekDay(currentDate.getDay())
    const shiftData  =  shiftMap.get(slot_day)
    if(shiftData){
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
  console.log("----slotDataArray",slotDataArray)

  // Create slot documents for each day
  const newSlots = await Slot.create(slotDataArray);

}

// Execute the function
cron.schedule('0 23 28-31 * *', () => {
  console.log('script at 11 pm on the last day of every month');
  createSlots();;
});
