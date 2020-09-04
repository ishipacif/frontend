import wretch from "wretch";
const auth_params = JSON.parse(localStorage.getItem("auth_params"));
class PersonaTypes {
  getPersonaTypes() {
    return wretch(process.env.REACT_APP_API_URL + "/types")
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
      process.env.REACT_APP_API_URL + "/types/confirmed_personas_types"
    )
      .get()
      .json();
  }

  getPersonaType(id) {
    return wretch(process.env.REACT_APP_API_URL + "/types/" + id)
      .get()
      .json();
  }

  createUpdatePersonaType(params) {
    if (params.id === undefined || params.id === "") {
      return wretch(process.env.REACT_APP_API_URL + "/types")
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
      return wretch(process.env.REACT_APP_API_URL + "/types/" + params.id)
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
