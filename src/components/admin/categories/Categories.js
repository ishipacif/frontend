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

import SevicesToolbar from "../../../shared/SevicesToolbar";

import ServicesData from "../../../data/ServicesData";

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
  fab: {
    position: "absolute",
    bottom: theme.spacing.unit * 6,
    right: theme.spacing.unit * 2
  }
});

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryFrm: false,
      servicesCategoryId: "",
      servicesCategory: [],
      categories: []
    };
    this.loadUnloadFrm = this.loadUnloadFrm.bind(this);
    this.getCategories();
  }

  loadUnloadFrm = event => {
    this.setState({ categoryFrm: !this.state.categoryFrm });
  };

  async getCategories() {
    const rawCategories = await ServicesData.getCategories();

    const categories = rawCategories.map(function(category) {
      return {
        id: category.id,
        name: category.name,
        count: category.services.length
      };
    });

    this.setState({
      categories: categories
    });
  }

  async deleteServicesCategoryById(id) {
    await ServicesData.deleteServicesCategory(id);
    this.getCategories();
  }

  async getServicesCategoryById(id) {
    const rawServicesCategory = await ServicesData.getServicesCategory(id);

    this.setState({
      servicesCategory: rawServicesCategory
    });
  }

  render() {
    const { classes } = this.props;

    if (this.state.categoryFrm !== false) {
      if (
        this.state.servicesCategoryId !== "" &&
        this.state.servicesCategoryId !== undefined
      ) {
        if (this.state.servicesCategory.length === 0) {
          return <LinearProgress />;
        }
      }

      return (
        <CategoryFrm
          classes={classes}
          servicesCategory={this.state.servicesCategory}
          CategoriesClass={this}
        />
      );
    } else {
      return (
        <div>
          <SevicesToolbar />
          <div>
            <MaterialTable
              data={this.state.categories}
              title={"Categories de services"}
              columns={[
                {
                  title: "Nom",
                  field: "name"
                },
                {
                  title: "Total de services",
                  field: "count",
                  type: "numeric"
                }
              ]}
              actions={[
                {
                  icon: "edit",
                  tooltip: "Modifier",
                  onClick: (event, rowData) => {
                    this.getServicesCategoryById(rowData.id);
                    this.setState({ servicesCategoryId: rowData.id });
                    this.loadUnloadFrm();
                  }
                },
                {
                  icon: "delete",
                  tooltip: "Supprimer",
                  onClick: (event, rowData) => {
                    if (
                      window.confirm(
                        "Voulez vous supprimer cette categorie?"
                      ) === true
                    ) {
                      this.deleteServicesCategoryById(rowData.id);
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

// Functional component for CategoryFrm
const CategoryFrm = props => {
  const { classes, servicesCategory, CategoriesClass } = props;
  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h6">Categorie de service</Typography>
          <Formik
            initialValues={{
              id: servicesCategory.id,
              name: servicesCategory.name,
              description: servicesCategory.description
            }}
            validate={values => {
              let errors = {};
              if (!values.name) {
                errors.name = "Obligatoire";
              }
              if (!values.description) {
                errors.description = "Obligatoire";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              const response = await ServicesData.createUpdateCategories(
                values
              );

              if (response.status === 201 || response.status === 200) {
                setSubmitting(false);
                CategoriesClass.setState({
                  categoryFrm: false,
                  servicesCategoryId: "",
                  servicesCategory: [],
                  categories: []
                });
                CategoriesClass.getCategories();
              }
            }}
            render={({ values, isSubmitting, submitForm, handleSubmit }) => (
              <Form>
                <FormControl margin="normal" required fullWidth>
                  <Field
                    id="name"
                    name="name"
                    label="Nom de la catégorie:"
                    autoFocus
                    value={values.name}
                    component={TextField}
                  />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <Field
                    id="description"
                    name="description"
                    label="Description de la catégorie:"
                    rows="5"
                    multiline
                    value={values.description}
                    component={TextField}
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

Categories.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Categories);
