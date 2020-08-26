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
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
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
            pathname: "/admin",
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
        <SiteHeader />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Ouvrir une session
            </Typography>
            <Formik
              initialValues={{ email: "", password: "" }}
              validate={values => {
                const errors = {};

                if (!values.email) errors.email = "Obligatoire";

                if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                    values.email
                  )
                ) {
                  errors.email = "Vous devez fournir une adresse email valide";
                }

                if (values.password.length < 8) {
                  errors.password =
                    "Les mots de passe doivent comporter au moins 8 caractères.";
                }

                if (values.email === values.password) {
                  errors.password =
                    "Votre mot de passe ne doit pas être semblable à votre email";
                }

                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                const response = await PersonasData.authenticatePersona(values);

                if (response.status === 201 || response.status === 200) {
                  const auth_params = {
                    accessToken: response.headers.get("access-token"),
                    tokenType: response.headers.get("token-type"),
                    client: response.headers.get("client"),
                    expiry: response.headers.get("expiry"),
                    uid: response.headers.get("uid"),
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
                  let response_txt = JSON.parse(response.text);
                  this.setState({
                    snackBarOpen: true,
                    snackBarContent: response_txt.errors.join(". ")
                  });
                }
                setSubmitting(false);
              }}
              render={({ values, isSubmitting, submitForm, handleSubmit }) => (
                <Form>
                  <FormControl margin="normal" required fullWidth>
                    <Field
                      id="email"
                      required
                      name="email"
                      label="Courriel:"
                      autoFocus
                      component={TextField}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <Field
                      name="password"
                      required
                      type="password"
                      label="Mot de passe"
                      id="password"
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
        <SiteFooter footerLayoutStyle={classes.layout} />
      </React.Fragment>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
