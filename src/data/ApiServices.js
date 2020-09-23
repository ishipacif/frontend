import wretch from "wretch";
class ApiServices {
  sendEmail(params) {
    return wretch(process.env.REACT_APP_API_URL + "Mails")
      .json(params)
      .post()
      .json()
      .catch(error => error);
  }
}
export default new ApiServices();
