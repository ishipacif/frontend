import React, { Component } from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

import DashboardIcon from "@material-ui/icons/Dashboard";
import VerticalSplitIcon from "@material-ui/icons/VerticalSplit";
import PeopleIcon from "@material-ui/icons/People";
import HomeIcon from "@material-ui/icons/Home";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AddIcon from "@material-ui/icons/Add";
import ReceiptIcon from "@material-ui/icons/Receipt";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-router-dom";
// import { Can } from "@casl/react";
// import { Ability } from "@casl/ability";

class AdminNavigation extends Component {
  render() {
    const { currentPersonaInfo } = this.props;
    let navMenu = <React.Fragment></React.Fragment>;
    switch (currentPersonaInfo.roles[0]) {
      case "Admin":
        navMenu = (
          <React.Fragment>
            <ListItem button component={Link} to="/monespace">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Acceuil Mon Espace" />
            </ListItem>

            <ListItem button component={Link} to="/monespace/services">
              <ListItemIcon>
                <VerticalSplitIcon />
              </ListItemIcon>
              <ListItemText primary="Services" />
            </ListItem>

            <ListItem button component={Link} to="/monespace/persona/customers">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Clients" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/monespace/persona/professionals"
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Professionels" />
            </ListItem>

            <ListItem button component={Link} to="/monespace/facturation">
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="Facturation" />
            </ListItem>

            <Divider />
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Acceuil" />
            </ListItem>
          </React.Fragment>
        );
        break;
      case "Professional":
        navMenu = (
          <React.Fragment>
            <ListItem button component={Link} to="/monespace">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Acceuil Mon Espace" />
            </ListItem>

            <ListItem button component={Link} to="/expertises">
              <ListItemIcon>
                <VerticalSplitIcon />
              </ListItemIcon>
              <ListItemText primary="Mes services" />
            </ListItem>

            <ListItem button component={Link} to="/nouvelexpertise">
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Ajouter un service" />
            </ListItem>

            <ListItem button component={Link} to="/reservations">
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Les Reservations" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Acceuil" />
            </ListItem>
          </React.Fragment>
        );
        break;
      case "Customer":
        navMenu = (
          <React.Fragment>
            <ListItem button component={Link} to="/monespace">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Acceuil Mon Espace" />
            </ListItem>
            <ListItem button component={Link} to="/ajoutercommande">
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
            <Divider />
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Acceuil" />
            </ListItem>
          </React.Fragment>
        );
        break;
      default:
        navMenu = (
          <React.Fragment>
            <ListItem button component={Link} to="/monespace">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Acceuil Mon Espace" />
            </ListItem>
            <Divider />
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Acceuil" />
            </ListItem>
          </React.Fragment>
        );
    }

    return navMenu;
  }
}

export default AdminNavigation;
