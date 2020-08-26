import wretch from "wretch";
const auth_params = JSON.parse(localStorage.getItem("auth_params"));
class PersonasData {
  getPersona(id) {
    return wretch("http://homecleaners.azurewebsites.net/api/personas/" + id)
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

  getPersonas() {
    return wretch("http://homecleaners.azurewebsites.net/api/personas")
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

  getProfessionals() {
    return wretch(
      "http://homecleaners.azurewebsites.net/api/Professional/GetProfessionnals"
    )
      .get()
      .json();
  }

  getProfessionalsIds() {
    return wretch("http://homecleaners.azurewebsites.net/api/professionals")
      .get()
      .json();
  }

  createUpdateCustomer(params) {
    if (params.id === undefined || params.id === "") {
      return wretch(
        "http://homecleaners.azurewebsites.net/api/Account/CreateCustomer/"
      )
        .json(params)
        .post()
        .res();
    } else {
      return wretch(
        "http://homecleaners.azurewebsites.net/api/personas/" + params.id
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

  createUpdateProfessional(params) {
    if (params.id === undefined || params.id === "") {
      return wretch(
        "http://homecleaners.azurewebsites.net/api/Account/CreateProfessional/"
      )
        .json(params)
        .post()
        .res();
    } else {
      return wretch(
        "http://homecleaners.azurewebsites.net/api/personas/" + params.id
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
    return wretch(
      "http://homecleaners.azurewebsites.net/api/permissions/set_access/"
    )
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
    return wretch("http://homecleaners.azurewebsites.net/api/personas/sign_in/")
      .json(params)
      .post()
      .res()
      .catch(error => error);
  }

  disconnectPersona() {
    return wretch("http://homecleaners.azurewebsites.net/api/personas/sign_out")
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
    return wretch("http://homecleaners.azurewebsites.net/api/personas/me")
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
