import React from "react";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";

import Logo from "../../../assets/images/Logo.png";
import { useStyles } from "./styles";
import { NavData } from "./data";
import NavBar from "./NavBar";
import HeaderActions from "./HeaderActions";
import Title from "./Title";

const Header = ({ isLoggedIn }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={24}>
      <header className={classes.header}>
        <Grid item xs={3} sm={3} md={3} lg={3}>
          <Title Logo={Logo} title="SingularityNET" />
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <NavBar data={NavData} />
        </Grid>
        <Grid item xs={3} sm={3} md={3} lg={3}>
          <HeaderActions isLoggedIn={isLoggedIn} />
        </Grid>
      </header>
    </Grid>
  );
};

const mapStateToProps = state => ({ isLoggedIn: state.userReducer.login.isLoggedIn });

export default connect(mapStateToProps)(Header);