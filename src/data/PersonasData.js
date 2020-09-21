import wretch from "wretch";
const auth_params = JSON.parse(localStorage.getItem("auth_params"));
class PersonasData {
  getPersona(id) {
    return wretch(process.env.REACT_APP_API_URL + "/personas/" + id)
      .headers({
        "access-token": auth_params.accessToken,
        "token-type": auth_params.tokenType,
        client: auth_params.client,
        expiry: auth_params.expiry,
        uid: auth_params.uid
      })
      .get()
      .json();
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
      .json();
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
      .json();
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
    return (
      wretch(process.env.REACT_APP_API_URL + "Professionals/available")
        // .headers({
        //   "access-token": auth_params.accessToken,
        //   "token-type": auth_params.tokenType,
        //   client: auth_params.client,
        //   expiry: auth_params.expiry,
        //   uid: auth_params.uid
        // })
        .json(params)
        .post()
        .json()
    );
  }

  createUpdateCustomer(params) {
    if (params.id === undefined || params.id === "") {
      return wretch(process.env.REACT_APP_API_URL + "/Customers/")
        .json(params)
        .post()
        .res();
    } else {
      return wretch(process.env.REACT_APP_API_URL + "/Customers/" + params.id)
        .headers({
          "access-token": auth_params.accessToken,
          "token-type": auth_params.tokenType,
          client: auth_params.client,
          expiry: auth_params.expiry,
          uid: auth_params.uid
        })
        .json(params)
        .put()
        .res();
    }
  }

  createUpdateProfessional(params) {
    if (params.id === undefined || params.id === "") {
      return wretch(process.env.REACT_APP_API_URL + "/Professionals/")
        .json(params)
        .post()
        .res();
    } else {
      return wretch(
        process.env.REACT_APP_API_URL + "/Professionals/" + params.id
      )
        .headers({
          "access-token": auth_params.accessToken,
          "token-type": auth_params.tokenType,
          client: auth_params.client,
          expiry: auth_params.expiry,
          uid: auth_params.uid
        })
        .json(params)
        .put()
        .res();
    }
  }

  createUpdatePersonaPermissions(params) {
    console.log(params);
    return wretch(process.env.REACT_APP_API_URL + "/permissions/set_access/")
      .headers({
        "access-token": auth_params.accessToken,
        "token-type": auth_params.tokenType,
        client: auth_params.client,
        expiry: auth_params.expiry,
        uid: auth_params.uid
      })
      .json(params)
      .post()
      .res();
  }

  authenticatePersona(params) {
    return wretch(process.env.REACT_APP_API_URL + "Auth/login/")
      .formData(params)
      .post()
      .json()
      .catch(error => error);
  }

  disconnectPersona() {
    return wretch(process.env.REACT_APP_API_URL + "/personas/sign_out")
      .headers({
        "access-token": auth_params.accessToken,
        "token-type": auth_params.tokenType,
        client: auth_params.client,
        expiry: auth_params.expiry,
        uid: auth_params.uid
      })
      .delete()
      .json();
  }

  isAuthenticated() {
    return wretch(process.env.REACT_APP_API_URL + "/personas/me")
      .headers({
        "access-token": auth_params.accessToken,
        "token-type": auth_params.tokenType,
        client: auth_params.client,
        expiry: auth_params.expiry,
        uid: auth_params.uid
      })
      .post()
      .json();
  }
}
export default new PersonasData();
