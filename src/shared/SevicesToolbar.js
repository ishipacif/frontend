import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Toc from "@material-ui/icons/Toc";
import VerticalSplit from "@material-ui/icons/VerticalSplit";

import { Can } from "@casl/react";
import { Ability } from "@casl/ability";

const styles = theme => ({
  center: {
    textAlign: "center"
  }
});

class SevicesToolbar extends React.Component {
  constructor(props) {
    super(props);
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));
    this.state = { permissions: auth_params.permissions };
  }
  render() {
    const { classes } = this.props;
    const ability = new Ability(this.state.permissions);
    return (
      <div className={classes.center}>
        <div>
          <Can I="manage" a="Service" ability={ability}>
            <Button component={Link} to="/admin/services">
              <VerticalSplit />
              &nbsp;Services
            </Button>
          </Can>
          <Can I="manage" a="Category" ability={ability}>
            &nbsp;|&nbsp;
            <Button component={Link} to="/admin/categories">
              <Toc />
              &nbsp;Categories
            </Button>
          </Can>
        </div>
        <br />
      </div>
    );
  }
}

SevicesToolbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SevicesToolbar);
