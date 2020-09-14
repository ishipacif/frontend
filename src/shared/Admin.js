import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";

import { Redirect } from "react-router";

import AdminNavigation from "./AdminNav";
// import PersonasData from "../data/PersonasData";

const drawerWidth = 250;

const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: "100vh",
    overflow: "auto"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  }
});

class Admin extends React.Component {
  constructor(props) {
    super(props);
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));
    this.state = {
      anchorEl: null,
      open: false,
      isAuthenticated:
        props.location !== undefined &&
        props.location.state !== undefined &&
        props.location.state.isAuthenticated !== undefined
          ? props.location.state.isAuthenticated
          : auth_params.isAuthenticated,
      currentPersonaInfo:
        auth_params && auth_params.isAuthenticated
          ? auth_params.currentUser
          : undefined
    };
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  async disconnectPersona() {
    // const response = await PersonasData.disconnectPersona();

    // if (response.success === true) {
    localStorage.removeItem("auth_params");
    this.setState({
      currentPersonaInfo: undefined,
      isAuthenticated: false
    });
    // }
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;

    const open = Boolean(anchorEl);
    if (
      this.state.isAuthenticated === false &&
      this.state.currentPersonaInfo === undefined &&
      JSON.parse(localStorage.getItem("auth_params")) === null
    ) {
      return (
        <Redirect
          push
          to={{
            pathname: "/login",
            state: {
              snackBarOpen: true,
              snackBarContent: "Votre session a expiré"
            }
          }}
        />
      );
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={classNames(
              classes.appBar,
              this.state.open && classes.appBarShift
            )}
          >
            <Toolbar
              disableGutters={!this.state.open}
              className={classes.toolbar}
            >
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(
                  classes.menuButton,
                  this.state.open && classes.menuButtonHidden
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                House Cleaning
              </Typography>
              {this.state.currentPersonaInfo && (
                <div>
                  <IconButton
                    aria-owns={open ? "menu-appbar" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                    open={open}
                    onClose={this.handleClose}
                  >
                    <MenuItem disabled>
                      {this.state.currentPersonaInfo.person.firstName +
                        " " +
                        this.state.currentPersonaInfo.person.lastName}
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={event => {
                        this.handleClose();
                      }}
                      button
                      component={Link}
                      to="/admin/profile"
                    >
                      Mon Profil
                    </MenuItem>
                    <MenuItem
                      onClick={event => {
                        this.disconnectPersona();
                        this.handleClose();
                      }}
                    >
                      Se déconnecter
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(
                classes.drawerPaper,
                !this.state.open && classes.drawerPaperClose
              )
            }}
            open={this.state.open}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={this.handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List onClick={this.handleDrawerClose}>
              {this.state.currentPersonaInfo ? (
                <AdminNavigation />
              ) : (
                <CircularProgress />
              )}
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />

            {this.props.bodyComponent}
          </main>
        </div>
      </React.Fragment>
    );
    // }
  }
}

Admin.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Admin);
