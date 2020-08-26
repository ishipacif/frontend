import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Zoom from "@material-ui/core/Zoom";
import AddIcon from "@material-ui/icons/Add";
import { Link, Redirect } from "react-router-dom";
import MaterialTable from "material-table";

import PersonaTypes from "../../../data/PersonaTypes";
import PersonasData from "../../../data/PersonasData";

import PersonaMenu from "../../../shared/PersonaMenu";

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper
    // width: 500
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  }
});

class Personas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personaTypes: [],
      personas: [],
      tabId: 0,
      toEdit: false,
      personaTypeId: ""
    };
    this.get_types();
    this.get_personas();
  }

  handleChange = (event, tabId) => {
    this.setState({ tabId });
  };

  handleChangeIndex = index => {
    this.setState({ tabId: index });
  };

  handleEdit = personaTypeId => {
    this.setState({
      toEdit: true,
      personaTypeId: personaTypeId
    });
  };

  async get_types() {
    const rawPersonaTypes = await PersonaTypes.getPersonaTypes();

    const personaTypes = rawPersonaTypes.map(function(personaType) {
      return {
        id: personaType.id,
        name: personaType.name,
        count: personaType.personas.length
      };
    });

    this.setState({
      personaTypes: personaTypes
    });
  }

  async get_personas() {
    const rawPersonas = await PersonasData.getPersonas();

    const personas = rawPersonas.map(function(persona) {
      return {
        first_name: persona.first_name + " " + persona.last_name,
        email: persona.email,
        phone_number: persona.phone_number,
        type_id: persona.type.name,
        permissions: <PersonaMenu personaId={persona.id} />,
        id: persona.id
      };
    });

    this.setState({
      personas: personas
    });
  }

  render() {
    if (this.state.toEdit === true) {
      return (
        <Redirect to={"/admin/personatypes/edit/" + this.state.personaTypeId} />
      );
    }
    const { classes, theme } = this.props;

    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen
    };

    const fabs = [
      {},
      {
        color: "primary",
        className: classes.fab,
        icon: <AddIcon />
      }
    ];

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.tabId}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Personas" />
            <Tab label="Types" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={this.state.tabId}
          onChangeIndex={this.handleChangeIndex}
        >
          <div style={{ padding: 8 * 3 }}>
            <MaterialTable
              data={this.state.personas}
              title={"Personas (tout les types)"}
              columns={[
                {
                  title: "Noms",
                  field: "first_name"
                },
                {
                  title: "Email",
                  field: "email"
                },
                {
                  title: "Numero de téléphone",
                  field: "phone_number",
                  type: "numeric"
                },
                {
                  title: "Type",
                  field: "type_id"
                },
                {
                  title: "",
                  field: "permissions"
                }
              ]}
              options={{
                columnsButton: false,
                filtering: false
              }}
            />
          </div>
          <div style={{ padding: 8 * 3 }}>
            <MaterialTable
              data={this.state.personaTypes}
              title={"Persona types"}
              columns={[
                {
                  title: "Nom",
                  field: "name"
                },
                {
                  title: "Total enregistrés",
                  field: "count",
                  type: "numeric"
                }
              ]}
              actions={[
                {
                  icon: "edit",
                  tooltip: "Modifier",
                  onClick: (event, rowData) => {
                    this.handleEdit(rowData.id);
                  }
                }
              ]}
              localization={{
                actions: ""
              }}
              options={{
                columnsButton: false,
                filtering: false
              }}
            />
          </div>
        </SwipeableViews>
        {fabs.map((fab, index) =>
          index === 0 ? (
            ""
          ) : (
            <Zoom
              key={fab.color}
              in={this.state.tabId === index}
              timeout={transitionDuration}
              style={{
                transitionDelay: `${
                  this.state.tabId === index ? transitionDuration.exit : 0
                }ms`
              }}
              unmountOnExit
            >
              <Button
                variant="fab"
                className={fab.className}
                color={fab.color}
                component={Link}
                to="/admin/personatypes/add"
              >
                {fab.icon}
              </Button>
            </Zoom>
          )
        )}
      </div>
    );
  }
}

Personas.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Personas);
