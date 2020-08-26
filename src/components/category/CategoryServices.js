import React from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

import withStyles from "@material-ui/core/styles/withStyles";

import SiteHeader from "../../shared/SiteHeader";
import SiteFooter from "../../shared/SiteFooter";

import ServicesData from "../../data/ServicesData";

const styles = theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 4,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
});

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0,0,0,.125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    }
  },
  expanded: {
    margin: "auto"
  }
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0,0,0,.03)",
    borderBottom: "1px solid rgba(0,0,0,.125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56
    }
  },
  content: {
    "&$expanded": {
      margin: "12px 0"
    }
  },
  expanded: {}
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = "ExpansionPanelSummary";

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 2
  }
}))(MuiExpansionPanelDetails);

class CategoryServices extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: "service",
      servicesByCategory: []
    };
    this.getServicesByCategory(props.categoryId);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.categoryId !== this.props.categoryId) {
      this.setState({
        servicesByCategory: []
      });
      this.getServicesByCategory(newProps.categoryId);
    }
  }

  async getServicesByCategory(id) {
    const servicesByCategory = await ServicesData.getServicesCategory(id);

    if (servicesByCategory !== undefined) {
      const services = await ServicesData.getServicesByCategory(id);
      if (services !== undefined) {
        servicesByCategory["services"] = services;
        this.setState({
          servicesByCategory: servicesByCategory,
          expanded: "service" + servicesByCategory.services[0].serviceId
        });
      }
    }
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  render() {
    const { classes } = this.props;

    if (this.state.servicesByCategory.length === 0) {
      return <LinearProgress />;
    }
    const { expanded, servicesByCategory } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />
        <SiteHeader />
        <main className={classes.layout}>
          <Typography component="h1" variant="h5">
            {servicesByCategory.categoryName}
          </Typography>
          <br />
          <Typography>{servicesByCategory.categoryDescription}</Typography>
          <br />
          {servicesByCategory.services.map(service => (
            <ExpansionPanel
              square
              expanded={expanded === "service" + service.serviceId}
              onChange={this.handleChange("service" + service.serviceId)}
            >
              <ExpansionPanelSummary>
                <Typography>{service.serviceName}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  <br />
                  {service.serviceDescription}
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </main>
        <SiteFooter footerLayoutStyle={classes.layout} />
      </React.Fragment>
    );
  }
}

CategoryServices.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CategoryServices);
