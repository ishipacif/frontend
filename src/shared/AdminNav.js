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
import { Can } from "@casl/react";
import { Ability } from "@casl/ability";

class AdminNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: props.permissions,
      fixesPrices: props.fixesPrices
    };
  }

  render() {
    const ability = new Ability(this.state.permissions);
    return (
      <React.Fragment>
        <ListItem button component={Link} to="/admin">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Acceuil Admin" />
        </ListItem>
        {/*  <Can I="manage" a="Invoice" ability={ability}>
          <ListItem button>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Invoices" />
          </ListItem>
        </Can> */}
        <Can I="manage" a="Service" ability={ability}>
          <ListItem button component={Link} to="/admin/services">
            <ListItemIcon>
              <VerticalSplitIcon />
            </ListItemIcon>
            <ListItemText primary="Services & Categories" />
          </ListItem>
        </Can>
        <Can I="manage" a="Persona" ability={ability}>
          <ListItem button component={Link} to="/admin/personas">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Personas" />
          </ListItem>
        </Can>
        <Divider />
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Acceuil" />
        </ListItem>
        {this.state.fixesPrices && (
          <React.Fragment>
            <Can I="manage" a="Planning" ability={ability}>
              <ListItem button component={Link} to="/commandes">
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Les commandes" />
              </ListItem>
            </Can>
            <Can I="manage" a="Proposal" ability={ability}>
              <ListItem button>
                <ListItemIcon>
                  <VerticalSplitIcon />
                </ListItemIcon>
                <ListItemText primary="Mes services" />
              </ListItem>
            </Can>
          </React.Fragment>
        )}
        {!this.state.fixesPrices && (
          <React.Fragment>
            <Can I="create" a="Planning" ability={ability}>
              <ListItem button component={Link} to="/ajoutercommande/0">
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Nouvel commande" />
              </ListItem>
            </Can>
            <Can I="manage" a="Planning" ability={ability}>
              <ListItem m button component={Link} to="/commandes">
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Mes commandes" />
              </ListItem>
            </Can>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default AdminNavigation;
