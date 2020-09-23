import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import { Redirect } from "react-router";
import withStyles from "@material-ui/core/styles/withStyles";
import { Formik, Form } from "formik";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import SiteHeader from "../../shared/SiteHeader";
import SiteFooter from "../../shared/SiteFooter";

import PersonasData from "../../data/PersonasData";

const styles = theme => ({
  layout: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    marginTop: theme.spacing(1)
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));

    this.state = {
      snackBarOpen:
        props.location !== undefined &&
        props.location.state !== undefined &&
        props.location.state.snackBarOpen !== undefined
          ? props.location.state.snackBarOpen
          : false,
      toAdmin: auth_params ? auth_params.isAuthenticated : false,
      snackBarContent:
        props.location !== undefined &&
        props.location.state !== undefined &&
        props.location.state.snackBarContent !== undefined
          ? props.location.state.snackBarContent
          : ""
    };
  }

  render() {
    const { classes } = this.props;

    if (this.state.toAdmin === true) {
      return (
        <Redirect
          push
          to={{
            pathname: "/monespace",
            state: {
              isAuthenticated: true
            }
          }}
        />
      );
    }

    // debugger;
    return (
      <React.Fragment>
        <CssBaseline />
        <SiteHeader currentPersonaInfo={this.state.currentPersonaInfo} />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Ouvrir une session
            </Typography>
            <Formik
              initialValues={{ Username: "", Password: "" }}
              validate={values => {
                const errors = {};

                if (!values.Username) errors.Username = "Obligatoire";

                if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                    values.Username
                  )
                ) {
                  errors.Username =
                    "Vous devez fournir une adresse email valide";
                }

                if (values.Password.length < 8) {
                  errors.Password =
                    "Les mots de passe doivent comporter au moins 8 caractères.";
                }

                if (values.Username === values.Password) {
                  errors.Password =
                    "Votre mot de passe ne doit pas être semblable à votre email";
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                const response = await PersonasData.authenticatePersona(values);

                if (response !== undefined && response.token !== undefined) {
                  const auth_params = {
                    accessToken: response.token,
                    currentUser: response.user,
                    isAuthenticated: true
                  };
                  localStorage.setItem(
                    "auth_params",
                    JSON.stringify(auth_params)
                  );

                  this.setState({
                    toAdmin: true
                  });
                } else {
                  // let response_txt = JSON.parse(response.text);
                  // debugger;
                  this.setState({
                    snackBarOpen: true,
                    snackBarContent: "Erreur de connexion"
                  });
                }
                setSubmitting(false);
              }}
              render={({ values, isSubmitting, submitForm, handleSubmit }) => (
                <Form>
                  <FormControl margin="normal" required fullWidth>
                    <Field
                      id="Username"
                      required
                      name="Username"
                      label="Courriel:"
                      autoFocus
                      component={TextField}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <Field
                      name="Password"
                      required
                      type="password"
                      label="Mot de passe"
                      id="Password"
                      component={TextField}
                    />
                  </FormControl>
                  <div>
                    <br />
                    {isSubmitting && <LinearProgress />}
                    <br />
                    <Button
                      fullWidth
                      variant="contained"
                      className={classes.submit}
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                    >
                      {isSubmitting
                        ? "Ouverture de session..."
                        : "Se connecter"}
                    </Button>
                  </div>
                </Form>
              )}
            />
          </Paper>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={this.state.snackBarOpen}
            message={<span id="message-id">{this.state.snackBarContent}</span>}
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

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
