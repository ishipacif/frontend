import React, { Component } from "react";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import CategoryServices from "./components/category/CategoryServices";
import Contact from "./components/contact/Contact";
import Signup from "./components/signup/Signup";
import Commande from "./components/planning/Commande";
import OrderFrm from "./components/planning/OrderFrm";
import Dashboard from "./components/admin/dashboard/Dashboard";
import Personas from "./components/admin/personas/Personas";
import TypesFrm from "./components/admin/personas/TypesFrm";
import PersonaProfile from "./components/admin/personas/PersonaProfile";
import PersonaPermissions from "./components/admin/personas/PersonaPermissions";
import Expertises from "./components/admin/personas/Expertises";
import ExpertiseFrm from "./components/admin/personas/ExpertiseFrm";
import Services from "./components/admin/services/Services";
import Categories from "./components/admin/categories/Categories";

import Admin from "./shared/Admin";

class App extends Component {
  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Router>
          <div className="App">
            <Switch>
              <Route exact path="/" render={props => <Home />} />
              <Route path="/signup" render={props => <Signup {...props} />} />
              <Route
                path="/nouvelexpertise"
                render={props => (
                  <Admin
                    {...props}
                    bodyComponent={<ExpertiseFrm {...props} />}
                  />
                )}
              />
              <Route
                path="/expertises"
                render={props => (
                  <Admin {...props} bodyComponent={<Expertises {...props} />} />
                )}
              />
              <Route
                path="/commandes"
                render={props => (
                  <Admin {...props} bodyComponent={<Commande {...props} />} />
                )}
              />
              <Route
                path="/category/:categoryId"
                render={props => (
                  <CategoryServices
                    categoryId={props.match.params.categoryId}
                  />
                )}
              />
              <Route path="/contact" render={props => <Contact />} />
              <Route
                path="/ajoutercommande/:planningId"
                render={props => (
                  <Admin {...props} bodyComponent={<OrderFrm {...props} />} />
                )}
              />
              <Route path="/login" render={props => <Login {...props} />} />
              <Route
                exact
                path="/monespace"
                render={props => (
                  <Admin {...props} bodyComponent={<Dashboard />} />
                )}
              />
              <Route
                path="/monespace/persona/:personaType"
                render={props => (
                  <Admin bodyComponent={<Personas {...props} />} />
                )}
              />
              <Route
                path="/monespace/personatypes/add"
                render={props => (
                  <Admin bodyComponent={<TypesFrm {...props} />} />
                )}
              />
              <Route
                path="/monespace/personatypes/edit/:personaTypeId"
                render={props => (
                  <Admin bodyComponent={<TypesFrm {...props} />} />
                )}
              />
              <Route
                path="/monespace/services"
                render={props => <Admin bodyComponent={<Services />} />}
              />
              <Route
                path="/monespace/categories"
                render={props => <Admin bodyComponent={<Categories />} />}
              />
              <Route
                path="/monespace/profile"
                render={props => <Admin bodyComponent={<PersonaProfile />} />}
              />
              <Route
                path="/monespace/gestionpermissions/:personaId"
                render={props => (
                  <Admin
                    bodyComponent={
                      <PersonaPermissions
                        {...props}
                        personaId={props.match.params.personaId}
                      />
                    }
                  />
                )}
              />
            </Switch>
          </div>
        </Router>
      </MuiPickersUtilsProvider>
    );
  }
}

export default App;
