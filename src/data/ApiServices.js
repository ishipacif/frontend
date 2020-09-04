import wretch from "wretch";
class ApiServices {
  sendEmail(params) {
    return wretch(process.env.REACT_APP_API_URL + "/contact/send_mail")
      .json(params)
      .post()
      .json();
  }
}
export default new ApiServices();
