import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";

import PersonaTypes from "../../../data/PersonaTypes";
import PersonasData from "../../../data/PersonasData";

// import PersonaMenu from "../../../shared/PersonaMenu";

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
      personaType: this.props.match.params.personaType
    };
    // this.get_types();
    this.getPersonas(this.props.match.params.personaType);
  }

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

  async getPersonas(personaType) {
    const rawPersonas = await PersonasData.getPersonas(personaType);

    // const personas = rawPersonas.map(function(persona) {
    //   return {
    //     first_name: persona.first_name + " " + persona.last_name,
    //     email: persona.email,
    //     phone_number: persona.phone_number,
    //     type_id: persona.type.name,
    //     permissions: <PersonaMenu personaId={persona.id} />,
    //     id: persona.id
    //   };
    // });

    this.setState({
      personas: rawPersonas
    });
  }

  componentWillReceiveProps(newProps) {
    if (
      newProps.match.params.personaType !== this.props.match.params.personaType
    ) {
      this.getPersonas(newProps.match.params.personaType);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <MaterialTable
          data={this.state.personas}
          title={
            "Personas (" +
            (this.props.match.params.personaType === "customers"
              ? "Customers"
              : "Professionals") +
            ")"
          }
          columns={[
            {
              title: "Prénom",
              field: "lastName"
            },
            {
              title: "Noms",
              field: "firstName"
            },
            {
              title: "Email",
              field: "email"
            },
            {
              title: "Numero de téléphone",
              field: "phoneNumber",
              type: "numeric"
            }
          ]}
          options={{
            columnsButton: false,
            filtering: false
          }}
        />
      </div>
    );
  }
}

Personas.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Personas);
