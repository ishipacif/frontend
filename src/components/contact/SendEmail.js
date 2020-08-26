import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import {
  Card,
  CardActions,
  CardContent,
  Typography,
  LinearProgress,
  Snackbar,
  FormControl,
  Button
} from "@material-ui/core";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";

import ApiServices from "../../data/ApiServices";

const styles = theme => ({
  root: {
    position: "relative",
    overflow: "hidden"
  },
  snackbar: {
    position: "absolute"
  },
  snackbarContent: {
    width: 360
  }
});

class SendEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackBarOpen: false,
      snackBarContent: ""
    };
  }

  render() {
    const { classes } = this.props;
    const { snackBarOpen } = this.state;
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <br />
          <br />
          <Formik
            initialValues={{
              full_name: "",
              email: "",
              subject: "",
              message: ""
            }}
            validate={values => {
              let errors = {};
              if (!values.full_name) {
                errors.full_name = "Obligatoire";
              }
              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
              ) {
                errors.email = "Vous devez fournir une adresse email valide";
              }
              if (!values.subject) {
                errors.subject = "Obligatoire";
              }
              if (!values.message) {
                errors.message = "Obligatoire";
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const response = await ApiServices.sendEmail(values);

              if (response.status === "success") {
                values.full_name = "";
                values.email = "";
                values.subject = "";
                values.message = "";
              }
              setSubmitting(false);
              this.setState({
                snackBarOpen: true,
                snackBarContent: response.message
              });
            }}
            render={({ values, isSubmitting, submitForm, handleSubmit }) => (
              <Form>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Contactez-nous par e-mail
                  </Typography>

                  <FormControl margin="normal" required fullWidth>
                    <Field
                      id="full_name"
                      name="full_name"
                      label="Votre nom et prénom"
                      required
                      fullWidth
                      value={values.full_name}
                      component={TextField}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <Field
                      id="email"
                      name="email"
                      label="Votre e-mail"
                      required
                      fullWidth
                      value={values.email}
                      component={TextField}
                    />
                  </FormControl>

                  <FormControl margin="normal" required fullWidth>
                    <Field
                      id="subject"
                      name="subject"
                      label="Objet"
                      required
                      fullWidth
                      value={values.subject}
                      component={TextField}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <Field
                      id="message"
                      name="message"
                      label="Votre message"
                      rows="5"
                      required
                      multiline
                      value={values.message}
                      component={TextField}
                    />
                  </FormControl>
                </CardContent>
                <CardActions>
                  <br />
                  {isSubmitting && <LinearProgress />}
                  <br />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={submitForm}
                  >
                    {isSubmitting ? "Envoie en cours..." : "Envoyer un e-mail"}
                  </Button>
                </CardActions>
              </Form>
            )}
          />

          <Snackbar
            open={snackBarOpen}
            autoHideDuration={4000}
            onClose={this.handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            ContentProps={{
              "aria-describedby": "snackbar-fab-message-id",
              className: classes.snackbarContent
            }}
            message={
              <span id="snackbar-fab-message-id">
                {this.state.snackBarContent}
              </span>
            }
            className={classes.snackbar}
          />
        </Card>
      </div>
    );
  }
}

SendEmail.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SendEmail);
