import React from "react";

const GlobalContext = React.createContext({
  monthIndex: 0,
  setMonthIndex: (index) => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: (index) => {},
  daySelected: null,
  setDaySelected: (day) => {},
  showEventModal: false,
  setShowEventModal: () => {},
  dispatchCalEvent: ({ type, payload }) => {},
  savedEvents: [],
  selectedEvent: null,
  setSelectedEvent: () => {},
  setLabels: () => {},
  labels: [],
  updateLabel: () => {},
  filteredEvents: [],
  updateCalendarItems: () => {},
  clearEvents: () => {},
  showUserDetails: false,
  setShowUserDetails: () => {},
  authToken: "",
  setAuthToken: () => {},
  showFeedbackPage: false,
  setShowFeedbackPage: () => {},
});

export default GlobalContext;
