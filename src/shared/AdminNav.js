import React, { Component } from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

import DashboardIcon from "@material-ui/icons/Dashboard";
import VerticalSplitIcon from "@material-ui/icons/VerticalSplit";
import PeopleIcon from "@material-ui/icons/People";
// import BarChartIcon from "@material-ui/icons/BarChart";
import HomeIcon from "@material-ui/icons/Home";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AddIcon from "@material-ui/icons/Add";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";
// import { Can } from "@casl/react";
// import { Ability } from "@casl/ability";

class AdminNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: props.permissions,
      fixesPrices: props.fixesPrices
    };
  }

  render() {
    // const ability = new Ability(this.state.permissions);
    return (
      <React.Fragment>
        <ListItem button component={Link} to="/admin">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Acceuil Admin" />
        </ListItem>

        <ListItem button component={Link} to="/admin/services">
          <ListItemIcon>
            <VerticalSplitIcon />
          </ListItemIcon>
          <ListItemText primary="Services" />
        </ListItem>

        <ListItem button component={Link} to="/admin/persona/customers">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Clients" />
        </ListItem>

        <ListItem button component={Link} to="/admin/persona/professionals">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Professionels" />
        </ListItem>

        <Divider />
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Acceuil" />
        </ListItem>

        <React.Fragment>
          <ListItem button component={Link} to="/commandes">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Les commandes" />
          </ListItem>

          <ListItem button>
            <ListItemIcon>
              <VerticalSplitIcon />
            </ListItemIcon>
            <ListItemText primary="Mes services" />
          </ListItem>
        </React.Fragment>

        <React.Fragment>
          <ListItem button component={Link} to="/ajoutercommande/0">
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary="Nouvel commande" />
          </ListItem>

          <ListItem m button component={Link} to="/commandes">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Mes commandes" />
          </ListItem>
        </React.Fragment>
      </React.Fragment>
    );
  }
}

export default AdminNavigation;
