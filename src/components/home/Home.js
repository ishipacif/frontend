import React, { Component } from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
// import PersonaTypes from "../../data/PersonaTypes";
import SiteHeader from "../../shared/SiteHeader";
import SiteFooter from "../../shared/SiteFooter";
// import PersonaTypesTiers from "./PersonaTypesTiers";
import ProfessionalListing from "./ProfessionalListing";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

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
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  }
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { tiers: [], open: false };
    // this.get_tiers();
  }

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  // async get_tiers() {
  //   const rawPersonaTypes = await PersonaTypes.getPersonaTypesForFront();
  //
  //   const personaTypes = rawPersonaTypes.map(function(personaType) {
  //     return {
  //       id: personaType.id,
  //       title: personaType.name,
  //       count: personaType.confirmed_personas.length,
  //       description: [personaType.description],
  //       buttonText: "Inscrivez-vous!",
  //       buttonVariant: "contained"
  //     };
  //   });
  //
  //   this.setState({
  //     tiers: personaTypes
  //   });
  // }

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <CssBaseline />
        <SiteHeader />
        <main className={classes.layout}>
          {/* Hero unit */}
          <div className={classes.heroContent}>
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              House Cleaning
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="textSecondary"
              component="p"
            >
              Nous mettons en relation les clients et les prestataires de
              services (professionels) à domicile dans la même région.
              <br />
              Les clients et les prestataires de services s’inscrivent
              préalablement sur le site internet pour pouvoir offrir ou
              bénéficier des services proposés
            </Typography>
          </div>
          {/* End hero unit */}
          <Button
            component={Link}
            to={"/signup/"}
            fullWidth
            variant="contained"
            color="primary"
          >
            Inscrivez-vous
          </Button>
          <br />
          <br />
          <ProfessionalListing />
        </main>
        <SiteFooter />
      </React.Fragment>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
