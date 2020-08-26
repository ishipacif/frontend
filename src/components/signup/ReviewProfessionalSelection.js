import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
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

function filterService(service_id, services) {
  let filtered = services.find(service => service.id === service_id);
  return filtered.name;
}

function filterPersona(professional_id, professionalPersonas) {
  let filtered = professionalPersonas.find(
    professionalPersona =>
      professionalPersona.professional.id === professional_id
  );
  // Les prix sont dispo sous professional.proposals...
  return { full_name: filtered.first_name + " " + filtered.last_name };
}

function getServicesList(services, values, professionalPersonas, classes) {
  let plannedServices = values.customer_attributes.plannings_attributes;

  let servicesList = plannedServices.map((planned, index) =>
    planned.date !== null &&
    planned.date !== null &&
    planned.start_hour !== null &&
    planned.end_hour !== null ? (
      <ListItem
        className={classes.listItem}
        key={"select_servive_container_" + planned.service_id}
      >
        <ListItemText
          primary={filterService(planned.service_id, services)}
          secondary={
            "Date: " +
            planned.date.toLocaleString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric"
            }) +
            ". Heure: " +
            planned.start_hour.toLocaleString("fr-FR", {
              hour: "numeric",
              minute: "numeric",
              hour12: false
            }) +
            " - " +
            planned.end_hour.toLocaleString("fr-FR", {
              hour: "numeric",
              minute: "numeric",
              hour12: false
            })
          }
        />
        <Typography variant="body1">
          {
            filterPersona(planned.professional_id, professionalPersonas)
              .full_name
          }
        </Typography>
        <Divider />
      </ListItem>
    ) : (
      ""
    )
  );
  return servicesList.filter(v => v !== "");
}

function ReviewProfessionalSelection(props) {
  const { classes, values, services, professionalPersonas } = props;

  const servicesList = getServicesList(
    services,
    values,
    professionalPersonas,
    classes
  );
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
        <List disablePadding>{servicesList}</List>
      ) : (
        <Typography variant="body2" gutterBottom align="left">
          <em>Pas de services</em>
        </Typography>
      )}
    </React.Fragment>
  );
}

ReviewProfessionalSelection.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ReviewProfessionalSelection);
