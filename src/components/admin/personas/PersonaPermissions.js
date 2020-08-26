import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Radio,
  Button,
  Typography,
  FormControlLabel,
  LinearProgress
} from "@material-ui/core";

import { Redirect } from "react-router-dom";

import { Formik, Form, Field } from "formik";
import { RadioGroup } from "formik-material-ui";

import PersonasData from "../../../data/PersonasData";
const models = [
  {
    model: "Persona",
    label: "Les Persona"
  },
  {
    model: "Type",
    label: "Les types de persona"
  },
  {
    model: "Category",
    label: "Catégorie de service"
  },
  {
    model: "Service",
    label: "Les Services"
  },
  {
    model: "Proposal",
    label: "Les Propositions de service"
  },
  {
    model: "Planning",
    label: "Les booking"
  },
  {
    model: "Facture",
    label: "Les factures"
  }
];

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  }
});

class PersonaPermissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personaInfo: undefined,
      toPersonas: false
    };
    this.getPersona();
  }

  async getPersona() {
    const response = await PersonasData.getPersona(this.props.personaId);

    this.setState({
      personaInfo: response
    });
  }

  render() {
    if (this.state.toPersonas === true) {
      return <Redirect to={"/admin/personas/"} />;
    }

    const { classes } = this.props;

    if (this.state.personaInfo === undefined) {
      return <LinearProgress />;
    }

    let initVals = models.map(model => ({
      resource_class: model.model,
      persona_id: this.state.personaInfo.id,
      action:
        this.state.personaInfo.permissions.find(
          permission => permission.resource_class === model.model
        ) === undefined
          ? ""
          : this.state.personaInfo.permissions.find(
              permission => permission.resource_class === model.model
            ).action
    }));

    return (
      <div className={classes.root}>
        <Typography variant="h5" gutterBottom>
          {"Définition des accès pour " +
            this.state.personaInfo.first_name +
            " " +
            this.state.personaInfo.last_name}
        </Typography>
        <br />
        <Formik
          initialValues={{
            id: this.state.personaInfo.id,
            permissions_attributes: initVals
          }}
          validate={values => {}}
          onSubmit={async (values, { setSubmitting }) => {
            const response = await PersonasData.createUpdatePersonaPermissions(
              values
            );

            if (response.status === 201 || response.status === 200) {
              setSubmitting(false);
              this.setState({
                toPersonas: true
              });
            } else {
              console.error("err");
            }
          }}
          render={({ values, isSubmitting, submitForm, handleSubmit }) => (
            <Form>
              <Grid container spacing={8}>
                {models.map((model, i) => (
                  <Grid key={"grid-" + i} item xs={12} sm={4}>
                    <Paper className={classes.paper}>
                      <Typography variant="h6">{model.label}</Typography>
                      <Field
                        name={"permissions_attributes." + i + ".action"}
                        component={RadioGroup}
                      >
                        <FormControlLabel
                          value=""
                          control={<Radio disabled={isSubmitting} />}
                          label="Aucun accès"
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="create"
                          control={<Radio disabled={isSubmitting} />}
                          label="Créer"
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="update"
                          control={<Radio disabled={isSubmitting} />}
                          label="Modifier"
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="read"
                          control={<Radio disabled={isSubmitting} />}
                          label="Afficher"
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="delete"
                          control={<Radio disabled={isSubmitting} />}
                          label="Supprimer"
                          disabled={isSubmitting}
                        />
                        <FormControlLabel
                          value="manage"
                          control={<Radio disabled={isSubmitting} />}
                          label="Gérer"
                          disabled={isSubmitting}
                        />
                      </Field>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
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
                  {isSubmitting ? "Mise à jour des accès... " : "Sauvegarder"}
                </Button>
              </div>
            </Form>
          )}
        />
      </div>
    );
  }
}

PersonaPermissions.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(PersonaPermissions);
