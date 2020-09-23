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
              fullName: "",
              to: "ishipacif@gmail.com",
              ReplyTo: "",
              subject: "",
              body: ""
            }}
            validate={values => {
              let errors = {};
              if (!values.fullName) {
                errors.fullName = "Obligatoire";
              }
              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                  values.ReplyTo
                )
              ) {
                errors.ReplyTo = "Vous devez fournir une adresse email valide";
              }
              if (!values.subject) {
                errors.subject = "Obligatoire";
              }
              if (!values.body) {
                errors.body = "Obligatoire";
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              values.ReplyTo = values.fullName + "<" + values.ReplyTo + ">";

              const response = await ApiServices.sendEmail(values);

              if (
                response.status === 200 ||
                response.status === 201 ||
                response.status === 204
              ) {
                values.fullName = "";
                values.subject = "";
                values.body = "";
              }
              this.setState({
                snackBarOpen: true,
                snackBarContent: "Courriel envoyé avec succès"
              });
              setSubmitting(false);
              this.setState({
                snackBarOpen: true,
                snackBarContent: response.text
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
                      id="fullName"
                      name="fullName"
                      label="Votre nom et prénom"
                      required
                      fullWidth
                      value={values.fullName}
                      component={TextField}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <Field
                      id="ReplyTo"
                      name="ReplyTo"
                      label="Votre e-mail"
                      required
                      fullWidth
                      value={values.ReplyTo}
                      component={TextField}
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <Field
                      id="body"
                      name="body"
                      label="Votre message"
                      rows="5"
                      required
                      multiline
                      value={values.body}
                      component={TextField}
                      disabled={isSubmitting}
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
