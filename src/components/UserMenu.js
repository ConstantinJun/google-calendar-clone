import * as React from 'react';
import {useContext, useRef} from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import GlobalContext from "../context/GlobalContext";
import LoginItem from "./user-menu/LoginItem";

export default function UserMenu() {
  const logoutEventRef = useRef(null);

  const {
    dispatchCalEvent,
  } = useContext(GlobalContext);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
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
    if (logoutEventRef.current) {
      logoutEventRef.current();
    }
  }
  return (<div>
    <Button
      id="basic-button"
      aria-controls={open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}
    >
      <span>
        <FontAwesomeIcon icon={faCircleUser} size={"2x"}/>
      </span>
    </Button>
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem onClick={handleClose}>Profile</MenuItem>
      <MenuItem onClick={handleClose}>Feedback</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
    <LoginItem logoutEvent={logoutEventRef}/>
  </div>);
}