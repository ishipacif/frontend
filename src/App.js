import React, { Component } from "react";
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
import Services from "./components/admin/services/Services";
import Categories from "./components/admin/categories/Categories";

import Admin from "./shared/Admin";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/" render={props => <Home />} />
            <Route path="/signup" render={props => <Signup {...props} />} />
            <Route
              path="/commandes"
              render={props => <Commande {...props} />}
            />
            <Route
              path="/category/:categoryId"
              render={props => (
                <CategoryServices categoryId={props.match.params.categoryId} />
              )}
            />
            <Route path="/contact" render={props => <Contact />} />
            <Route
              path="/ajoutercommande/:planningId"
              render={props => <OrderFrm {...props} />}
            />
            <Route path="/login" render={props => <Login {...props} />} />
            <Route
              exact
              path="/admin"
              render={props => (
                <Admin {...props} bodyComponent={<Dashboard />} />
              )}
            />
            <Route
              path="/admin/personas"
              render={props => <Admin bodyComponent={<Personas />} />}
            />
            <Route
              path="/admin/personatypes/add"
              render={props => (
                <Admin bodyComponent={<TypesFrm {...props} />} />
              )}
            />
            <Route
              path="/admin/personatypes/edit/:personaTypeId"
              render={props => (
                <Admin bodyComponent={<TypesFrm {...props} />} />
              )}
            />
            <Route
              path="/admin/services"
              render={props => <Admin bodyComponent={<Services />} />}
            />
            <Route
              path="/admin/categories"
              render={props => <Admin bodyComponent={<Categories />} />}
            />
            <Route
              path="/admin/profile"
              render={props => <Admin bodyComponent={<PersonaProfile />} />}
            />
            <Route
              path="/admin/gestionpermissions/:personaId"
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
    );
  }
}

export default App;
