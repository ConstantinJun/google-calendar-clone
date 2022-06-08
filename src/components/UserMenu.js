import * as React from 'react';
import {useContext} from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import GlobalContext from "../context/GlobalContext";
import LoginItem from "./user-menu/LoginItem";
import UserDetailsModal from "./user-menu/UserDetailsModal";
import FeedbackDialog from "./user-menu/FeedbackDialog";

export default function UserMenu() {
  const {
    setShowUserDetails,
    setAuthToken,
    setShowFeedbackPage,
  } = useContext(GlobalContext);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfile = () => {
    setShowUserDetails(true);
    handleClose();
  }

  const handleFeedback = () => {
    setShowFeedbackPage(true);
    handleClose();
  }

  const handleLogout = () => {
    setAuthToken(null);
    handleClose();
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <MenuItem onClick={handleProfile}>Profile</MenuItem>
      <MenuItem onClick={handleFeedback}>Feedback</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
    <LoginItem/>
    <UserDetailsModal/>
    <FeedbackDialog/>

  </div>);
}