import React, {useEffect, useMemo, useReducer, useState,} from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";

function savedEventsReducer(state, {type, payload}) {
  switch (type) {
    case "push":
      if (state.some(obj => obj.id === payload.id)) {
        return [...state];
      } else {
        return [...state, payload];
      }
    case "update":
      return state.map((evt) => evt.id === payload.id ? payload : evt);
    case "delete":
      return state.filter((evt) => evt.id !== payload.id);
    default:
      throw new Error();
  }
}

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  const [savedEvents, dispatchCalEvent] = useReducer(savedEventsReducer, [], () => {
    updateCalendarItems();
    const storageEvents = localStorage.getItem("savedEvents");
    try {
      const parsedJson = JSON.parse(storageEvents);
      if (Array.isArray(parsedJson)) {
        return parsedJson;
      }
    } catch (e) {
      //ignore
    }
    return [];
  });

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) => labels
      .filter((lbl) => lbl.checked)
      .map((lbl) => lbl.label)
      .includes(evt.label));
  }, [savedEvents, labels]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
        const currentLabel = prevLabels.find((lbl) => lbl.label === label);
        return {
          label, checked: currentLabel ? currentLabel.checked : true,
        };
      });
    });
  }, [savedEvents]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  function updateLabel(label) {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }

  function updateCalendarItems() {
    const authToken = localStorage.getItem("authToken");

    const year = dayjs().year();
    let monthAtStart = dayjs(new Date(year, Math.floor(dayjs().month()), 1));
    const firstDayOfTheMonth = monthAtStart.day();
    let currentMonthCount = 1 - firstDayOfTheMonth;
    let firstDayOfTable = dayjs(new Date(year, Math.floor(dayjs().month()), currentMonthCount));

    let nextMonthAtStart = dayjs(new Date(year, Math.floor(dayjs().month()) + 1, 1));
    const nextDayOfTheNextMonth = nextMonthAtStart.day();
    let currentNextMonthCount = 7 - nextDayOfTheNextMonth;

    let lastDayOfTable = dayjs(new Date(year, Math.floor(dayjs().month()) + 1, currentNextMonthCount));

    const startDate = firstDayOfTable.format("YYYY-MM-DD");
    const endDate = lastDayOfTable.format("YYYY-MM-DD");
    if (authToken) {
      fetch("http://localhost:8080/calendar/event?username=slendybear&startDate=" + startDate + "&endDate=" + endDate,
        {
          method: "GET",
          mode: "cors",
          headers: {
            Authorization: `Bearer ` + authToken,
          },
        }).then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        if (resp.status === 401 && localStorage.getItem("authToken")) {
          clearEvents();
          localStorage.removeItem("authToken");
        }

        let errorResponse = "Error on getting data.";
        resp.json().then(json => {
          errorResponse = json.errorMessage;
        });
        window.location.reload();
      }).then(json => {
        const mapResult = json.map(obj => {
          return {
            id: obj.eventId,
            title: obj.title,
            day: dayjs(new Date(obj.startDate)).valueOf(),
            user: ["April Tucker", "Ralph Hubbard"],
            description: obj.notes,
            label: "purple"
          }
        });
        localStorage.setItem("savedEvents", JSON.stringify(mapResult));

        JSON.parse(localStorage.getItem("savedEvents")).forEach(obj => {
          dispatchCalEvent({
            type: "push",
            payload: obj,
          });
        });
      });
    }
  }

  function clearEvents() {
    JSON.parse(localStorage.getItem("savedEvents")).forEach(obj => {
      dispatchCalEvent({
        type: "delete",
        payload: obj,
      });
    });
  }

  return (<GlobalContext.Provider
    value={{
      monthIndex,
      setMonthIndex,
      smallCalendarMonth,
      setSmallCalendarMonth,
      daySelected,
      setDaySelected,
      showEventModal,
      setShowEventModal,
      dispatchCalEvent,
      selectedEvent,
      setSelectedEvent,
      savedEvents,
      setLabels,
      labels,
      updateLabel,
      filteredEvents,
      updateCalendarItems,
      clearEvents,
      showUserDetails,
      setShowUserDetails,
      authToken,
      setAuthToken,
    }}
  >
    {props.children}
  </GlobalContext.Provider>);
}
