import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { Link } from "react-router-dom";
import PlanningData from "../data/PlanningData";

class PersonaMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      statusName: props.statusName,
      loadingStatus: false
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleCancelPlanning = async planningId => {
    this.setState({ loadingStatus: true });
    const response = await PlanningData.deletePlanning(planningId);
    if (response.status === 204) {
      debugger;
    }
    this.setState({ loadingStatus: false, anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <React.Fragment>
        <IconButton
          aria-label="Menu"
          aria-owns={anchorEl ? "simple-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem
            component={Link}
            to={"/admin/gestionpermissions/" + this.props.personaId}
          >
            Permissions
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default PersonaMenu;
