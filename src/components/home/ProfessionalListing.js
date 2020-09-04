import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import OrderFrmProps from "../../shared/OrderFrmProps";

const styles = theme => ({
  root: {
    width: "100%",
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60
  }
});

class ProfessionalListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      professionalList: [],
      maximumState: 100
    };
    this.getProfessionals();
  }

  async getProfessionals() {
    const professionalList = await OrderFrmProps.getProfessionals();
    this.setState({
      professionalList: professionalList.professionalPersonas
    });
  }

  listProfessionals(professionals, classes) {
    //   professional.geo_coords <= this.state.maximumState && geoCoords?
    // debugger;
    return professionals.map(professional => (
      <ListItem
        key={"prestataire-" + professional.professionalId}
        alignitems="flex-start"
      >
        {professional.picture !== null && (
          <ListItemAvatar>
            <Avatar
              alt={professional.firstName + " " + professional.lastName}
              src={professional.picture}
              className={classes.bigAvatar}
            />
          </ListItemAvatar>
        )}

        <ListItemText
          primary={professional.firstName + " " + professional.lastName}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                className={classes.inline}
                color="textPrimary"
              >
                {/*<small>{"à professional.geoCoords +" + " km"}</small> */}
              </Typography>
              {" - " +
                professional.expertises
                  .map(expertise => expertise.service.title)
                  .join(", ")}
            </React.Fragment>
          }
        />
      </ListItem>
    ));
  }

  render() {
    const { classes } = this.props;

    if (this.state.professionalList.length === 0) {
      return (
        <Paper className={classes.root} elevation={1}>
          <center>
            <CircularProgress />
          </center>
        </Paper>
      );
    }

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h5" component="h3">
          Prestataires de services près de chez vous
        </Typography>
        <List className={classes.root}>
          {this.state.professionalList.length === 0 ? (
            <center>
              <Typography component="span" color="textPrimary">
                <small>
                  Nous sommes désolés, nous n'avons pas pu localiser aucun
                  prestataire près de chez vous.
                </small>
              </Typography>
            </center>
          ) : (
            this.listProfessionals(this.state.professionalList, classes)
          )}
        </List>
      </Paper>
    );
  }
}

ProfessionalListing.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProfessionalListing);
