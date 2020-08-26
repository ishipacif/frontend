import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import DateFnsUtils from "@date-io/date-fns";
import frLocale from "date-fns/locale/fr";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { TimePicker, DatePicker } from "material-ui-formik-components";
// import { TimePicker } from "material-ui-pickers";
// import { DatePicker } from "material-ui-pickers";

import { Field } from "formik";

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 500
  },
  listSection: {
    backgroundColor: "inherit"
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
});

function disableDates(date, disabledDates) {
  const dateInterdites = disabledDates.map(arrVal => {
    return new Date(
      new Date(arrVal).toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    ).getTime();
  });

  return dateInterdites.includes(date.getTime());
}

const DatePickerField = props => (
  <DatePicker
    keyboard
    autoOk
    disablePast
    minDate={new Date()}
    shouldDisableDate={date => disableDates(date, props.disabledDates)}
    name={props.field.name}
    value={props.field.value}
    label={props.label}
    format="dd/MMM/yyyy"
    onChange={date => props.form.setFieldValue(props.field.name, date)}
  />
);

const TimePickerField = props => (
  <TimePicker
    keyboard
    keyboardIcon="access_time"
    autoOk
    ampm={false}
    format="HH:mm"
    label={props.label}
    name={props.field.name}
    value={props.field.value}
    onChange={time => props.form.setFieldValue(props.field.name, time)}
  />
);

class ProfessionalSelectionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      professionalPersonas: props.professionalPersonas,
      serviceListCollapse: props.serviceListCollapse
    };
  }

  handleClick(personaId, serviveId) {
    let currentserviceListCollapse = this.state.serviceListCollapse;
    currentserviceListCollapse[personaId][
      serviveId
    ] = !currentserviceListCollapse[personaId][serviveId];
    this.setState({
      serviceListCollapse: currentserviceListCollapse
    });
  }

  filterPlanning(professional_id, service_id) {
    return this.props.values.customer_attributes.plannings_attributes.filter(
      planning =>
        planning.professional_id === professional_id &&
        planning.service_id === service_id
    );
  }

  filterDisabledDates(unavailabilities, service_id) {
    const disabledDates = [];
    unavailabilities.forEach(function(unavailability) {
      // if (unavailability.service_id === service_id) {
      disabledDates.push(unavailability.date);
      // }
    });
    return disabledDates;
  }

  getPlanningIndex(professional_id, service_id) {
    for (
      var i = 0;
      i < this.props.values.customer_attributes.plannings_attributes.length;
      i++
    ) {
      if (
        this.props.values.customer_attributes.plannings_attributes[i]
          .professional_id === professional_id &&
        this.props.values.customer_attributes.plannings_attributes[i]
          .service_id === service_id
      ) {
        return i;
      }
    }
    return ""; //to handle the case where the value doesn't exist
  }

  render() {
    const { classes } = this.props;

    if (this.state.professionalPersonas.length === 0) {
      return (
        <center>
          <CircularProgress />
        </center>
      );
    }
    return (
      <React.Fragment>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
          <Typography variant="h5" gutterBottom>
            Choisissez un service et proposez un horaire au prestataire
          </Typography>
          <List className={classes.root} subheader={<li />}>
            {this.state.professionalPersonas.map(professionalPersona => (
              <li
                key={"section" + professionalPersona.id}
                className={classes.listSection}
              >
                <ul className={classes.ul}>
                  <ListSubheader>
                    <Typography variant="title" gutterBottom>
                      <AccountCircle />
                      {professionalPersona.first_name +
                        " " +
                        professionalPersona.last_name}
                    </Typography>
                    <Typography variant="caption" gutterBottom align="center">
                      {"Se trouve à " +
                        professionalPersona.geo_coords +
                        " km de chez vous."}
                    </Typography>
                  </ListSubheader>
                  {professionalPersona.professional.proposals.map(proposal => (
                    <div
                      key={
                        "proposal-" +
                        professionalPersona.id +
                        "-" +
                        proposal.service.id
                      }
                    >
                      <ListItem
                        button
                        onClick={e =>
                          this.handleClick(
                            '"' + professionalPersona.id + '"',
                            '"' + proposal.service.id + '"'
                          )
                        }
                        key={
                          "item-" +
                          professionalPersona.id +
                          "-" +
                          proposal.service.id
                        }
                      >
                        <ListItemText
                          primary={proposal.service.name}
                          secondary={proposal.price + "€"}
                        />
                        {this.state.serviceListCollapse[
                          '"' + professionalPersona.id + '"'
                        ]['"' + proposal.service.id + '"'] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </ListItem>
                      <Collapse
                        in={
                          this.state.serviceListCollapse[
                            '"' + professionalPersona.id + '"'
                          ]['"' + proposal.service.id + '"']
                        }
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          <ListItem inset="true" className={classes.nested}>
                            <Grid container spacing={8}>
                              <Grid
                                item
                                container
                                justify="center"
                                xs={12}
                                sm={4}
                              >
                                <Field
                                  label="Date"
                                  fullWidth
                                  disabledDates={this.filterDisabledDates(
                                    professionalPersona.professional
                                      .unavailabilities,
                                    proposal.service.id
                                  )}
                                  value={
                                    this.filterPlanning(
                                      professionalPersona.professional.id.toString(),
                                      proposal.service.id.toString()
                                    ).date
                                  }
                                  name={
                                    "customer_attributes.plannings_attributes." +
                                    this.getPlanningIndex(
                                      professionalPersona.professional.id,
                                      proposal.service.id
                                    ) +
                                    ".date"
                                  }
                                  component={DatePickerField}
                                />
                              </Grid>
                              <Grid
                                item
                                container
                                justify="center"
                                xs={12}
                                sm={4}
                              >
                                <Field
                                  label="Heure de début"
                                  fullWidth
                                  value={
                                    this.filterPlanning(
                                      professionalPersona.professional.id,
                                      proposal.service.id
                                    ).start_hour
                                  }
                                  name={
                                    "customer_attributes.plannings_attributes." +
                                    this.getPlanningIndex(
                                      professionalPersona.professional.id,
                                      proposal.service.id
                                    ) +
                                    ".start_hour"
                                  }
                                  component={TimePickerField}
                                />
                              </Grid>
                              <Grid
                                item
                                container
                                justify="center"
                                xs={12}
                                sm={4}
                              >
                                <Field
                                  label="Heure de fin"
                                  fullWidth
                                  value={
                                    this.filterPlanning(
                                      professionalPersona.professional.id,
                                      proposal.service.id
                                    ).end_hour
                                  }
                                  name={
                                    "customer_attributes.plannings_attributes." +
                                    this.getPlanningIndex(
                                      professionalPersona.professional.id,
                                      proposal.service.id
                                    ) +
                                    ".end_hour"
                                  }
                                  component={TimePickerField}
                                />
                              </Grid>
                            </Grid>
                          </ListItem>
                        </List>
                      </Collapse>
                    </div>
                  ))}
                  <Divider />
                </ul>
              </li>
            ))}
          </List>
        </MuiPickersUtilsProvider>
      </React.Fragment>
    );
  }
}

ProfessionalSelectionForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfessionalSelectionForm);
