import wretch from "wretch";
const auth_params = JSON.parse(localStorage.getItem("auth_params"));
class ServicesData {
  // Services
  async getServices() {
    let exterieur = [];
    let interieur = [];
    let allServices = [];

    interieur = await wretch(
      process.env.REACT_APP_API_URL + "Services?category=Interieur"
    )
      .get()
      .json();

    if (interieur.length > 0) {
      exterieur = await wretch(
        process.env.REACT_APP_API_URL + "Services?category=Exterieur"
      )
        .get()
        .json();

      if (exterieur.length > 0) {
        allServices = exterieur.concat(interieur);
      }
    }
    return allServices;
  }

  async getService(id) {
    return await wretch(process.env.REACT_APP_API_URL + "Services/" + id)
      .get()
      .json();
  }

  async deleteService(id) {
    return await wretch(process.env.REACT_APP_API_URL + "Services/" + id)
      .auth(`Bearer ${auth_params.accessToken}`)
      .delete()
      .res();
  }

  createUpdateService(params) {
    if (params.id === undefined || params.id === 0) {
      return wretch(process.env.REACT_APP_API_URL + "Services")
        .auth(`Bearer ${auth_params.accessToken}`)
        .json(params)
        .post()
        .res();
    } else {
      return wretch(process.env.REACT_APP_API_URL + "Services/" + params.id)
        .auth(`Bearer ${auth_params.accessToken}`)
        .json(params)
        .put()
        .res();
    }
  }

  getServicesCategory(category) {
    return wretch(
      process.env.REACT_APP_API_URL + "Services?category=" + category
    )
      .get()
      .json();
  }

  getServicesByCategory(category) {
    return wretch(
      process.env.REACT_APP_API_URL + "Services?category=" + category
    )
      .get()
      .json();
  }
}
export default new ServicesData();
