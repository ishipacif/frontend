import wretch from "wretch";
const auth_params = JSON.parse(localStorage.getItem("auth_params"));
class ServicesData {
  // Services
  getServices() {
    return wretch(process.env.REACT_APP_API_URL + "/Services")
      .get()
      .json();
  }

  getService(id) {
    return wretch(process.env.REACT_APP_API_URL + "/services/" + id)
      .get()
      .json();
  }

  deleteService(id) {
    return wretch(process.env.REACT_APP_API_URL + "/services/" + id)
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
      return wretch(process.env.REACT_APP_API_URL + "/services")
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
      return wretch(process.env.REACT_APP_API_URL + "/services/" + params.id)
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
    return wretch(process.env.REACT_APP_API_URL + "/categories")
      .get()
      .json();
  }

  getServicesCategory(category) {
    return wretch(
      process.env.REACT_APP_API_URL + "/Services?category=" + category
    )
      .get()
      .json();
  }

  getServicesByCategory(category) {
    return wretch(
      process.env.REACT_APP_API_URL + "/Services?category=" + category
    )
      .get()
      .json();
  }

  deleteServicesCategory(id) {
    return wretch(process.env.REACT_APP_API_URL + "/categories/" + id)
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
      return wretch(process.env.REACT_APP_API_URL + "/categories")
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
      return wretch(process.env.REACT_APP_API_URL + "/categories/" + params.id)
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
