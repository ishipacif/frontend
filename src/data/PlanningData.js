import wretch from "wretch";
const auth_params = JSON.parse(localStorage.getItem("auth_params"));
class PlanningData {
  getProfessionalPlannings() {
    return wretch(
      "http://homecleaners.azurewebsites.net/api/plannings/professional"
    )
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

  getProfessionalsByPlanning(planningId) {
    return wretch(
      "http://homecleaners.azurewebsites.net/api/plannings/getprofessionals/" +
        planningId
    )
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

  getCustomerPlannings() {
    return wretch(
      "http://homecleaners.azurewebsites.net/api/plannings/customer"
    )
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

  getStatus() {
    return wretch("http://homecleaners.azurewebsites.net/api/statuses")
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

  getStatusById(id) {
    return wretch("http://homecleaners.azurewebsites.net/api/statuses/" + id)
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

  getPlanningById(id) {
    if (id !== "0") {
      return wretch("http://homecleaners.azurewebsites.net/api/plannings/" + id)
        .headers({
          "access-token": auth_params.accessToken,
          "token-type": auth_params.tokenType,
          client: auth_params.client,
          expiry: auth_params.expiry,
          uid: auth_params.uid
        })
        .get()
        .json();
    } else {
      return [];
    }
  }

  updateStatus(params) {
    return wretch(
      "http://homecleaners.azurewebsites.net/api/plannings/" + params.id
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

  deletePlanning(id) {
    return wretch("http://homecleaners.azurewebsites.net/api/plannings/" + id)
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

  createUpdatePlanning(params) {
    if (params.planning[0].id === undefined || params.planning[0].id === "") {
      return wretch("http://homecleaners.azurewebsites.net/api/plannings")
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
        "http://homecleaners.azurewebsites.net/api/plannings/" +
          params.planning[0].id
      )
        .headers({
          "access-token": auth_params.accessToken,
          "token-type": auth_params.tokenType,
          client: auth_params.client,
          expiry: auth_params.expiry,
          uid: auth_params.uid
        })
        .json(params.planning[0])
        .put()
        .res();
    }
  }
}
export default new PlanningData();
