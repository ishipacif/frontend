import wretch from "wretch";
const auth_params = JSON.parse(localStorage.getItem("auth_params"));
class PersonasData {
  isErrorsEmpty(obj) {
    for (let key in obj) {
      //if the value is 'object'
      if (obj[key] instanceof Object === true) {
        if (this.isErrorsEmpty(obj[key]) === false) return false;
      }
      //if value is string/number
      else {
        //if array or string have length is not 0.
        if (obj[key].length !== 0) return false;
      }
    }
    return true;
  }

  getPersona(type, id) {
    return wretch(
      process.env.REACT_APP_API_URL +
        (type === "customer" ? "Customers/" + id : "Professionals/" + id)
    )
      .auth(`Bearer ${auth_params.accessToken}`)
      .get()
      .json()
      .catch(error => error);
  }

  getPersonas(type) {
    return wretch(
      process.env.REACT_APP_API_URL +
        (type === "customers" ? "Customers" : "Professionals")
    )
      .auth(`Bearer ${auth_params.accessToken}`)
      .get()
      .json();
  }

  getProfessionalExpertises(id) {
    return wretch(
      process.env.REACT_APP_API_URL + "Professionals/" + id + "/expertises"
    )
      .get()
      .json()
      .catch(error => error);
  }

  setProfessionalExpertise(params) {
    return wretch(
      process.env.REACT_APP_API_URL +
        "Professionals/" +
        params.professionalId +
        "/expertises"
    )
      .auth(`Bearer ${auth_params.accessToken}`)
      .json(params)
      .post()
      .json()
      .catch(error => error);
  }

  getProfessionals() {
    return wretch(process.env.REACT_APP_API_URL + "Professionals")
      .get()
      .json();
  }

  getProfessionalsIds() {
    return wretch(process.env.REACT_APP_API_URL + "/professionals")
      .get()
      .json();
  }

  getAvailableProfessionals(params) {
    return wretch(process.env.REACT_APP_API_URL + "Professionals/available")
      .json(params)
      .post()
      .json();
  }

  createUpdateCustomer(params) {
    if (params.customer.id === undefined || params.customer.id === "") {
      return wretch(process.env.REACT_APP_API_URL + "Customers/")
        .json(params)
        .post()
        .res()
        .catch(error => error);
    } else {
      return wretch(
        process.env.REACT_APP_API_URL + "Customers/" + params.customer.id
      )
        .auth(`Bearer ${auth_params.accessToken}`)
        .json(params.customer)
        .put()
        .res()
        .catch(error => error);
    }
  }

  createUpdateProfessional(params) {
    if (params.professional.id === undefined || params.professional.id === "") {
      return wretch(process.env.REACT_APP_API_URL + "Professionals/")
        .json(params)
        .post()
        .res()
        .catch(error => error);
    } else {
      return wretch(
        process.env.REACT_APP_API_URL +
          "Professionals/" +
          params.professional.id
      )
        .auth(`Bearer ${auth_params.accessToken}`)
        .json(params.professional)
        .put()
        .res()
        .catch(error => error);
    }
  }

  // createUpdatePersonaPermissions(params) {
  //   console.log(params);
  //   return wretch(process.env.REACT_APP_API_URL + "/permissions/set_access/")
  //     .headers({
  //       "access-token": auth_params.accessToken,
  //       "token-type": auth_params.tokenType,
  //       client: auth_params.client,
  //       expiry: auth_params.expiry,
  //       uid: auth_params.uid
  //     })
  //     .json(params)
  //     .post()
  //     .res();
  // }

  authenticatePersona(params) {
    return wretch(process.env.REACT_APP_API_URL + "Auth/login/")
      .formData(params)
      .post()
      .json()
      .catch(error => error);
  }

  disconnectPersona() {
    // return wretch(process.env.REACT_APP_API_URL + "/personas/sign_out")
    //   .headers({
    //     "access-token": auth_params.accessToken,
    //     "token-type": auth_params.tokenType,
    //     client: auth_params.client,
    //     expiry: auth_params.expiry,
    //     uid: auth_params.uid
    //   })
    //   .delete()
    //   .json();
  }

  isAuthenticated() {
    // return wretch(process.env.REACT_APP_API_URL + "/personas/me")
    //   .headers({
    //     "access-token": auth_params.accessToken,
    //     "token-type": auth_params.tokenType,
    //     client: auth_params.client,
    //     expiry: auth_params.expiry,
    //     uid: auth_params.uid
    //   })
    //   .post()
    //   .json();
  }
}
export default new PersonasData();
