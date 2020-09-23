import React, { Component } from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import SiteHeader from "../../shared/SiteHeader";
import SiteFooter from "../../shared/SiteFooter";
import ComeToOffice from "./ComeToOffice";
import SendEmail from "./SendEmail";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  heroContent: {
    maxWidth: 900,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  }
});

class Contact extends Component {
  constructor(props) {
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));
    super(props);
    this.state = {
      currentPersonaInfo: auth_params || undefined
    };
  }

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <CssBaseline />
        <SiteHeader currentPersonaInfo={this.state.currentPersonaInfo} />
        <main className={classes.layout}>
          {/* Hero unit */}
          <div className={classes.heroContent}>
            <Typography
              component="h1"
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Comment pouvons-nous vous aider ?
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              component="p"
            >
              Notre équipe d’assistance est disponible par e-mail, chat et
              téléphone, 24 h sur 24
            </Typography>
          </div>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
            spacing={16}
          >
            <Grid item xs={12} sm={12} md={7}>
              <SendEmail />
            </Grid>
            <Grid item xs={12} sm={12} md={5}>
              <br />
              <br />
              <ComeToOffice />
            </Grid>
          </Grid>
        </main>
        <SiteFooter currentPersonaInfo={this.state.currentPersonaInfo} />
      </React.Fragment>
    );
  }
}

Contact.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Contact);
