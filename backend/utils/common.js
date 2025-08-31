module.exports = {
    getWeekDay : function (day){
      const weekDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      return weekDay[day]
    },
    calculateEndTime: function(startTime, totalMinutes = 60) {
      console.log("Received Start Time:", startTime);
      console.log("Received Total Minutes:", totalMinutes);
  
      if (!startTime || typeof startTime !== 'string') {
          console.error("❌ Invalid startTime:", startTime);
          throw new Error("Invalid startTime provided to calculateEndTime");
      }
  
      let parts = startTime.split(/:|\s/);
      console.log("Split Parts:", parts);
  
      // Auto-fix missing AM/PM
      if (parts.length === 2) {
          console.warn("⚠️ Missing AM/PM, assuming AM for:", startTime);
          startTime += " AM"; // Default to AM
          parts = startTime.split(/:|\s/);
      }
  
      if (parts.length < 3) {
          console.error("❌ startTime format is incorrect:", startTime);
          throw new Error("startTime should be in 'HH:mm AM/PM' format.");
      }
  
      const [hoursStr, minutesStr, period] = parts;
      console.log("Extracted Hours:", hoursStr);
      console.log("Extracted Minutes:", minutesStr);
      console.log("Extracted Period:", period);
  
      let hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
  
      if (isNaN(hours) || isNaN(minutes)) {
          console.error("❌ Invalid number conversion:", { hours, minutes });
          throw new Error("Invalid time format in startTime.");
      }
  
      // Adjust hours for PM period
      if (period.toLowerCase() === 'pm' && hours !== 12) {
          hours += 12;
      } else if (period.toLowerCase() === 'am' && hours === 12) {
          hours = 0; // Midnight case
      }
  
      console.log("Adjusted Hours:", hours);
  
      // Calculate end time
      const startDate = new Date();
      startDate.setHours(hours);
      startDate.setMinutes(minutes);
      
      console.log("Start Date Object:", startDate);
  
      const endDate = new Date(startDate.getTime() + totalMinutes * 60000); // Convert minutes to milliseconds
      
      console.log("End Date Object:", endDate);
  
      // Format the end time as HH:mm AM/PM
      const endHours = endDate.getHours() % 12 || 12; // Convert 0 to 12
      const endMinutes = endDate.getMinutes();
      const endPeriod = endDate.getHours() >= 12 ? 'PM' : 'AM';
      const formattedEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')} ${endPeriod}`;
  
      console.log("🟢 Calculated End Time:", formattedEndTime);
  
      return formattedEndTime;
  },
  
  
   isDateDifferenceOneDay: function(slotDate, currentDate) {
    console.log(slotDate,currentDate)
    // Convert slot date and current date to Date objects
    const slotDateTime = new Date(slotDate).getTime();
    const currentDateTime = new Date(currentDate).getTime();

    // Calculate the difference in milliseconds
    const difference = Math.abs(currentDateTime - slotDateTime);

    console.log(difference)

    // Convert the difference from milliseconds to days
    const differenceInDays = difference / (1000 * 3600 * 24);

    console.log("differenceInDays",differenceInDays)
    // Check if the difference is exactly one day
    return differenceInDays === 2;
  }

  
}