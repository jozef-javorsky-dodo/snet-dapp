import React from "react";
import { withStyles } from "@material-ui/styles";
import CloseIcon from "@material-ui/icons/Close";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

import { useStyles } from "./styles";

const UpdateNotificationBar = ({ classes, showNotification, onCloseClick }) => {
  if (!showNotification) return null;
  return (
    <div className={classes.updateNotificationBar}>
      <VolumeUpIcon />
      <p>
        <span>Phase 2 white paper avaliable now! </span>
        <a href="#" title="Read More">
          Read more on our official blog post.
          <ArrowForwardIosIcon />
        </a>
      </p>
      <CloseIcon className={classes.closeIcon} onClick={onCloseClick} />
    </div>
  );
};

export default withStyles(useStyles)(UpdateNotificationBar);
