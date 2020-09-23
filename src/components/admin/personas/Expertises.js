import React, { Component } from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
// import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import MaterialTable from "material-table";

import { Redirect } from "react-router";
import { Link } from "react-router-dom";

import PersonasData from "../../../data/PersonasData";

const styles = theme => ({
  affected: {
    textAlign: "right"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  heroContent: {
    margin: "0 auto",
    padding: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 6}px`
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  paperRoot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  inline: {
    display: "inline"
  }
});

class Expertises extends Component {
  constructor(props) {
    super(props);
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));
    this.state = {
      statuses: [],
      isAuthenticated: auth_params ? auth_params.isAuthenticated : false,

      snackBarOpen:
        props.location !== undefined &&
        props.location.state !== undefined &&
        props.location.state.snackBarOpen !== undefined
          ? props.location.state.snackBarOpen
          : false,
      snackBarContent:
        props.location !== undefined &&
        props.location.state !== undefined &&
        props.location.state.snackBarContent !== undefined
          ? props.location.state.snackBarContent
          : ""
    };

    this.fetchProfessionalExpertises(auth_params.currentUser.person.id);
  }

  async fetchProfessionalExpertises(id) {
    const expertises = await PersonasData.getProfessionalExpertises(id);

    if (expertises !== undefined) {
      const status = expertises.map(rawStat => {
        return {
          id: rawStat.id,
          name: rawStat.service.title,
          category: rawStat.service.category,
          prix: rawStat.hourlyRate
        };
      });
      this.setState({
        statuses: status
      });
    }
  }

  render() {
    const classes = this.props.classes;

    if (this.state.isAuthenticated !== true) {
      return (
        <Redirect
          push
          to={{
            pathname: "/login",
            state: {
              snackBarOpen: true,
              snackBarContent:
                "Vous devez vous connecter. Si vous n'avez pas de compte, vous devrez vous incrire."
            }
          }}
        />
      );
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <div className={classes.heroContent}>
            <React.Fragment>
              <Typography
                component="h1"
                variant="h4"
                align="left"
                color="textPrimary"
                gutterBottom
              >
                Mes services
              </Typography>
              <Grid
                container
                spacing={24}
                direction="row"
                justify="flex-end"
                alignItems="baseline"
              >
                <Grid item>
                  <Button
                    component={Link}
                    to={"/nouvelexpertise"}
                    variant="outlined"
                    size="large"
                    color="primary"
                  >
                    Nouveau service
                  </Button>
                </Grid>
              </Grid>
              <br />
              <MaterialTable
                data={this.state.statuses}
                columns={[
                  {
                    title: "Service",
                    field: "name"
                  },
                  {
                    title: "Categorie",
                    field: "category"
                  },
                  {
                    title: "Prix",
                    field: "prix"
                  }
                ]}
                actions={[
                  {
                    icon: "delete",
                    tooltip: "Annuler",
                    onClick: (event, rowData) => {
                      if (rowData.billed) {
                        // alert(
                        //   "Vous ne pouvez pas supprimer une résérvation facturée"
                        // );
                      } else {
                        // this.deleteReservation(rowData.id);
                      }
                    }
                  }
                ]}
                localization={{
                  actions: ""
                }}
                options={{
                  columnsButton: false,
                  filtering: false,
                  toolbar: false,
                  pageSize: 10
                }}
              />
            </React.Fragment>
          </div>
          {
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={this.state.snackBarOpen}
              autoHideDuration={6000}
              message={
                <span id="message-id">{this.state.snackBarContent}</span>
              }
            />
          }
        </main>
      </React.Fragment>
    );
  }
}

Expertises.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Expertises);
