import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import PlanningData from "../data/PlanningData";

class PlanningMenu extends Component {
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

  handleUpdateStatus = async (planningId, statusId) => {
    this.setState({ loadingStatus: true });
    const response = await PlanningData.updateStatus({
      id: planningId,
      status_id: statusId
    });
    if (response.status === 200 || response.status === 201) {
      const rawStatus = await PlanningData.getStatusById(statusId);
      this.setState({ statusName: rawStatus.name });
    }
    this.setState({ loadingStatus: false, anchorEl: null });
  };

  applicableStatuses = (currentId, items) => {
    return items.filter(item => item.id > currentId);
  };

  render() {
    const { anchorEl } = this.state;
    const statuses = this.applicableStatuses(
      this.props.statusId,
      this.props.items
    );

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
            {statuses.length > 0 && (
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
                  {statuses.map(status => (
                    <MenuItem
                      key={"planning-status-" + status.id}
                      onClick={() =>
                        this.handleUpdateStatus(
                          this.props.planningId,
                          status.id
                        )
                      }
                    >
                      {status.name}
                    </MenuItem>
                  ))}
                </Menu>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default PlanningMenu;
