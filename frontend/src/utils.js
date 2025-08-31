export const textVariant = (delay) => ({
  hidden: {
    y: 50,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'tween',
      duration: 1.25,
      delay,
    },
  },
});

export const FORMAT_ADDRESS = (addr, count) => {
  if (addr) {

      let x = 4

      if (count) {
          x = count
      }


      return `${addr.substring(0, x)}...${addr.slice(-x)}`;
  }
  return "";
};

export function replaceLinks(inputText) {
  const linkRegex = /(http[s]?:\/\/\S+)/gi;
  return inputText.replace(linkRegex, (match) => {
    return `<a style="color:#5162BC" href="${match}" target="_blank">${match}</a>`;
  });
}

export const FORMATDATE = (date) => {
  return date.toLocaleString('en-US', {
      weekday: 'short',  // Fri
      day: '2-digit',    // 28
      month: 'short',    // Feb
      year: 'numeric',   // 2025
      hour: '2-digit',   // 10
      minute: '2-digit', // 30
      hour12: true       // AM/PM format
  }).replace(',', ''); // Removes unwanted comma after the weekday
};

export const dateTime = (date) => {
  const givenDate = new Date(date); // Your given date
  const currentDate = new Date(); // Current date

  const difference = currentDate.getTime() - givenDate.getTime(); // Difference in milliseconds
  const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  const hoursDifference = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  ); // Convert milliseconds to hours
  let data = "";
  if (daysDifference > 0) {
    data = daysDifference + "d ago";
  } else {
    if (hoursDifference >= 1) {
      data = hoursDifference + "h ago";
    } else {
      data = "just now";
    }
  }
  return data;
};

export function convertTime(start_time) {
  //input : 10:00 AM or 8:00 PM
  if (start_time) {
    const convertedTime = new Date();
    console.log(start_time, "sttt");
    const [time, period] = start_time.split(" ");
    let [hours, minutes] = time.split(":");

    // Convert hours to 24-hour format if the period is PM
    if (period === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    }

    // Convert 12 AM to 00 hours
    if (period === "AM" && hours === "12") {
      hours = "00";
    }
    return convertedTime.setHours(
      parseInt(hours, 10),
      parseInt(minutes, 10),
      0
    );
  }
  // output : 1706688000038
}

export function getDateFormate(dateString) {
  //const dateString = "2024-01-31T11:21:34.349Z"; // input date format

  // Convert the string to a Date object
  const date = new Date(dateString);

  // Days of the week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract date components
  const dayOfWeek = daysOfWeek[date.getUTCDay()];
  const dayOfMonth = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  // Format the date string
  const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}, ${year}`;
  // out put : Wed, 31 Jan, 2024
  return formattedDate;
}

export const generateRandomEmail = () => {
  const domains = ["example.com", "test.com", "demo.org", "mail.net"];
  const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string
  const randomDomain = domains[Math.floor(Math.random() * domains.length)]; // Pick a random domain
  return `${randomString}@${randomDomain}`;
};

export function calculateEndTime1(time, duration) {
  // Original time
  const originalTime = new Date();
  let [hours1, minutes1] = time.split(":").map((part) => parseInt(part));
  originalTime.setHours(hours1, minutes1, 0); // Set the original time to 10:00 AM

  // Adding duration
  const newTime = new Date(originalTime.getTime() + duration * 60000); // 45 minutes in milliseconds

  // Formatting the new time
  const hours = newTime.getHours();
  const minutes = newTime.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${amOrPm}`;

  return formattedTime;
}

