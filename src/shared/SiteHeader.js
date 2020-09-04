import React, { Component } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import MediaQuery from "react-responsive";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import MenuIcon from "@material-ui/icons/Menu";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  toolbarTitle: {
    flex: 1
  },
  imageStyle: {
    height: "50px"
  }
});
class SiteHeader extends Component {
  constructor(props) {
    super(props);
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));
    this.state = {
      open: false,
      isAuthenticated: auth_params ? auth_params.isAuthenticated : false,
      fixesPrices: auth_params ? auth_params.fixesPrices : undefined
    };
  }

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const classes = this.props.classes;
    const { open } = this.state;
    return (
      <AppBar position="sticky" color="default" className={classes.appBar}>
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            <Button aria-label="Menu" href="/">
              <img src="logo.png" className={classes.imageStyle} alt="dhis2" />
            </Button>
            House Cleaning
          </Typography>
          <MediaQuery maxWidth={1224}>
            <IconButton
              buttonRef={node => {
                this.anchorEl = node;
              }}
              aria-owns={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              onClick={this.handleToggle}
            >
              <MenuIcon />
            </IconButton>
            <Popper
              open={open}
              anchorEl={this.anchorEl}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  id="menu-list-grow"
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom"
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={this.handleClose}>
                      <MenuList>
                        <MenuItem
                          component={Link}
                          to="/"
                          onClick={this.handleClose}
                        >
                          Acceuil
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/category/Interieur"
                          onClick={this.handleClose}
                        >
                          L'interieur
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/category/Exterieur"
                          onClick={this.handleClose}
                        >
                          L'exterieur
                        </MenuItem>
                        {this.state.isAuthenticated && (
                          <MenuItem
                            component={Link}
                            to="/commandes"
                            onClick={this.handleClose}
                          >
                            Commandes
                          </MenuItem>
                        )}
                        <MenuItem
                          component={Link}
                          to="/contact"
                          onClick={this.handleClose}
                        >
                          Nous Contacter
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/login"
                          onClick={this.handleClose}
                        >
                          {this.state.isAuthenticated
                            ? "Espace " +
                              (this.state.fixesPrices
                                ? "Prestataire"
                                : "Client")
                            : "Se connecter"}
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </MediaQuery>

          <MediaQuery minWidth={1224}>
            <Button component={Link} to="/">
              Acceuil
            </Button>
            <Button component={Link} to="/category/Interieur">
              L'interieur
            </Button>
            <Button component={Link} to="/category/Exterieur">
              L'exterieur
            </Button>
            {this.state.isAuthenticated && (
              <Button component={Link} to="/commandes">
                Commandes
              </Button>
            )}
            <Button component={Link} to="/contact">
              Nous Contacter
            </Button>
            <Button
              color="primary"
              variant="outlined"
              component={Link}
              to="/login"
            >
              {this.state.isAuthenticated
                ? "Espace " +
                  (this.state.fixesPrices ? "Prestataire" : "Client")
                : "Se connecter"}
            </Button>
          </MediaQuery>
        </Toolbar>
      </AppBar>
    );
  }
}
SiteHeader.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SiteHeader);
