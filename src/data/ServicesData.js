import wretch from "wretch";
const auth_params = JSON.parse(localStorage.getItem("auth_params"));
class ServicesData {
  // Services
  getServices() {
    return wretch("http://homecleaners.azurewebsites.net/api/services")
      .get()
      .json();
  }

  getService(id) {
    return wretch("http://homecleaners.azurewebsites.net/api/services/" + id)
      .get()
      .json();
  }

  deleteService(id) {
    return wretch("http://homecleaners.azurewebsites.net/api/services/" + id)
      .headers({
        "access-token": auth_params.accessToken,
        "token-type": auth_params.tokenType,
        client: auth_params.client,
        expiry: auth_params.expiry,
        uid: auth_params.uid
      })
      .delete()
      .res();
  }

  createUpdateService(params) {
    if (params.id === undefined || params.id === "") {
      return wretch("http://homecleaners.azurewebsites.net/api/services")
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
        "http://homecleaners.azurewebsites.net/api/services/" + params.id
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

  // Categories
  getCategories() {
    return wretch("http://homecleaners.azurewebsites.net/api/categories")
      .get()
      .json();
  }

  getServicesCategory(id) {
    return wretch(
      "http://homecleaners.azurewebsites.net/api/Category/GetCategory/" + id
    )
      .get()
      .json();
  }

  getServicesByCategory(id) {
    return wretch(
      "http://homecleaners.azurewebsites.net/api/Service/GetServicesByCategory/" +
        id
    )
      .get()
      .json();
  }

  deleteServicesCategory(id) {
    return wretch("http://homecleaners.azurewebsites.net/api/categories/" + id)
      .headers({
        "access-token": auth_params.accessToken,
        "token-type": auth_params.tokenType,
        client: auth_params.client,
        expiry: auth_params.expiry,
        uid: auth_params.uid
      })
      .delete()
      .res();
  }

  createUpdateCategories(params) {
    if (params.id === undefined || params.id === "") {
      return wretch("http://homecleaners.azurewebsites.net/api/categories")
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
        "http://homecleaners.azurewebsites.net/api/categories/" + params.id
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
export default new ServicesData();
