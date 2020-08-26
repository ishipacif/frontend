import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import { Link } from "react-router-dom";
import PlanningData from "../data/PlanningData";

class OrderMenu extends Component {
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
      <div>
        {this.state.loadingStatus ? (
          <CircularProgress
            variant="indeterminate"
            disableShrink
            size={24}
            thickness={4}
          />
        ) : (
          <React.Fragment>
            <Typography variant="caption" gutterBottom>
              <em>{this.state.statusName}</em>
            </Typography>
            {this.props.statusId === 1 && (
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
                    to={"/ajoutercommande/" + this.props.planningId}
                  >
                    Modifier
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      this.handleCancelPlanning(this.props.planningId)
                    }
                  >
                    Annuler
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default OrderMenu;
