import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import { Select } from "material-ui-formik-components";

import ServicesData from "../../../data/ServicesData";

const styles = theme => ({
  layout: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(500 + theme.spacing.unit * 3 * 2)]: {
      width: 500,
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
  fab: {
    position: "absolute",
    bottom: theme.spacing.unit * 6,
    right: theme.spacing.unit * 2
  }
});

class Services extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceFrm: false,
      serviceId: "",
      service: undefined,
      services: []
    };
    this.loadUnloadFrm = this.loadUnloadFrm.bind(this);
    this.resetFrmLoadList = this.resetFrmLoadList.bind(this);
    this.getServices();
  }

  loadUnloadFrm = async event => {
    this.setState({
      serviceFrm: !this.state.serviceFrm
    });
  };

  async getServices() {
    const rawServices = await ServicesData.getServices();

    const services = rawServices.map(function(service) {
      return {
        id: service.id,
        name: service.title,
        description: service.description,
        category: service.category
      };
    });

    this.setState({
      services: services
    });
  }

  resetFrmLoadList = () => {
    this.setState({
      serviceFrm: !this.state.serviceFrm,
      serviceId: "",
      service: undefined,
      services: []
    });
    this.getServices();
  };

  async deleteServiceById(id) {
    const respo = await ServicesData.deleteService(id);
    if (respo !== undefined) {
      this.getServices();
    }
  }

  async getServiceById(id) {
    const rawService = await ServicesData.getService(id);

    this.setState({
      service: rawService
    });
  }

  render() {
    const { classes } = this.props;

    if (this.state.serviceFrm !== false) {
      if (this.state.serviceId !== "" && this.state.serviceId !== undefined) {
        if (this.state.service === undefined) {
          return <LinearProgress />;
        }
      }

      return (
        <ServiceFrm
          classes={classes}
          service={this.state.service}
          resetFrmLoadList={this.resetFrmLoadList}
        />
      );
    } else {
      return (
        <div>
          <div>
            <MaterialTable
              data={this.state.services}
              title={"Services"}
              columns={[
                {
                  title: "Nom",
                  field: "name"
                },
                {
                  title: "Description",
                  field: "description"
                },
                {
                  title: "Categorie",
                  field: "category"
                }
              ]}
              actions={[
                {
                  icon: "edit",
                  tooltip: "Modifier",
                  onClick: (event, rowData) => {
                    this.getServiceById(rowData.id);
                    this.setState({ serviceId: rowData.id });
                    this.loadUnloadFrm();
                  }
                },
                {
                  icon: "delete",
                  tooltip: "Supprimer",
                  onClick: (event, rowData) => {
                    if (
                      window.confirm("Voulez vous supprimer ce servive?") ===
                      true
                    ) {
                      this.deleteServiceById(rowData.id);
                    }
                  }
                }
              ]}
              localization={{
                actions: ""
              }}
              options={{
                columnsButton: false,
                filtering: false
              }}
            />
          </div>

          <Fab
            className={classes.fab}
            onClick={this.loadUnloadFrm}
            color="primary"
            aria-label="add"
          >
            <AddIcon />
          </Fab>
        </div>
      );
    }
  }
}

// Functional component for ServiceFrm
const ServiceFrm = props => {
  const { classes, service, resetFrmLoadList } = props;
  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h6">Service</Typography>
          <Formik
            initialValues={{
              id: service === undefined ? 0 : service.id,
              title: service === undefined ? "" : service.title,
              description: service === undefined ? "" : service.description,
              category: service === undefined ? "" : service.category
            }}
            validate={values => {
              let errors = {};
              if (!values.title) {
                errors.title = "Required";
              }
              if (!values.description) {
                errors.description = "Required";
              }

              if (!values.category) {
                errors.category = "Required";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const response = await ServicesData.createUpdateService(values);

              if (
                response.status === 201 ||
                response.status === 200 ||
                response.status === 204
              ) {
                setSubmitting(false);
                resetFrmLoadList();
              }
            }}
            render={({ values, isSubmitting, submitForm, handleSubmit }) => (
              <Form>
                <FormControl margin="normal" required fullWidth>
                  <Field
                    required
                    id="title"
                    name="title"
                    label="Nom du service:"
                    autoFocus
                    value={values.title}
                    component={TextField}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <Field
                    required
                    id="description"
                    name="description"
                    label="Description du service:"
                    rows="5"
                    multiline
                    value={values.description}
                    component={TextField}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <Field
                    required
                    id="category"
                    name="category"
                    label="Categorie:"
                    value={values.category}
                    options={[
                      { value: "Interieur", label: "Interieur" },
                      { value: "Exterieur", label: "Exterieur" }
                    ]}
                    component={Select}
                  />
                </FormControl>
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
                  </Button>{" "}
                  <Button
                    variant="contained"
                    onClick={() => {
                      resetFrmLoadList();
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </Form>
            )}
          />
        </Paper>
      </main>
    </React.Fragment>
  );
};

Services.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Services);
