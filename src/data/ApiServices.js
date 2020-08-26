import wretch from "wretch";
class ApiServices {
  sendEmail(params) {
    return wretch("http://homecleaners.azurewebsites.net/api/contact/send_mail")
      .json(params)
      .post()
      .json();
  }
}
export default new ApiServices();
