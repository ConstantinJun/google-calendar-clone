import * as React from 'react';
import {useContext, useEffect} from "react";
import {Avatar, Box, Grid, Modal, Paper, TextareaAutosize, TextField, Typography} from "@mui/material";
import GlobalContext from "../../context/GlobalContext";
import Button from "@mui/material/Button";

export default function FeedbackDialog() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const {
    showFeedbackPage, setShowFeedbackPage,
  } = useContext(GlobalContext);


  useEffect(() => {
  }, [showFeedbackPage])

  const sendFeedback = () => {
    //TODO: Add sending feedback
    closeModal();
  }

  const closeModal = () => {
    setShowFeedbackPage(false);
  }

  return (
    <div>
      <Modal open={showFeedbackPage}
             aria-labelledby="modal-modal-title"
             aria-describedby="modal-modal-description"
      >
        <Box sx={{...style, width: 800}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Leave your feedback!
          </Typography>
          <hr/>
          <Typography id="modal-modal-description" sx={{mt: 2}}>
            <Grid
              container
              direction="column"
              alignItems="center"
              spacing={3}
            >

              <Grid item sx={{width: '100%'}}>
                <TextField label="Email or Full Name" size="small" fullWidth/>
              </Grid>
              <Grid item sx={{width: '100%'}}>
                <TextField label="Subject" size="small" fullWidth/>
              </Grid>
              <Grid item sx={{width: '100%'}}>
                <TextareaAutosize aria-label="Your feedback" fullWidth minRows={10} style={{width: '100%'}}/>
              </Grid>
              <Grid item>
                <span/>
              </Grid>
            </Grid>
            <Grid
              container
              direction="column"
              alignItems="end"
              spacing={3}
            >
              <Grid item>
                <Button sx={{margin: `0 45px 0 0`}}
                        variant="contained"
                        size="large"
                        onClick={sendFeedback}
                >
                  Send Feedback
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}