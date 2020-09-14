import React from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import withStyles from "@material-ui/core/styles/withStyles";

import SiteHeader from "../../shared/SiteHeader";
import SiteFooter from "../../shared/SiteFooter";

import ServicesData from "../../data/ServicesData";

const styles = theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up(900 + theme.spacing(6))]: {
      width: 900,
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
});

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
          expanded: "service" + servicesByCategory.services[0].id
        });
      }
    }
  }

  render() {
    const { classes } = this.props;

    if (this.state.servicesByCategory.length === 0) {
      return <LinearProgress />;
    }
    const { servicesByCategory } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />
        <SiteHeader />
        {servicesByCategory.services.length > 0 ? (
          <main className={classes.layout}>
            <Typography component="h1" variant="h5">
              {this.props.categoryId}
            </Typography>
            <br />
            {servicesByCategory.services.map(service => (
              <Accordion key={"service-id-" + service.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id={"service-id-" + service.id}
                >
                  <Typography variant="h6">{service.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{service.description}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </main>
        ) : (
          <React.Fragment>Aucun servive trouvé!</React.Fragment>
        )}

        <SiteFooter footerLayoutStyle={classes.layout} />
      </React.Fragment>
    );
  }
}

CategoryServices.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CategoryServices);
