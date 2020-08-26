import React, { Component } from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import MaterialTable from "material-table";

import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import "moment-timezone";
import "moment/locale/fr";

import SiteHeader from "../../shared/SiteHeader";
import SiteFooter from "../../shared/SiteFooter";
import PlanningMenu from "../../shared/PlanningMenu";
import OrderMenu from "../../shared/OrderMenu";

import PlanningData from "../../data/PlanningData";

const styles = theme => ({
  affected: {
    textAlign: "right"
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

class Commande extends Component {
  constructor(props) {
    super(props);
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));
    this.state = {
      professionalPlannings: [],
      customerPlannings: [],
      statuses: [],
      isAuthenticated: auth_params ? auth_params.isAuthenticated : false,
      fixesPrices: auth_params ? auth_params.fixesPrices : undefined,

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

    this.getStatus();
    auth_params &&
      auth_params.fixesPrices === false &&
      this.getCustomerPlannings(this.state.statuses);
    auth_params &&
      auth_params.fixesPrices === true &&
      this.getProfessionalPlannings();
  }

  async getStatus() {
    const rawStatus = await PlanningData.getStatus();

    const status = rawStatus.map(function(rawStat) {
      return { id: rawStat.id, name: rawStat.name };
    });
    this.setState({
      statuses: status
    });
  }

  async getCustomerPlannings(statuses) {
    const rawCustomerPlannings = await PlanningData.getCustomerPlannings();

    const customerPlannings = rawCustomerPlannings.map(function(cPlanning) {
      return {
        id: cPlanning.id,
        date: (
          <div>
            <Moment format="DD/MMM/YYYY" locale="fr">
              {cPlanning.date}
            </Moment>
            <br />
            <Moment format="HH:mm" locale="fr">
              {cPlanning.start_hour}
            </Moment>
            {" - "}
            <Moment format="HH:mm" locale="fr">
              {cPlanning.end_hour}
            </Moment>
          </div>
        ),
        start_hour: cPlanning.start_hour,
        end_hour: cPlanning.end_hour,
        hour_count: (
          <div>
            <Typography variant="subtitle2" gutterBottom>
              {cPlanning.professional_full_name}
            </Typography>
            <Typography variant="caption" gutterBottom>
              {"Nombre d'heures: " + cPlanning.hour_count}
            </Typography>
          </div>
        ),
        prix: cPlanning.price,
        planning_amount: parseFloat(
          cPlanning.price * cPlanning.hour_count
        ).toFixed(1),
        status_id: cPlanning.status_id,
        customer_id: cPlanning.customer_id,
        status_name: (
          <OrderMenu
            planningId={cPlanning.id}
            statusName={cPlanning.status_name}
            statusId={cPlanning.status_id}
            customerId={cPlanning.customer_id}
          />
        ),
        service_id: cPlanning.service_id,
        service_name: (
          <div>
            {cPlanning.service_name}
            <br />
            <Moment format="DD/MMM/YYYY" locale="fr">
              {cPlanning.date}
            </Moment>
            <br />
            <Moment format="HH:mm" locale="fr">
              {cPlanning.start_hour}
            </Moment>
            {" - "}
            <Moment format="HH:mm" locale="fr">
              {cPlanning.end_hour}
            </Moment>
          </div>
        ),
        professional_full_name: cPlanning.professional_full_name,
        professional_full_address: cPlanning.professional_full_address
      };
    });

    this.setState({
      customerPlannings: customerPlannings
    });
  }

  async getProfessionalPlannings() {
    const rawProfessionalPlannings = await PlanningData.getProfessionalPlannings();

    const professionalPlannings = rawProfessionalPlannings.map(function(
      pPlanning
    ) {
      return {
        id: pPlanning.id,
        date: pPlanning.date,
        distance: pPlanning.distance,
        start_hour: pPlanning.start_hour,
        end_hour: pPlanning.end_hour,
        status_id: pPlanning.status.id,
        status_name: pPlanning.status.name,
        service_id: pPlanning.service.id,
        service_name: pPlanning.service.name,
        customer_full_name:
          pPlanning.customer.persona.first_name +
          " " +
          pPlanning.customer.persona.last_name,
        customer_email: pPlanning.customer.persona.email,
        customer_phone_number: pPlanning.customer.persona.phone_number,
        customer_plot_number: pPlanning.customer.persona.plot_number,
        customer_street_name: pPlanning.customer.persona.street_name,
        customer_city_name: pPlanning.customer.persona.city_name,
        customer_post_code: pPlanning.customer.persona.post_code,
        customer_geo_coords: pPlanning.customer.persona.geo_coords,
        customer_picture: pPlanning.customer.persona.picture
      };
    });

    this.setState({
      professionalPlannings: professionalPlannings
    });
  }

  customerOrders = plannings => {
    if (plannings.length === 0) {
      return <LinearProgress />;
    }

    return (
      <React.Fragment>
        <Typography
          component="h1"
          variant="h4"
          align="left"
          color="textPrimary"
          gutterBottom
        >
          Mes commandes
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
              to={"/ajoutercommande/0"}
              variant="outlined"
              size="large"
              color="primary"
            >
              Nouvelle commande
            </Button>
          </Grid>
        </Grid>
        <br />
        <MaterialTable
          data={plannings}
          columns={[
            {
              title: "Service, Date et Heures",
              field: "service_name"
            },
            {
              title: "Prestataire",
              field: "hour_count",
              type: "numeric"
            },
            {
              title: "Prix",
              field: "prix",
              type: "numeric"
            },
            {
              title: "Montant",
              field: "planning_amount",
              type: "numeric"
            },
            {
              title: "Status",
              field: "status_name"
            }
          ]}
          localization={{
            actions: ""
          }}
          options={{
            columnsButton: false,
            filtering: false,
            toolbar: false
          }}
        />
      </React.Fragment>
    );
  };

  professionalPlanning = plannings => {
    if (plannings.length === 0) {
      return (
        <React.Fragment>
          <Typography
            component="h1"
            variant="h6"
            align="left"
            color="textPrimary"
            gutterBottom
          >
            Chargement de votre planning...
          </Typography>
          <LinearProgress />
        </React.Fragment>
      );
    }

    const { classes } = this.props;
    return (
      <React.Fragment>
        <Typography
          component="h1"
          variant="h4"
          align="left"
          color="textPrimary"
          gutterBottom
        >
          Mon planning
        </Typography>
        <Paper className={classes.paperRoot} elevation={1}>
          <List className={classes.root}>
            {plannings.map(planning => (
              <React.Fragment key={"planning-Fragment-" + planning.id}>
                <ListSubheader>{planning.customer_full_name}</ListSubheader>
                <ListItem key={"planning-" + planning.id}>
                  <AccountCircle color="disabled" fontSize="large" />

                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography variant="body1" gutterBottom>
                          {planning.customer_street_name +
                            " " +
                            planning.customer_plot_number +
                            ", " +
                            planning.customer_city_name +
                            " " +
                            planning.customer_post_code}
                        </Typography>
                        <Typography variant="caption" gutterBottom>
                          {planning.distance + " km de chez vous."}
                        </Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          className={classes.inline}
                          color="textPrimary"
                        >
                          <Moment format="DD/MMM/YYYY" locale="fr">
                            {planning.date}
                          </Moment>
                          {", "}
                          <Moment format="HH:mm" locale="fr">
                            {planning.start_hour}
                          </Moment>
                          {" - "}
                          <Moment format="HH:mm" locale="fr">
                            {planning.end_hour}
                          </Moment>
                          {" ("}
                          <Moment from={planning.start_hour} locale="fr">
                            {planning.end_hour}
                          </Moment>
                          {")"}
                        </Typography>
                        {" — " + planning.service_name}
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <PlanningMenu
                      planningId={planning.id}
                      statusName={planning.status_name}
                      statusId={planning.status_id}
                      items={this.state.statuses}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </React.Fragment>
    );
  };

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
        <SiteHeader />
        <main className={classes.layout}>
          <div className={classes.heroContent}>
            {this.state.fixesPrices === true
              ? this.professionalPlanning(this.state.professionalPlannings)
              : this.customerOrders(this.state.customerPlannings)}
          </div>
          {this.state.fixesPrices === false ? (
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={this.state.snackBarOpen}
              autoHideDuration={6000}
              message={
                <span id="message-id">{this.state.snackBarContent}</span>
              }
            />
          ) : (
            ""
          )}
        </main>
        <SiteFooter />
      </React.Fragment>
    );
  }
}

Commande.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Commande);
