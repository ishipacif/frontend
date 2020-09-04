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
    return wretch(process.env.REACT_APP_API_URL + "/statuses")
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
    return wretch(process.env.REACT_APP_API_URL + "/plannings/" + id)
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
      return wretch(process.env.REACT_APP_API_URL + "/plannings")
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
        process.env.REACT_APP_API_URL + "/plannings/" + params.planning[0].id
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
