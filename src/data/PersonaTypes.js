import wretch from "wretch";
const auth_params = JSON.parse(localStorage.getItem("auth_params"));
class PersonaTypes {
  getPersonaTypes() {
    return wretch("http://homecleaners.azurewebsites.net/api/types")
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

  getPersonaTypesForFront() {
    return wretch(
      "http://homecleaners.azurewebsites.net/api/types/confirmed_personas_types"
    )
      .get()
      .json();
  }

  getPersonaType(id) {
    return wretch("http://homecleaners.azurewebsites.net/api/types/" + id)
      .get()
      .json();
  }

  createUpdatePersonaType(params) {
    if (params.id === undefined || params.id === "") {
      return wretch("http://homecleaners.azurewebsites.net/api/types")
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
    } else {
      return wretch(
        "http://homecleaners.azurewebsites.net/api/types/" + params.id
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
}
export default new PersonaTypes();
