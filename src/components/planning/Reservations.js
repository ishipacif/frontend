import React, { Component } from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
// import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";

import MaterialTable from "material-table";

import { Redirect } from "react-router";
import Moment from "react-moment";
import "moment-timezone";
import "moment/locale/fr";

// import SiteHeader from "../../shared/SiteHeader";
// import SiteFooter from "../../shared/SiteFooter";

import PlanningData from "../../data/PlanningData";
import PersonasData from "../../data/PersonasData";

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

class Reservations extends Component {
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

    this.getStatus("professionalId");
  }

  async deleteReservation(id) {
    const rawStatus = await PlanningData.deletePlanning(id);
    if (rawStatus !== undefined && rawStatus.status === 200) {
      this.getStatus("professionalId");
    }
    this.setState({
      snackBarOpen: true,
      snackBarContent: "Reservation annulée"
    });
  }

  async getStatus(personaType) {
    const customersList = await PersonasData.getPersonas("customers");
    const rawStatus = await PlanningData.getStatus(personaType);
    if (rawStatus !== undefined && customersList !== undefined) {
      const status = rawStatus.map(rawStat => {
        const persona = customersList.find(
          customer => customer.id === rawStat.customerId
        );

        return {
          id: rawStat.id,
          date: (
            <Moment format="DD/MMM/YYYY" locale="fr">
              {rawStat.startTime}
            </Moment>
          ),
          heures: (
            <div>
              <Moment format="HH:mm" locale="fr">
                {rawStat.startTime}
              </Moment>
              {" -> "}
              <Moment format="HH:mm" locale="fr">
                {rawStat.endTime}
              </Moment>
            </div>
          ),
          persona: (
            <div>
              {persona.firstName + " " + persona.lastName}
              <div>
                <Typography
                  color="textSecondary"
                  variant="caption"
                  component="i"
                >
                  {rawStat.expertise.service.title}
                </Typography>
              </div>
            </div>
          ),
          billed:
            rawStat.billingId !== undefined && rawStat.billingId !== null
              ? true
              : false,
          status:
            rawStat.billingId !== undefined && rawStat.billingId !== null
              ? "Facturée"
              : rawStat.status,
          cancel: rawStat.status
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
                Résérvations
              </Typography>

              <br />
              <MaterialTable
                data={this.state.statuses}
                columns={[
                  {
                    title: "Date",
                    field: "date"
                  },
                  {
                    title: "Heures",
                    field: "heures"
                  },
                  {
                    title: "Client et service",
                    field: "persona"
                  },
                  {
                    title: "Status",
                    field: "status"
                  }
                ]}
                actions={[
                  {
                    icon: "delete",
                    tooltip: "Annuler",
                    onClick: (event, rowData) => {
                      if (rowData.billed) {
                        alert(
                          "Vous ne pouvez pas supprimer une résérvation facturée"
                        );
                      } else {
                        this.deleteReservation(rowData.id);
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

Reservations.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Reservations);
