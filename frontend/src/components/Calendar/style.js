import { Box, styled } from "@mui/material";

const StyledCalendar = styled(Box)(({ theme }) => ({
  '.react-calendar__tile': {
    margin: '2px 0',
    height: '60px',
    fontSize: '14px',
    color: 'white',
    borderRadius: '12px',
    '&:hover': {
      background: 'transparent !important',
    },
    // Remove or neutralize focus state so that clicking does not change the color.
    '&:focus': {
      background: 'transparent !important',
      color: 'white !important',
    },
    '&:disabled': {
      backgroundColor: 'transparent !important',
      color: '#bdbdbd'
    },
    [theme.breakpoints.down('sm')]: {
      height: '40px',
      fontSize: '12px',
    }
  },

  '.mycal': {
    borderRadius: '15px',
    overflow: 'hidden',
    backgroundColor: '#141414',
    width: '100%',
    height: '100%',
    borderColor: 'transparent',
  },

  // Override the default styling for today's date.
  '.react-calendar__tile--now': {
    background: 'transparent !important',
    color: 'white !important',
  },

  // New style: Color booked dates with a green background.
  '.booked': {
    backgroundColor: '#009688 !important',
    color: 'white !important',
  },

  // Navigation label styling.
  '.react-calendar__navigation__label': {
    color: 'white',
    backgroundColor: 'transparent !important',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },

  // Navigation arrow styling.
  '.react-calendar__navigation__arrow': {
    color: 'white',
    backgroundColor: 'transparent !important',
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },

  // Weekday abbreviation styling.
  '.react-calendar__month-view__weekdays__weekday abbr': {
    color: '#009688',
    fontSize: '14px',
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px',
    },
  },

  '.react-calendar__month-view__weekdays': {
    // Additional styling if needed.
  },
}));

export { StyledCalendar };
