import ServicesData from "../data/ServicesData";
import PersonasData from "../data/PersonasData";
import PlanningData from "../data/PlanningData";

class OrderFrmProps {
  async getCategories() {
    const rawCategories = await ServicesData.getCategories();

    const categories = rawCategories.map(function(category) {
      return {
        id: category.id,
        name: category.name,
        count: category.services.length
      };
    });

    return categories;
  }

  async getServices(customerId, planningId) {
    const rawServices = await ServicesData.getServices();
    const rawProfessionalsIds = await PersonasData.getProfessionalsIds();

    let proposalServices = [];
    let planningServices = [];
    let services = [];
    rawServices.forEach(function(service) {
      services.push({
        id: service.id,
        name: service.name,
        commission: service.percentage_commission,
        category_id: service.category_id
      });

      proposalServices.push({
        service_id: service.id,
        price: ""
      });

      rawProfessionalsIds.forEach(function(professional) {
        if (customerId === undefined) {
          planningServices.push({
            professional_id: professional.id,
            service_id: service.id,
            date: null,
            start_hour: null,
            end_hour: null,
            status_id: 1
          });
        } else {
          planningServices.push({
            professional_id: professional.id,
            customer_id: customerId,
            service_id: service.id,
            date: null,
            start_hour: null,
            end_hour: null,
            status_id: 1
          });
        }
      });
    });

    return {
      services: services,
      proposalServices: proposalServices,
      planningServices: planningServices
    };
  }

  async getProfessionals(planningId) {
    let serviceListCollapse = [];

    const professionalPersonas =
      planningId === "0" || planningId === undefined
        ? await PersonasData.getProfessionals()
        : [await PlanningData.getProfessionalsByPlanning(planningId)];
    // debugger;
    professionalPersonas.forEach(professionalPersona => {
      serviceListCollapse['"' + professionalPersona.id + '"'] = [];
      professionalPersona.expertises.forEach(expertise => {
        serviceListCollapse['"' + professionalPersona.id + '"'][
          '"' + expertise.serviceId + '"'
        ] = planningId === "0" ? false : true;
      });
    });

    return {
      professionalPersonas: professionalPersonas,
      serviceListCollapse: serviceListCollapse
    };
  }
}
export default new OrderFrmProps();
