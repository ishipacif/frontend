import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Formik, Field, Form } from "formik";
import { TextField } from "formik-material-ui";
import { Select } from "material-ui-formik-components";
import SevicesToolbar from "../../../shared/SevicesToolbar";

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
      service: [],
      services: []
    };
    this.loadUnloadFrm = this.loadUnloadFrm.bind(this);
    this.resetFrmLoadList = this.resetFrmLoadList.bind(this);
    this.getServices();
  }

  loadUnloadFrm = async event => {
    let categories = [];
    if (this.state.serviceFrm === false) {
      const rawCategories = await ServicesData.getCategories();

      rawCategories.forEach(function(category) {
        categories.push({
          value: category.id,
          label: category.name
        });
      });
    }
    if (categories.length > 0) {
      this.setState({
        serviceFrm: !this.state.serviceFrm,
        categories: categories
      });
    }
  };

  async getServices() {
    const rawServices = await ServicesData.getServices();

    const services = rawServices.map(function(service) {
      return {
        id: service.id,
        name: service.name,
        commission: service.percentage_commission,
        category: service.category.name
      };
    });

    this.setState({
      services: services
    });
  }

  resetFrmLoadList = event => {
    this.setState({
      serviceFrm: !this.state.serviceFrm,
      serviceId: "",
      service: [],
      services: []
    });
    this.getServices();
  };

  async deleteServiceById(id) {
    await ServicesData.deleteService(id);
    this.getServices();
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
        if (this.state.service.length === 0) {
          return <LinearProgress />;
        }
      }

      return (
        <ServiceFrm
          classes={classes}
          service={this.state.service}
          ServicesClass={this}
          categories={this.state.categories}
        />
      );
    } else {
      return (
        <div>
          <SevicesToolbar />
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
                  title: "Commission (%)",
                  field: "commission",
                  type: "numeric"
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
          <Button
            variant="fab"
            className={classes.fab}
            color="primary"
            onClick={this.loadUnloadFrm}
          >
            <AddIcon />
          </Button>
        </div>
      );
    }
  }
}

// Functional component for ServiceFrm
const ServiceFrm = props => {
  const { classes, service, categories, ServicesClass } = props;
  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h6">Service</Typography>
          <Formik
            initialValues={{
              id: service.id,
              name: service.name,
              description: service.description,
              percentage_commission: service.percentage_commission,
              category_id: service.category_id
            }}
            validate={values => {
              let errors = {};
              if (!values.name) {
                errors.name = "Required";
              }
              if (!values.description) {
                errors.description = "Required";
              }
              if (!values.percentage_commission) {
                errors.percentage_commission = "Required";
              }
              if (!values.category_id) {
                errors.category_id = "Required";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const response = await ServicesData.createUpdateService(values);

              if (response.status === 201 || response.status === 200) {
                setSubmitting(false);
                ServicesClass.resetFrmLoadList();
              }
            }}
            render={({ values, isSubmitting, submitForm, handleSubmit }) => (
              <Form>
                <FormControl margin="normal" required fullWidth>
                  <Field
                    required
                    id="name"
                    name="name"
                    label="Nom du service:"
                    autoFocus
                    value={values.name}
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
                    id="percentage_commission"
                    name="percentage_commission"
                    label="Pourcentage de la commission:"
                    type="number"
                    value={values.percentage_commission}
                    component={TextField}
                  />
                </FormControl>

                <FormControl margin="normal" required fullWidth>
                  <Field
                    required
                    id="category_id"
                    name="category_id"
                    label="Categorie:"
                    value={values.category_id}
                    options={categories}
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
                    onClick={ServicesClass.resetFrmLoadList}
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
