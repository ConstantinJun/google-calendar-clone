import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {Avatar, Grid, Paper, TextField} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LoginIcon from "@mui/icons-material/Login";
import Modal from "@mui/material/Modal";
import GlobalContext from "../../context/GlobalContext";

export default function LoginItem() {

  const {
    updateCalendarItems,
    dispatchCalEvent,
    authToken,
    setAuthToken,
  } = useContext(GlobalContext);

  useEffect(() => {
    checkToken();
  }, [authToken])

  const [open, setOpen] = React.useState(!localStorage.getItem("authToken"));

  function checkToken() {
    if (!authToken) {
      onLogout();
    }
  }

  const onLogout = () => {
    if (localStorage.getItem("authToken")) {
      localStorage.removeItem("authToken");

      try {
        JSON.parse(localStorage.getItem("savedEvents")).forEach(obj => {
          dispatchCalEvent({
            type: "delete",
            payload: obj,
          });
        });
      } catch (e) {
        //ignore
      }
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

  const handleClose = () => {
    setOpen(!localStorage.getItem("authToken"));
  };

  const [values, setValues] = React.useState({
    showPassword: false,
  });

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };


  const onSubmit = (e) => {
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
        setAuthToken(json.jwtToken);
        handleClose();
      })
      .then(() => {
        updateCalendarItems();
      });
  };

  function onKeyPress(event) {
    if (event.key === 'Enter') {
      onLogin();
    }
  }

  const signOut = () => {
    changeStatus(false);
  };
  const signIn = () => {
    changeStatus(true);
  };

  return (
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
                    onKeyDown={onKeyPress}
                    required={true}
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
                  onClick={onSubmit}
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
  );
}