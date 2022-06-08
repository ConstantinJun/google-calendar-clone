import React, {useContext, useState} from "react";
import GlobalContext from "../context/GlobalContext";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import {
  Avatar, Box, Grid, Modal, Paper, TextField, Stack, Chip, Button, Icon, IconButton, Tooltip, Divider
} from "@mui/material";
import {Description, Label} from "@mui/icons-material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";

const labelsClasses = ["indigo", "gray", "green", "blue", "red", "purple",];

export default function EventModal() {
  const {
    authToken, setShowEventModal, daySelected, selectedEvent, clearEvents, updateCalendarItems,
  } = useContext(GlobalContext);

  const [guests, setGuests] = React.useState(() => selectedEvent ? selectedEvent.guests : []);
  const [currentGuest, setCurrentGuest] = React.useState("");
  const [startTimeSelected, setStartTimeSelected] = React.useState(selectedEvent ? dayjs(selectedEvent.startDate) : dayjs(new Date()));
  const [endTimeSelected, setEndTimeSelected] = React.useState(selectedEvent ? dayjs(selectedEvent.endDate) : dayjs(new Date()));

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [description, setDescription] = useState(selectedEvent ? selectedEvent.description : "");
  const [selectedLabel, setSelectedLabel] = useState(selectedEvent ? labelsClasses.find((lbl) => lbl === selectedEvent.label) : labelsClasses[0]);

  function handleSubmit(e) {
    e.preventDefault();
    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      startDate: startTimeSelected,
      endDate: endTimeSelected,
      guests,
      id: selectedEvent ? selectedEvent.id : Date.now(),
    };
    if (selectedEvent) {
      if (authToken) {
        fetch("http://localhost:8080/calendar/event",
          {
            method: "PUT",
            mode: "cors",
            body: JSON.stringify({
              eventId: selectedEvent.id,
              notes: calendarEvent.description,
              title: calendarEvent.title,
              rgbColor: calendarEvent.label,
              startDate: dayjs(calendarEvent.startDate).format("YYYY-MM-DDTHH:mm:ss"),
              endDate: dayjs(calendarEvent.endDate).format("YYYY-MM-DDTHH:mm:ss"),
              guests: calendarEvent.guests.map((guest) => ({
                email: guest,
                responseNote: "Maybe will attend.",
                responseStatus: "TENTATIVE"
              }))
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ` + authToken,
            },
          }).then(resp => {
          if (resp.ok) {
            setShowEventModal(false);
            updateCalendarItems();
          } else if (resp.status === 401 && localStorage.getItem("authToken")) {
            clearEvents();
            localStorage.removeItem("authToken");
          }
        });
      }
    } else {
      if (authToken) {
        fetch("http://localhost:8080/calendar/event",
          {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
              notes: calendarEvent.description,
              title: calendarEvent.title,
              rgbColor: calendarEvent.label,
              startDate: daySelected.format("YYYY-MM-DDT") + dayjs(calendarEvent.startDate).format("HH:mm:ss"),
              endDate: daySelected.format("YYYY-MM-DDT") + dayjs(calendarEvent.endDate).format("HH:mm:ss"),
              guests: calendarEvent.guests.map((guest) => ({
                email: guest,
                responseNote: "Maybe will attend.",
                responseStatus: "TENTATIVE"
              }))
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ` + authToken,
            },
          }).then(resp => {
          if (resp.ok) {
            setShowEventModal(false);
            updateCalendarItems();
          } else if (resp.status === 401 && localStorage.getItem("authToken")) {
            clearEvents();
            localStorage.removeItem("authToken");
          }
        });
      }
    }
  }

  function addNewGuestEmail() {
    console.log(endTimeSelected);
    if (currentGuest && !guests.some(obj => obj === currentGuest)) {
      setGuests([...guests, currentGuest]);
    }
    setCurrentGuest("");
  }

  return (<div className="h-screen w-full fixed left-0 top-0 flex justify-center items-center">
    <form className="bg-white rounded-lg shadow-2xl w-1/4">
      <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
        <div>
          {selectedEvent && (<span
            onClick={() => {
              fetch("http://localhost:8080/calendar/event?id=" + selectedEvent.id,
                {
                  method: "DELETE",
                  mode: "cors",
                  headers: {
                    Authorization: `Bearer ` + authToken,
                  },
                }).then(resp => {
                if (resp.ok) {
                  setShowEventModal(false);
                  updateCalendarItems();
                } else if (resp.status === 401 && localStorage.getItem("authToken")) {
                  clearEvents();
                  localStorage.removeItem("authToken");
                }
              });

            }}
            className="material-icons-outlined text-gray-400 cursor-pointer"
          >
                delete
              </span>)}
          <button onClick={() => setShowEventModal(false)}>
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
          </button>
        </div>
      </header>
      <div className="p-3">
        <div className="grid grid-cols-12 items-end gap-y-5 ">
          <div className="col-span-1">
            <Tooltip title="Title">
            <span className="material-icons-outlined text-gray-400">
              title
            </span>
            </Tooltip>
          </div>

          <div className="col-span-11">
            <input
              type="text"
              name="title"
              placeholder="Add title"
              value={title}
              required
              className="pt-3 border-0 text-gray-600 text-xl font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="col-span-1">
            <Tooltip title="Description">
              <span className="material-icons-outlined text-gray-400">
                segment
              </span>
            </Tooltip>
          </div>

          <div className="col-span-11">
            <input
              type="text"
              name="description"
              placeholder="Add a description"
              value={description}
              required
              className="pt-3 border-0 text-gray-600 pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="col-span-12"><Divider/></div>

          <div className="col-span-1">
            <Tooltip title="Date">
            <span className="material-icons-outlined text-gray-400">
              today
            </span>
            </Tooltip>
          </div>

          <div className="col-span-11">
            <div>
              <p>{daySelected.format("dddd, MMMM DD")}</p>
            </div>
          </div>


          <div className="col-span-1">
            <Tooltip title="Time Range">
            <span className="material-icons-outlined text-gray-400">
              schedule
            </span>
            </Tooltip>
          </div>

          <div className="col-span-11">
            <Grid container spacing={1}>
              <Grid key="1" item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Start Time"
                    value={startTimeSelected}
                    onChange={(val) => setStartTimeSelected(val)}
                    renderInput={(params) => <TextField {...params} sx={{margin: "10px 0 0 0"}} size="small"/>}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid key="2" item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="End Time"
                    value={endTimeSelected}
                    onChange={(val) => setEndTimeSelected(val)}
                    renderInput={(params) => <TextField {...params} sx={{margin: "10px 0 0 0"}} size="small"/>}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </div>

          <div className="col-span-12"><Divider/></div>

          <div className="col-span-1">
            <Tooltip title="Guests">
            <span className="material-icons-outlined text-gray-400">
              <PersonAddAltIcon/>
            </span>
            </Tooltip>
          </div>

          <div className="col-span-11">
            <Grid container direction="column" spacing={2}>
              <Grid key="1" item>
                List of guests:
                <Grid container>
                  {guests.map((delGuest) => (<Grid key={delGuest} item xs={6}>
                    <Chip key={delGuest} label={delGuest} variant="outlined" onDelete={() => {
                      setGuests(guests.filter(guest => guest !== delGuest));
                    }}/>
                  </Grid>))}
                </Grid>
              </Grid>
              <Grid key="2" item>
                <span/>
              </Grid>
              <Grid key="3" item>
                <TextField
                  label="Guest email to add"
                  size="small"
                  value={currentGuest}
                  onChange={ev => setCurrentGuest(ev.target.value)}
                ></TextField>
                <IconButton
                  variant="contained"
                  onClick={addNewGuestEmail}
                >
                  <AddIcon fontSize={"inherit"}/>
                </IconButton>
              </Grid>
            </Grid>
          </div>

          <div className="col-span-1">

            <Tooltip title="Label">
              <span className="material-icons-outlined text-gray-400">
                bookmark_border
              </span>
            </Tooltip>
          </div>

          <div className="col-span-11">
            <div className="flex gap-x-2">
              {labelsClasses.map((lblClass, i) => (<span
                key={i}
                onClick={() => setSelectedLabel(lblClass)}
                className={`bg-${lblClass}-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
              >
                  {selectedLabel === lblClass && (<span className="material-icons-outlined text-white text-sm">
                      check
                    </span>)}
                </span>))}
            </div>
          </div>


        </div>
      </div>
      <footer className="flex justify-end border-t p-3 mt-5">
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </footer>
    </form>
  </div>);
}
