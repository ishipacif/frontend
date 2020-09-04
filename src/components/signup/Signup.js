import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
// import Stepper from "@material-ui/core/Stepper";
// import Step from "@material-ui/core/Step";
// import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Formik, Form } from "formik";
import SiteHeader from "../../shared/SiteHeader";
import SiteFooter from "../../shared/SiteFooter";
import PersonaInfoForm from "./PersonaInfoForm";
// import LoginInfoForm from "./LoginInfoForm";
// import ServiceSelectionForm from "./ServiceSelectionForm";
// import ProfessionalSelectionForm from "./ProfessionalSelectionForm";
// import ReviewSelectionForm from "./ReviewSelectionForm";
// import ReviewProfessionalSelection from "./ReviewProfessionalSelection";

import PersonaTypes from "../../data/PersonaTypes";
import PersonasData from "../../data/PersonasData";
import OrderFrmProps from "../../shared/OrderFrmProps";

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
      categories: [],
      services: [],
      proposalServices: [],
      planningServices: [],
      personaType: [],
      professionalPersonas: [],
      serviceListCollapse: [],
      pictureToUpload: undefined,
      formStatus: "signUp"
    };
    // this.fillCategories();
    // this.fillServices();
    this.fillProfessionals();
    // this.getPersonaType(props.match.params.personaTypeId);
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleReset = () => {
    this.setState({
      activeStep: 0
    });
  };

  async getPersonaType(id) {
    const rawPersonaType = await PersonaTypes.getPersonaType(id);

    this.setState({
      personaType: rawPersonaType
    });
  }

  async fillCategories() {
    const categories = await OrderFrmProps.getCategories();

    this.setState({
      categories: categories
    });
  }

  async fillServices() {
    const serv = await OrderFrmProps.getServices();
    this.setState({
      services: serv.services,
      proposalServices: serv.proposalServices,
      planningServices: serv.planningServices
    });
  }

  async fillProfessionals() {
    const prof = await OrderFrmProps.getProfessionals();

    this.setState({
      professionalPersonas: prof.professionalPersonas,
      serviceListCollapse: prof.serviceListCollapse
    });
  }

  changePic(url) {
    this.setState({
      pictureToUpload: url
    });
  }

  componentWillReceiveProps(newProps) {
    if (
      Number.parseInt(newProps.match.params.personaTypeId) !==
      Number.parseInt(this.state.personaType.id)
    ) {
      this.setState({
        activeStep: 0,
        reg_status: "",
        categories: [],
        services: [],
        proposalServices: [],
        planningServices: [],
        personaType: [],
        professionalPersonas: [],
        serviceListCollapse: [],
        pictureToUpload: undefined
      });
      this.fillCategories();
      this.fillServices();
      this.fillProfessionals();
      this.getPersonaType(newProps.match.params.personaTypeId);
    }
  }

  render() {
    const { classes } = this.props;

    if (
      // this.state.categories.length === 0 ||
      // this.state.services.length === 0 ||
      // this.state.personaType.length === 0 ||
      // this.state.professionalPersonas.length === 0 ||
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
            <Typography component="h1" variant="h4" align="center">
              Inscription
            </Typography>

            <React.Fragment>
              {
                <React.Fragment>
                  <Formik
                    initialValues={
                      {
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
                      }

                      /*  {
                      accountType: "",
                      firstName: "",
                      lastName: "",
                      city: "",
                      email: "",
                      password: "",
                      passwordComfirm: "",
                      phoneNumber: "",
                      plotNumber: "",
                      postCode: "",
                      geoCoords: "",
                      streetName: "",
                      picture: null
                    } */
                    }
                    validate={values => {
                      let errors = {};
                      if (!values.persona.firstName) {
                        errors.persona.firstName = "Obligatoire";
                      }
                      if (!values.persona.lastName) {
                        errors.persona.lastName = "Obligatoire";
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
                      return errors;
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                      let response = undefined;
                      values.persona.picture = this.state.pictureToUpload;
                      console.log(values);
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
                      console.log(response);
                      if (response.status === 201 || response.status === 200) {
                        this.setState({
                          formStatus: "Succès",
                          reg_status: response.ok
                        });
                        setSubmitting(false);
                        this.handleNext();
                      } else {
                        this.setState({
                          formStatus: "Erreur",
                          reg_status: response.ok
                        });
                      }
                    }}
                    render={({
                      values,
                      isSubmitting,
                      submitForm,
                      handleSubmit
                    }) =>
                      this.state.formStatus === "signUp" ? (
                        <Form>
                          <PersonaInfoForm
                            values={values}
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
        </main>
        <SiteFooter footerLayoutStyle={classes.layout} />
      </React.Fragment>
    );
  }
}

Signup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Signup);
