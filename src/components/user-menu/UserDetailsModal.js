import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {Avatar, Box, Grid, Modal, Paper, TextField} from "@mui/material";
import GlobalContext from "../../context/GlobalContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";

export default function UserDetailsModal() {
  const {
    showUserDetails, setShowUserDetails,
  } = useContext(GlobalContext);


  useEffect(() => {
    openModal();
  }, [showUserDetails])

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(0);

  const openModal = () => {
    if (localStorage.getItem("authToken")) {
      fetch("http://localhost:8080/user", {
        method: "GET", headers: {
          "Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("authToken")
        }, mode: "cors"
      }).then((resp) => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error("Error on getting user data.");
        }
      }).then((json) => {
        setId(json.id);
        setUsername(json.username);
        setFirstName(json.firstName);
        setLastName(json.lastName);
        setEmail(json.email);
      });
    }
  }

  const saveUserChanges = () => {
    console.log("Saving user changes! for this: ", {id, username, email, firstName, lastName})

    fetch("http://localhost:8080/user", {
      method: "PUT", headers:
        {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("authToken")
        },
      body: JSON.stringify({
        id, username, firstName, lastName, email
      }),
      mode: "cors"
    }).then((resp) => {
      if (resp.ok) {
        return "OK";
      } else {
        throw new Error("Error on getting user data.");
      }
    });

    closeModal();
  }

  const closeModal = () => {
    setShowUserDetails(false);
  }


  return (<Modal open={showUserDetails}
                 aria-labelledby="modal-modal-title"
                 aria-describedby="modal-modal-description">
    <Box sx={{position: "absolute", top: "20%", left: "40%"}} onKeyDown={(e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    }}>
      <Paper
        elevation={3}
        sx={{padding: `30px 20px`, width: 600}}>
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
              sx={{margin: `0 20px 0 0`}}
              label="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            ></TextField>
            <TextField
              label="Email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></TextField>
          </Grid>
          <Grid item>

          </Grid>
          <Grid item>
            <TextField sx={{margin: `0 20px 0 0`}}
                       label="First Name"
                       value={firstName}
                       onChange={(e) => {
                         setFirstName(e.target.value);
                       }}
            ></TextField>
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            ></TextField>
          </Grid>
          <Grid item>

            <Button sx={{margin: `0 10px`}}
                    variant="contained"
                    onClick={saveUserChanges}
            >
              Save
            </Button>
            <Button
              variant="contained"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>

  </Modal>)
}