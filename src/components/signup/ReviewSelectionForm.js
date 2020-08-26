import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import EuroSymbol from "@material-ui/icons/EuroSymbol";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  listItem: {
    padding: `${theme.spacing.unit}px 0`
  },
  title: {
    marginTop: theme.spacing.unit * 2
  },
  euroIcon: {
    fontSize: "0.9em"
  }
});

function listServices(categories, services, values, classes) {
  let categoriesList = [];
  if (
    values.professional_attributes.proposals_attributes !== undefined &&
    values.professional_attributes.proposals_attributes.length > 0
  ) {
    categories.forEach(category => {
      let servicesList = getServicesList(category, services, values, classes);
      if (servicesList.length !== 0) {
        categoriesList.push(
          <div key={"select_category_container_" + category.id}>
            <Typography variant="h6" gutterBottom>
              <em>{category.name}</em>
            </Typography>
            <Divider />
            <List disablePadding>{servicesList}</List>
          </div>
        );
      }
    });
  }
  return categoriesList;
}

function getServicesList(category, services, values, classes) {
  let servicesList = services.map((service, index) =>
    service.category_id === category.id &&
    (values.professional_attributes.proposals_attributes[index].price > 0 &&
      values.professional_attributes.proposals_attributes[index].price !==
        undefined) ? (
      <ListItem
        className={classes.listItem}
        key={"select_servive_container_" + service.id}
      >
        <ListItemText
          primary={service.name}
          secondary={"Commission: " + service.commission + "%"}
        />
        <Typography variant="body1">
          <EuroSymbol className={classes.euroIcon} />
          {values.professional_attributes.proposals_attributes[index].price}
        </Typography>
      </ListItem>
    ) : (
      ""
    )
  );

  return servicesList.filter(v => v !== "");
}

function ReviewSelectionForm(props) {
  const { classes } = props;
  const { values } = props;
  const { categories } = props;
  const { services } = props;
  const servicesList = listServices(categories, services, values, classes);
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Récapitulatif de votre inscription
      </Typography>
      <Typography variant="h6" gutterBottom>
        Identification
      </Typography>

      <Grid container spacing={0}>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            color="textSecondary"
            gutterBottom
            align="left"
          >
            Prénom:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" gutterBottom align="left">
            <em>{values.first_name}</em>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            color="textSecondary"
            gutterBottom
            align="left"
          >
            Nom:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" gutterBottom align="left">
            <em>{values.last_name}</em>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            color="textSecondary"
            gutterBottom
            align="left"
          >
            Addresse:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" gutterBottom align="left">
            <em>{values.street_name + " " + values.plot_number}</em>
            <br />
            <em>{values.post_code + " " + values.city_name}</em>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            color="textSecondary"
            gutterBottom
            align="left"
          >
            Courriel:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" gutterBottom align="left">
            <em>{values.email}</em>
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="body2"
            color="textSecondary"
            gutterBottom
            align="left"
          >
            Numero de téléphone:
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" gutterBottom align="left">
            <em>{values.phone_number}</em>
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom className={classes.title}>
        Services choisis
      </Typography>
      {servicesList.length !== 0 ? (
        servicesList
      ) : (
        <Typography variant="body2" gutterBottom align="left">
          <em>Pas de services</em>
        </Typography>
      )}
    </React.Fragment>
  );
}

ReviewSelectionForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ReviewSelectionForm);
