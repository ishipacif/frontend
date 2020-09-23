import wretch from "wretch";
const auth_params = JSON.parse(localStorage.getItem("auth_params"));
class PlanningData {
  getProfessionalPlannings() {
    return wretch(process.env.REACT_APP_API_URL + "/plannings/professional")
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
      process.env.REACT_APP_API_URL +
        "/plannings/getprofessionals/" +
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
    return wretch(process.env.REACT_APP_API_URL + "/plannings/customer")
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
    return wretch(process.env.REACT_APP_API_URL + "Reservations/search")
      .auth(`Bearer ${auth_params.accessToken}`)
      .post({
        customerId: auth_params.currentUser.id
      })
      .json();
  }

  getStatusById(id) {
    return wretch(process.env.REACT_APP_API_URL + "/statuses/" + id)
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
      return wretch(process.env.REACT_APP_API_URL + "/plannings/" + id)
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
    return wretch(process.env.REACT_APP_API_URL + "/plannings/" + params.id)
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
    return wretch(
      process.env.REACT_APP_API_URL + "Reservations/" + id + "/cancel"
    )
      .auth(`Bearer ${auth_params.accessToken}`)
      .get()
      .res();
  }

  createUpdatePlanning(params) {
    if (params.id === undefined || params.id === "") {
      return wretch(process.env.REACT_APP_API_URL + "Reservations")
        .auth(`Bearer ${auth_params.accessToken}`)
        .json(params)
        .post()
        .res()
        .catch(error => error);
    } else {
      return wretch(process.env.REACT_APP_API_URL + "Reservations" + params.id)
        .auth(`Bearer ${auth_params.accessToken}`)
        .json(params)
        .put()
        .res()
        .catch(error => error);
    }
  }
}
export default new PlanningData();
