import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import ArrowForward from "@material-ui/icons/ArrowForward";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Formik, Form } from "formik";
import SiteHeader from "../../shared/SiteHeader";
import SiteFooter from "../../shared/SiteFooter";
import PersonaInfoForm from "./PersonaInfoForm";

import PersonasData from "../../data/PersonasData";

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
  stepper: {
    padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit
  }
});

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      reg_status: "",
      pictureToUpload: undefined,
      formStatus: "signUp",
      snackBarOpen: false,
      snackBarMessage: ""
    };
  }

  isErrorsEmpty = obj => {
    for (let key in obj) {
      //if the value is 'object'
      if (obj[key] instanceof Object === true) {
        if (this.isErrorsEmpty(obj[key]) === false) return false;
      }
      //if value is string/number
      else {
        //if array or string have length is not 0.
        if (obj[key].length !== 0) return false;
      }
    }
    return true;
  };

  changePic(url) {
    this.setState({
      pictureToUpload: url
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      pictureToUpload: undefined
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <SiteHeader currentPersonaInfo={this.state.currentPersonaInfo} />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Inscription
            </Typography>

            <React.Fragment>
              {
                <React.Fragment>
                  <Formik
                    initialValues={{
                      persona: {
                        accountType: "",
                        firstName: "",
                        lastName: "",
                        email: "",
                        phoneNumber: "",
                        address: {
                          streetName: "",
                          plotNumber: "",
                          city: "",
                          postalCode: ""
                        }
                      },
                      password: "",
                      passwordComfirm: ""
                    }}
                    validate={values => {
                      let errors = { persona: { address: {} } };
                      if (!values.persona.accountType) {
                        errors.persona.accountType = "Obligatoire";
                      }
                      if (!values.persona.firstName) {
                        errors.persona.firstName = "Obligatoire";
                      }
                      if (!values.persona.lastName) {
                        errors.persona.lastName = "Obligatoire";
                      }
                      if (!values.persona.phoneNumber) {
                        errors.persona.phoneNumber = "Obligatoire";
                      }
                      if (!values.persona.address.streetName) {
                        errors.persona.address.streetName = "Obligatoire";
                      }
                      if (!values.persona.address.plotNumber) {
                        errors.persona.address.plotNumber = "Obligatoire";
                      }
                      if (!values.persona.address.city) {
                        errors.persona.address.city = "Obligatoire";
                      }
                      if (!values.persona.address.postalCode) {
                        errors.persona.address.postalCode = "Obligatoire";
                      }
                      if (!values.password) {
                        errors.password = "Obligatoire";
                      }
                      if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                          values.persona.email
                        )
                      ) {
                        errors.persona.email =
                          "Vous devez fournir une adresse email valide";
                      }

                      if (values.password.length < 8) {
                        errors.password =
                          "Les mots de passe doivent comporter au moins 8 caractères.";
                      }

                      if (values.persona.email === values.password) {
                        errors.password =
                          "Votre mot de passe ne doit pas être le même que votre email";
                      }
                      if (values.passwordComfirm !== values.password) {
                        errors.passwordComfirm =
                          "Les deux mots de passe doivent être identique";
                      }

                      return this.isErrorsEmpty(errors) === true ? {} : errors;
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      let response = undefined;
                      values.persona.picture = this.state.pictureToUpload;
                      // console.log(values);
                      // debugger;
                      if (values.persona.accountType === "customer") {
                        response = await PersonasData.createUpdateCustomer({
                          customer: values.persona,
                          password: values.password
                        });
                      } else {
                        response = await PersonasData.createUpdateProfessional({
                          professional: values.persona,
                          password: values.password
                        });
                      }
                      // console.log(response);
                      if (
                        response.status === 201 ||
                        response.status === 200 ||
                        response.status === 204
                      ) {
                        this.setState({
                          formStatus: "Succès",
                          reg_status: response.ok
                        });
                        setSubmitting(false);
                      } else if (response.status === 400) {
                        this.setState({
                          snackBarOpen: true,
                          snackBarMessage: response.text
                        });
                        setSubmitting(false);
                      } else {
                        this.setState({
                          formStatus: "Erreur",
                          reg_status: response.ok,
                          snackBarOpen: true,
                          snackBarMessage: response.text
                        });
                      }
                    }}
                    render={({
                      values,
                      errors,
                      isSubmitting,
                      submitForm,
                      handleSubmit
                    }) =>
                      this.state.formStatus === "signUp" ? (
                        <Form>
                          <PersonaInfoForm
                            values={values}
                            isSubmitting={isSubmitting}
                            changePicFn={this.changePic.bind(this)}
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
                                ? "Inscription en cours... "
                                : "S'inscrire "}
                              <ArrowForward />
                            </Button>
                          </div>
                        </Form>
                      ) : (
                        <Typography component="h1" variant="h5" align="center">
                          {this.state.formStatus}
                        </Typography>
                      )
                    }
                  />
                </React.Fragment>
              }
            </React.Fragment>
          </Paper>
          <Snackbar
            open={this.state.snackBarOpen}
            autoHideDuration={4000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            message={this.state.snackBarMessage}
          />
        </main>
        <SiteFooter
          currentPersonaInfo={this.state.currentPersonaInfo}
          footerLayoutStyle={classes.layout}
        />
      </React.Fragment>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signup);
