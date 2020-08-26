import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";

import Paper from "@material-ui/core/Paper";

import withStyles from "@material-ui/core/styles/withStyles";
import LinearProgress from "@material-ui/core/LinearProgress";
import ArrowForward from "@material-ui/icons/ArrowForward";

import SiteHeader from "../../shared/SiteHeader";
import SiteFooter from "../../shared/SiteFooter";

import { Redirect } from "react-router";
import { Formik, Form } from "formik";

import OrderFrmProps from "../../shared/OrderFrmProps";
import PlanningData from "../../data/PlanningData";
import ProfessionalSelectionForm from "../signup/ProfessionalSelectionForm";

const styles = theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(700 + theme.spacing.unit * 2 * 2)]: {
      width: 700,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 2,
    [theme.breakpoints.up(700 + theme.spacing.unit * 3 * 2)]: {
      marginTop: theme.spacing.unit * 6,
      marginBottom: theme.spacing.unit * 6,
      padding: theme.spacing.unit * 3
    }
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  }
});

class OrderFrm extends React.Component {
  constructor(props) {
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));

    super(props);
    this.state = {
      categories: [],
      services: [],
      proposalServices: [],
      planningServices: [],
      professionalPersonas: [],
      serviceListCollapse: [],
      snackBarOpen: false,
      snackBarContent: ""
    };

    this.fillCategories();
    this.fillServices(
      auth_params.customerId,
      this.props.match.params.planningId
    );
    this.fillProfessionals(this.props.match.params.planningId);
  }

  async fillCategories() {
    const categories = await OrderFrmProps.getCategories();
    this.setState({
      categories: categories
    });
  }

  async fillServices(customerId, planningId) {
    const serv = await OrderFrmProps.getServices(customerId, planningId);
    const planning = await PlanningData.getPlanningById(planningId);
    this.setState({
      services: serv.services,
      proposalServices: serv.proposalServices,
      planningServices: planningId === "0" ? serv.planningServices : [planning]
    });
  }

  async fillProfessionals(planningId) {
    const prof = await OrderFrmProps.getProfessionals(planningId);
    this.setState({
      professionalPersonas: prof.professionalPersonas,
      serviceListCollapse: prof.serviceListCollapse
    });
  }

  render() {
    const { classes } = this.props;
    const {
      categories,
      services,
      professionalPersonas,
      serviceListCollapse
    } = this.state;

    if (this.state.snackBarOpen === true) {
      return (
        <Redirect
          push
          to={{
            pathname: "/commandes",
            state: {
              snackBarOpen: true,
              snackBarContent: this.state.snackBarContent
            }
          }}
        />
      );
    }

    if (
      this.state.categories.length === 0 ||
      this.state.services.length === 0 ||
      this.state.professionalPersonas.length === 0 ||
      this.state.serviceListCollapse === []
    ) {
      return <LinearProgress />;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <SiteHeader />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Formik
              initialValues={{
                customer_attributes: {
                  plannings_attributes: this.state.planningServices
                }
              }}
              validate={values => {}}
              onSubmit={async (values, { setSubmitting }) => {
                const planning = values.customer_attributes.plannings_attributes.filter(
                  p =>
                    p.start_hour !== null ||
                    p.end_hour !== null ||
                    p.date !== null
                );
                // console.log(planning);
                const response = await PlanningData.createUpdatePlanning({
                  planning: planning
                });
                if (response.status === 201 || response.status === 200) {
                  this.setState({
                    snackBarOpen: true,
                    snackBarContent: "Commande sauvegardée avec succès"
                  });
                  setSubmitting(false);
                } else {
                  this.setState({
                    snackBarOpen: true,
                    snackBarContent: "Erreur de sauvegarde de la commande"
                  });
                }
                setSubmitting(false);
              }}
              render={({ values, isSubmitting, submitForm, handleSubmit }) => (
                <Form>
                  <ProfessionalSelectionForm
                    categories={categories}
                    services={services}
                    values={values}
                    professionalPersonas={professionalPersonas}
                    serviceListCollapse={serviceListCollapse}
                  />
                  <br />
                  {isSubmitting && <LinearProgress />}
                  <br />
                  <div className={classes.buttons}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={submitForm}
                      className={classes.button}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Enregistrement de votre commande... "
                        : "Passer la commande "}
                      <ArrowForward />
                    </Button>
                  </div>
                </Form>
              )}
            />
          </Paper>
        </main>
        <SiteFooter footerLayoutStyle={classes.layout} />
      </React.Fragment>
    );
  }
}

OrderFrm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrderFrm);
