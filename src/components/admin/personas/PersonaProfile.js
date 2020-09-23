import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

import Paper from "@material-ui/core/Paper";
import { Formik, Form } from "formik";
import { Redirect } from "react-router";

import PersonasData from "../../../data/PersonasData";
import PersonaInfoForm from "../../signup/PersonaInfoForm";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
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

class PersonaProfile extends React.Component {
  constructor(props) {
    super(props);
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));
    this.state = {
      pictureToUpload: undefined,
      currentPersonaInfo: undefined,
      toAdmin: false,
      accountType: ""
    };
    this.loadPersonaProfile(auth_params);
  }

  async loadPersonaProfile(params) {
    const type =
      params.currentUser.roles[0] === "Customer" ? "customer" : "professional";

    const persona = await PersonasData.getPersona(
      type,
      params.currentUser.person.id
    );
    if (persona !== undefined) {
      this.setState({
        currentPersonaInfo: persona,
        accountType: type
      });
    }
  }

  changePic(url) {
    this.setState({
      pictureToUpload: url
    });
  }

  render() {
    const { classes } = this.props;

    if (this.state.currentPersonaInfo === undefined) {
      return <LinearProgress />;
    }

    return (
      <div className={classes.root}>
        {this.state.toAdmin === true ? (
          <Redirect
            push
            to={{
              pathname: "/monespace",
              state: {
                snackBarOpen: true,
                snackBarContent: "Votre profil est mis à jour avec succès"
              }
            }}
          />
        ) : (
          <Paper className={classes.paper}>
            <Formik
              initialValues={{
                persona: {
                  accountType: this.state.accountType,
                  id: this.state.currentPersonaInfo.id,
                  userId: this.state.currentPersonaInfo.userId,
                  firstName: this.state.currentPersonaInfo.firstName,
                  lastName: this.state.currentPersonaInfo.lastName,
                  addressId: this.state.currentPersonaInfo.addressId,
                  email: this.state.currentPersonaInfo.email,
                  phoneNumber: this.state.currentPersonaInfo.phoneNumber,
                  picture: this.state.currentPersonaInfo.picture,
                  address: {
                    id: this.state.currentPersonaInfo.address.id,
                    plotNumber: this.state.currentPersonaInfo.address
                      .plotNumber,
                    streetName: this.state.currentPersonaInfo.address
                      .streetName,
                    city: this.state.currentPersonaInfo.address.city,
                    postalCode: this.state.currentPersonaInfo.address.postalCode
                  }
                },
                password: "",
                passwordComfirm: ""
              }}
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

                if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                    values.persona.email
                  )
                ) {
                  errors.persona.email =
                    "Vous devez fournir une adresse email valide";
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                let response = undefined;
                if (this.state.pictureToUpload !== undefined) {
                  values.persona.picture = this.state.pictureToUpload;
                }

                if (values.persona.accountType === "customer") {
                  response = await PersonasData.createUpdateCustomer({
                    customer: values.persona,
                    password: values.password
                  });
                } else {
                  // console.log(values);
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
                    toAdmin: true
                  });
                  setSubmitting(false);
                  // this.props.history.push("/monespace/");
                } else {
                  this.setState({
                    formStatus: "Erreur",
                    reg_status: response.ok
                  });
                }
              }}
              render={({ values, isSubmitting, submitForm, handleSubmit }) => (
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Mise à jour de votre profile... "
                        : "Sauvegarder"}
                    </Button>
                  </div>
                </Form>
              )}
            />
          </Paper>
        )}
      </div>
    );
  }
}

PersonaProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(PersonaProfile);
