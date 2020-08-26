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
    this.state = {
      currentPersonaInfo: undefined,
      toAdmin: false
    };
    this.loadPersonaProfile();
  }

  async loadPersonaProfile() {
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));
    const response = await PersonasData.isAuthenticated();
    if (response.email === auth_params.uid) {
      this.setState({
        currentPersonaInfo: response
      });
    }
  }

  changePic(url) {
    this.setState({
      currentPersonaInfo: { picture: url }
    });
  }

  render() {
    const { classes } = this.props;

    if (this.state.toAdmin === true) {
      return (
        <Redirect
          push
          to={{
            pathname: "/admin",
            state: {
              isAuthenticated: true
            }
          }}
        />
      );
    }

    if (this.state.currentPersonaInfo === undefined) {
      return <LinearProgress />;
    }

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Formik
            initialValues={{
              id: this.state.currentPersonaInfo.id,
              first_name: this.state.currentPersonaInfo.first_name,
              last_name: this.state.currentPersonaInfo.last_name,
              city_name: this.state.currentPersonaInfo.city_name,
              email: this.state.currentPersonaInfo.email,
              phone_number: this.state.currentPersonaInfo.phone_number,
              plot_number: this.state.currentPersonaInfo.plot_number,
              post_code: this.state.currentPersonaInfo.post_code,
              street_name: this.state.currentPersonaInfo.street_name,
              picture: this.state.currentPersonaInfo.picture
            }}
            validate={values => {}}
            onSubmit={async (values, { setSubmitting }) => {
              values.picture = this.state.currentPersonaInfo.picture;
              const response = await PersonasData.createUpdatePersona(values);
              if (response.status === 201 || response.status === 200) {
                setSubmitting(false);
                this.setState({
                  toAdmin: true
                });
              } else {
                console.error("err");
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
      </div>
    );
  }
}

PersonaProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(PersonaProfile);
