import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Formik, Field, Form } from "formik";
import { TextField, Checkbox } from "formik-material-ui";

import PersonaTypes from "../../../data/PersonaTypes";

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
  }
});

// props.match.params.personaTypeId

class TypesFrm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personaType: []
    };
    this.getTypeById(this.props.match.params.personaTypeId);
  }

  async getTypeById(id) {
    const rawPersonaType = await PersonaTypes.getPersonaType(id);

    this.setState({
      personaType: rawPersonaType
    });
  }

  render() {
    const { classes } = this.props;
    if (this.props.match.params.personaTypeId !== undefined) {
      if (this.state.personaType.length === 0) {
        return <LinearProgress />;
      }
    }
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography variant="h6">Type de Persona</Typography>
            <Formik
              initialValues={{
                id: this.state.personaType.id,
                name: this.state.personaType.name,
                description: this.state.personaType.description,
                fix_prices: this.state.personaType.fix_prices
              }}
              validate={values => {
                let errors = {};
                if (!values.name) {
                  errors.name = "Required";
                }
                if (!values.description) {
                  errors.description = "Required";
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                const response = await PersonaTypes.createUpdatePersonaType(
                  values
                );
                if (response.status === 201 || response.status === 200) {
                  setSubmitting(false);
                  this.props.history.push("/monespace/personas/");
                  // return <Redirect to={"/admin/personas/"} />;
                }
              }}
              render={({ values, isSubmitting, submitForm, handleSubmit }) => (
                <Form>
                  <FormControl margin="normal" required fullWidth>
                    <Field
                      id="name"
                      name="name"
                      label="Name:"
                      autoFocus
                      value={values.name}
                      component={TextField}
                    />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth>
                    <Field
                      id="description"
                      name="description"
                      label="Description:"
                      rows="5"
                      multiline
                      value={values.description}
                      component={TextField}
                    />
                  </FormControl>
                  <FormControlLabel
                    control={
                      <Field
                        name="fix_prices"
                        value={true}
                        checked={values.fix_prices}
                        color="primary"
                        component={Checkbox}
                      />
                    }
                    label="Peut fixer les prix"
                  />

                  <div>
                    <br />
                    {isSubmitting && <LinearProgress />}
                    <br />
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                    >
                      {isSubmitting ? "Sauvegarde en cours..." : "Sauvegarder"}
                    </Button>
                  </div>
                </Form>
              )}
            />
          </Paper>
        </main>
      </React.Fragment>
    );
  }
}

TypesFrm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TypesFrm);
