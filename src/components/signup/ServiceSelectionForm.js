import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { Field } from "formik";
import { TextField } from "formik-material-ui";

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
});

function listServices(categories, services, values, personaType) {
  let categoriesList = categories.map(category => (
    <div key={"category_container_" + category.id}>
      <Typography variant="h6" color="textPrimary">
        {category.name} ({category.count})
      </Typography>
      <Divider />
      <List>{getServicesList(category, services, values)}</List>
    </div>
  ));
  return categoriesList;
}

function getServicesList(category, services, values) {
  let servicesList = services.map((service, index) =>
    service.category_id === category.id ? (
      <div key={"service_container_" + service.id}>
        <div style={{ display: "none" }}>
          <Field
            id={"list_service_id_" + service.id}
            name={
              "professional_attributes.proposals_attributes." +
              index +
              ".service_id"
            }
            value={
              values.professional_attributes.proposals_attributes[index]
                .service_id
            }
            type="number"
            component={TextField}
          />
        </div>
        <ListItem key={"service_name_" + service.id}>
          <ListItemText
            primary={service.name}
            secondary={"Commission: " + service.commission + "%"}
          />
          <Field
            id={"service_price_" + service.id}
            name={
              "professional_attributes.proposals_attributes." + index + ".price"
            }
            value={
              values.professional_attributes.proposals_attributes[index].price
            }
            label="Prix par heure"
            type="number"
            component={TextField}
          />
        </ListItem>
        <li>
          <Divider />
        </li>
      </div>
    ) : (
      ""
    )
  );

  return servicesList.filter(v => v !== "");
}

function ServiceSelectionForm(props) {
  const { classes } = props;
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Entrez les prix pour les services que vous proposez
      </Typography>
      <div className={classes.root}>
        {listServices(
          props.categories,
          props.services,
          props.values,
          props.personaType
        )}
      </div>
    </React.Fragment>
  );
}

ServiceSelectionForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ServiceSelectionForm);
