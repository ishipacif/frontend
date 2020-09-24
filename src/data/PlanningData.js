import wretch from "wretch";
const auth_params = JSON.parse(localStorage.getItem("auth_params"));
class PlanningData {
  createFacture(customerId) {
    return wretch(
      process.env.REACT_APP_API_URL + "Billing/" + customerId + "/createBill"
    )
      .auth(`Bearer ${auth_params.accessToken}`)
      .get()
      .json()
      .catch(error => error);
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

  // getCustomerPlannings() {
  //   return wretch(process.env.REACT_APP_API_URL + "/plannings/customer")
  //     .headers({
  //       "access-token": auth_params.accessToken,
  //       "token-type": auth_params.tokenType,
  //       client: auth_params.client,
  //       expiry: auth_params.expiry,
  //       uid: auth_params.uid
  //     })
  //     .get()
  //     .json();
  // }

  getStatus(personaType) {
    const param = {};

    if (personaType !== "" && personaType !== undefined) {
      param[personaType] = auth_params.currentUser.person.id;
    }

    return wretch(process.env.REACT_APP_API_URL + "Reservations/search")
      .auth(`Bearer ${auth_params.accessToken}`)
      .post(param)
      .json();
  }

  // getStatusById(id) {
  //   return wretch(process.env.REACT_APP_API_URL + "/statuses/" + id)
  //     .headers({
  //       "access-token": auth_params.accessToken,
  //       "token-type": auth_params.tokenType,
  //       client: auth_params.client,
  //       expiry: auth_params.expiry,
  //       uid: auth_params.uid
  //     })
  //     .get()
  //     .json();
  // }

  // getPlanningById(id) {
  //   if (id !== "0") {
  //     return wretch(process.env.REACT_APP_API_URL + "/plannings/" + id)
  //       .headers({
  //         "access-token": auth_params.accessToken,
  //         "token-type": auth_params.tokenType,
  //         client: auth_params.client,
  //         expiry: auth_params.expiry,
  //         uid: auth_params.uid
  //       })
  //       .get()
  //       .json();
  //   } else {
  //     return [];
  //   }
  // }

  getConfimedReservations() {
    return wretch(process.env.REACT_APP_API_URL + "Reservations/search/")
      .auth(`Bearer ${auth_params.accessToken}`)
      .json({
        status: "Confirmed"
      })
      .post()
      .json()
      .catch(error => error);
  }

  deletePlanning(id) {
    return wretch(
      process.env.REACT_APP_API_URL + "Reservations/" + id + "/cancel"
    )
      .auth(`Bearer ${auth_params.accessToken}`)
      .get()
      .res()
      .catch(error => error);
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
