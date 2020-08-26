import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";

const styles = theme => ({
  cardHeader: {
    backgroundColor: theme.palette.grey[200]
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing.unit * 2
  },
  cardActions: {
    [theme.breakpoints.up("sm")]: {
      paddingBottom: theme.spacing.unit * 2
    }
  }
});

class PersonaTypesTiers extends Component {

  constructor(props) {
    super(props);
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));
    this.state = {
      isAuthenticated: (auth_params) ? auth_params.isAuthenticated : false
     };
  }

  render() {
    const classes = this.props.classes;

    if (this.props.tiers === undefined) {
      return (
        <div>
          <CircularProgress className={classes.progress} size={50} />
        </div>
      );
    }

    return (
      <Grid container spacing={40} alignItems="flex-end">
        {this.props.tiers.map(tier => (
          // Enterprise card is full width at sm breakpoint
          <Grid item key={tier.title} xs={12} sm={12} md={6}>
            <Card>
              <CardHeader
                title={tier.title}
                titleTypographyProps={{ align: "center" }}
                subheaderTypographyProps={{ align: "center" }}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    <em>{tier.count}</em>
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    <em>déjà enregistrés.</em>
                  </Typography>
                </div>
                {tier.description.map(line => (
                  <Typography variant="subtitle1" align="center" key={line}>
                    {line}
                  </Typography>
                ))}
              </CardContent>
              {!this.state.isAuthenticated && (<CardActions className={classes.cardActions}>
                <Button
                  component={Link}
                  to={"/signup/" + tier.id}
                  fullWidth
                  variant={tier.buttonVariant}
                  color="primary"
                >
                  {tier.buttonText}
                </Button>
              </CardActions>)}

            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }
}

PersonaTypesTiers.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PersonaTypesTiers);
