import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import LinearProgress from "@material-ui/core/LinearProgress";
import ArrowForward from "@material-ui/icons/ArrowForward";

import { Redirect } from "react-router";

import PersonasData from "../../data/PersonasData";
import PlanningData from "../../data/PlanningData";
import ServicesData from "../../data/ServicesData";
// import ProfessionalSelectionForm from "../signup/ProfessionalSelectionForm";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Select, DateTimePicker } from "material-ui-formik-components";

const styles = theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(700 + theme.spacing(4))]: {
      width: 700,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(700 + theme.spacing(6))]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  }
});

class OrderFrm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      authParams: JSON.parse(localStorage.getItem("auth_params")),
      professionalPersonas: [],
      bookingSuccess: false,
      snackBarOpen: false,
      snackBarContent: ""
    };

    this.fillServices();
    // this.fillProfessionals();
  }

  async fillServices() {
    const serv = await ServicesData.getServices();
    if (serv !== undefined) {
      this.setState({
        services: serv
      });
    }
  }

  async fillProfessionals() {
    const prof = await PersonasData.getProfessionals();
    if (prof !== undefined) {
      this.setState({
        professionalPersonas: prof
      });
    }
  }

  async fetchProfessionals(serviceId, dateTime, duration) {
    // console.log(serviceId, dateTime, duration);
    if (serviceId !== undefined && dateTime !== undefined) {
      const prof = await PersonasData.getAvailableProfessionals({
        serviceId: serviceId,
        dateTime: dateTime,
        duration: duration
      });
      if (prof !== undefined) {
        this.setState({
          professionalPersonas: prof
        });
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { services, professionalPersonas } = this.state;

    // if (this.state.snackBarOpen === true) {
    //   return (
    //     <Redirect
    //       push
    //       to={{
    //         pathname: "/commandes",
    //         state: {
    //           snackBarOpen: true,
    //           snackBarContent: this.state.snackBarContent
    //         }
    //       }}
    //     />
    //   );
    // }

    if (this.state.services.length === 0) {
      return <LinearProgress />;
    }
    var todayDateTime = new Date(),
      currentDateTime =
        todayDateTime.getFullYear() +
        "-" +
        (todayDateTime.getMonth() + 1) +
        "-" +
        todayDateTime.getDate();
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            {this.state.bookingSuccess === true ? (
              <Redirect
                push
                to={{
                  pathname: "/commandes",
                  state: {
                    snackBarOpen: true,
                    snackBarContent: "Reservation faite avec succès"
                  }
                }}
              />
            ) : (
              <Formik
                initialValues={{
                  categoryId: "",
                  customerId: this.state.authParams.currentUser.person.id,
                  expertiseForServiceCreate: {
                    professionalId: "",
                    serviceId: ""
                  },
                  startTime: currentDateTime,
                  duration: 0
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  const response = await PlanningData.createUpdatePlanning(
                    values
                  );
                  if (
                    response.status === 201 ||
                    response.status === 200 ||
                    response.status === 204
                  ) {
                    this.setState({
                      snackBarOpen: true,
                      snackBarContent: "Reservation faite avec succès",
                      bookingSuccess: true
                    });

                    setSubmitting(false);
                  } else {
                    this.setState({
                      snackBarOpen: true,
                      snackBarContent: response.text,
                      bookingSuccess: false
                    });
                  }
                  setSubmitting(false);
                }}
                render={({
                  values,
                  isSubmitting,
                  submitForm,
                  handleSubmit,
                  setFieldValue
                }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <Field
                          label="Categories"
                          id="categoryId"
                          name="categoryId"
                          required
                          fullWidth
                          value={values.categoryId}
                          options={[
                            { value: "Interieur", label: "Interieur" },
                            { value: "Exterieur", label: "Exterieur" }
                          ]}
                          disabled={isSubmitting}
                          component={Select}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Field
                          label="Services"
                          id="expertiseForServiceCreate.serviceId"
                          name="expertiseForServiceCreate.serviceId"
                          required
                          fullWidth
                          value={values.expertiseForServiceCreate.serviceId}
                          options={services
                            .filter(
                              service => service.category === values.categoryId
                            )
                            .map(service => ({
                              value: service.id,
                              label: service.title
                            }))}
                          disabled={isSubmitting}
                          component={Select}
                          onChange={e => {
                            this.fetchProfessionals(
                              e.target.value,
                              values.startTime,
                              values.duration
                            );
                            setFieldValue(
                              "expertiseForServiceCreate.serviceId",
                              e.target.value
                            );
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Field
                          autoOk
                          id="startTime"
                          name="startTime"
                          format="dd MMMM yyyy, hh:mm a"
                          views={["year", "month", "date"]}
                          value={values.startTime}
                          disabled={isSubmitting}
                          component={DateTimePicker}
                          label="Date"
                          required
                          onChange={v => {
                            this.fetchProfessionals(
                              values.expertiseForServiceCreate.serviceId,
                              v,
                              values.duration
                            );
                            setFieldValue("startTime", v);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <br />
                        <Field
                          id="duration"
                          name="duration"
                          value={values.duration}
                          type="number"
                          disabled={isSubmitting}
                          label="Duration (hr)"
                          component={TextField}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Field
                          label="Professionnel"
                          id="expertiseForServiceCreate.professionalId"
                          name="expertiseForServiceCreate.professionalId"
                          required
                          fullWidth
                          value={
                            values.expertiseForServiceCreate.professionalId
                          }
                          options={professionalPersonas.map(
                            professionalPersona => ({
                              value: professionalPersona.id,
                              label:
                                professionalPersona.firstName +
                                " " +
                                professionalPersona.lastName
                            })
                          )}
                          disabled={isSubmitting}
                          component={Select}
                        />
                      </Grid>
                    </Grid>
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
            )}
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

OrderFrm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OrderFrm);
