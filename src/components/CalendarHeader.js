import React, {useContext, useState} from "react";
import GlobalContext from "../context/GlobalContext";

import dayjs from "dayjs";

import {Avatar, Grid, Paper, TextField} from "@mui/material";
import Modal from "@mui/material/Modal";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

import Visibility from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function CalendarHeader() {
  const {
    monthIndex,
    setMonthIndex,
    updateCalendarContext,
  } = useContext(GlobalContext);

  const [open, setOpen] = React.useState(!localStorage.getItem("authToken"));
  const handleOpen = () => {
    if (localStorage.getItem("authToken")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("savedEvents");
    }
    handleClose();
  };
  const [status, changeStatus] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [statusResponse, setStatusResponse] = useState(false);
  const handleClose = () => {
    setOpen(!localStorage.getItem("authToken"));
  };

  const [values, setValues] = React.useState({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    );
  }

  const onSubmmit = (e) => {
    console.log(
      JSON.stringify({
        login: username,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName,
      })
    );

    fetch("http://localhost:8080/user", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      mode: "cors",
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName,
      }),
    }).then(() => changeStatus(false));
  };

  const onLogin = (e) => {
    fetch("http://localhost:8080/login", {
      method: "POST",
      mode: "cors",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        setStatusResponse(true);
        if (res.ok) {
          return res.json();
        } else {
          console.log(res.status);
          console.log(res.body);
          return res.json();
        }
      })
      .then((json) => {
        localStorage.setItem("authToken", json.jwtToken);
        handleClose();
      });
  };


  const signOut = () => {
    changeStatus(false);
  };
  const signIn = () => {
    changeStatus(true);
  };

  return (
    <header className="px-4 py-2 flex items-center">
      <h1 className="mr-10 text-xl text-gray-500 fond-bold">
        Calendar
      </h1>
      <button
        onClick={handleReset}
        className="border rounded py-2 px-4 mr-5"
      >
        Today
      </button>
      <button onClick={handlePrevMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_left
        </span>
      </button>
      <button onClick={handleNextMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          chevron_right
        </span>
      </button>
      <h2 className="ml-4 text-xl text-gray-500 font-bold flex-1">
        {dayjs(new Date(dayjs().year(), monthIndex)).format(
          "MMMM YYYY"
        )}
      </h2>
      <Button onClick={handleOpen} color="inherit">
        {!localStorage.getItem("authToken") ? 'Login' : 'Log-Out'}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={{position: "absolute", top: "20%", left: "40%"}}>
          {!status ? (
            <Paper
              elevation={3}
              sx={{padding: `30px 20px`, width: 500}}
            >
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={3}
              >
                <Grid item>
                  <Avatar>
                    <AccountCircleIcon></AccountCircleIcon>
                  </Avatar>
                </Grid>
                <Grid item>
                  <TextField
                    label="Username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  ></TextField>
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{m: 1, width: "25ch"}}
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={values.showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword ? (
                              <VisibilityOff/>
                            ) : (
                              <Visibility/>
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={onLogin}
                  >
                    Login
                  </Button>
                </Grid>
                <Grid item>
                  <Typography component="span">
                    You don't have an account?
                  </Typography>
                  <Button onClick={signIn} endIcon={<LoginIcon/>}>
                    Create New Account
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper
              elevation={3}
              sx={{padding: `30px 20px`, width: 500}}
            >
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={3}
              >
                <Grid item>
                  <Avatar>
                    <AccountCircleIcon></AccountCircleIcon>
                  </Avatar>
                </Grid>
                <Grid item>
                  <TextField
                    label="Username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                  ></TextField>
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{m: 1, width: "25ch"}}
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={values.showPassword ? "text" : "password"}
                      value={values.password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword ? (
                              <VisibilityOff/>
                            ) : (
                              <Visibility/>
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <TextField
                    label="Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  ></TextField>
                </Grid>
                <Grid item>
                  <TextField
                    label="Fisrt Name"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  ></TextField>
                </Grid>
                <Grid item>
                  <TextField
                    label="Last Name"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  ></TextField>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    endIcon={<LoginIcon/>}
                    onClick={onSubmmit}
                  >
                    Sign Up
                  </Button>
                </Grid>
                <Grid item>
                  <Typography component="span">
                    Already have an account?
                  </Typography>
                  <Button onClick={signOut} endIcon={<LoginIcon/>}>
                    Login
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      </Modal>

    </header>
  );
}
