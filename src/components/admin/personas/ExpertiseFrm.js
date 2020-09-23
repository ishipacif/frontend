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
import PersonasData from "../../../data/PersonasData";
import ServicesData from "../../../data/ServicesData";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { Select } from "material-ui-formik-components";

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

class ExpertiseFrm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      authParams: JSON.parse(localStorage.getItem("auth_params")),
      serviceSuccess: false,
      snackBarOpen: false,
      snackBarContent: ""
    };

    this.fillServices();
  }

  async fillServices() {
    const serv = await ServicesData.getServices();
    if (serv !== undefined) {
      this.setState({
        services: serv
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { services } = this.state;

    if (this.state.services.length === 0) {
      return <LinearProgress />;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            {this.state.serviceSuccess === true ? (
              <Redirect
                push
                to={{
                  pathname: "/expertises",
                  state: {
                    snackBarOpen: this.state.snackBarOpen,
                    snackBarContent: this.state.snackBarContent
                  }
                }}
              />
            ) : (
              <Formik
                initialValues={{
                  categoryId: "",
                  serviceId: "",
                  professionalId: this.state.authParams.currentUser.person.id,
                  hourlyRate: 0
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  const response = await PersonasData.setProfessionalExpertise(
                    values
                  );

                  if (
                    response.status === 201 ||
                    response.status === 200 ||
                    response.status === 204
                  ) {
                    this.setState({
                      snackBarOpen: true,
                      snackBarContent: "Service enregistré avec succès",
                      serviceSuccess: true
                    });
                    setSubmitting(false);
                  } else {
                    this.setState({
                      snackBarOpen: true,
                      snackBarContent: response.text,
                      serviceSuccess: true
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
                          id="serviceId"
                          name="serviceId"
                          required
                          fullWidth
                          value={values.serviceId}
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
                            setFieldValue("serviceId", e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <Field
                          id="hourlyRate"
                          name="hourlyRate"
                          value={values.hourlyRate}
                          disabled={isSubmitting}
                          label="Prix par heure (Euro)"
                          component={TextField}
                          required
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
                          ? "Enregistrement de votre service... "
                          : "Enregistrement le service "}
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

ExpertiseFrm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ExpertiseFrm);
