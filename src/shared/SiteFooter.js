import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  footer: {
    marginTop: theme.spacing.unit * 8,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit * 6}px 0`
  }
});

const footers = [
  {
    title: "House Cleaning",
    links: [
      { href: "/", caption: "Home" },
      { href: "/contact/", caption: "Nous contacter" },
      { href: "/login", caption: "Se connecter" }
    ]
  },
  {
    title: "Services",
    links: [
      { href: "/category/Interieur", caption: "L'interieur" },
      { href: "/category/Exterieur", caption: "L'exterieur" }
    ]
  }
];

class SiteFooter extends Component {
  render() {
    const classes = this.props.classes;
    return (
      <footer className={classNames(classes.footer, classes.layout)}>
        <Grid container spacing={2} justify="space-evenly">
          {footers.map(footer => (
            <Grid item xs key={footer.title}>
              <Typography variant="h6" color="textPrimary" gutterBottom>
                {footer.title}
              </Typography>
              {footer.links.map((link, i) => (
                <li key={"footer-link-" + i}>
                  <Typography
                    component={Link}
                    key={i}
                    variant="subtitle1"
                    color="textSecondary"
                    to={link.href}
                  >
                    {link.caption}
                  </Typography>
                </li>
              ))}
            </Grid>
          ))}
        </Grid>
      </footer>
    );
  }
}
SiteFooter.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SiteFooter);
