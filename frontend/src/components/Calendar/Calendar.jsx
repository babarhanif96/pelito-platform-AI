import React, { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { StyledCalendar } from './style';
import { useNavigate } from 'react-router';

const CustomCalendar = ({ bookedDates = [], setdate = () => { } }) => {

  const navigate = useNavigate();

  const handleDateClick = (date) => {
    const isBooked = bookedDates.some(
      (bookedDate) =>
        new Date(bookedDate).toDateString() === date.toDateString()
    );

    if (isBooked) {
      navigate(`/professional/appointments/list`); // Redirect to booking page with date param
    }
  };



  return (
    <div>
      <StyledCalendar>
        <Calendar
          tileClassName={({ date: tileDate, view }) => {
            if (view === 'month') {
              const isBooked = bookedDates.some(
                (bookedDate) =>
                  new Date(bookedDate).toDateString() === tileDate.toDateString()
              );
              return isBooked ? 'booked' : '';
            }
          }}
          className='mycal'
          onChange={(date) => {
            setdate(date)
            if(bookedDates?.length > 0){
              handleDateClick(date)
            }
          }}
        />
      </StyledCalendar>
    </div>
  );
};

export default CustomCalendar;
