import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

import { Field } from "formik";
import { TextField } from "formik-material-ui";
import { Select } from "material-ui-formik-components";

import Dropzone from "react-dropzone";
import request from "superagent";

const CLOUDINARY_UPLOAD_PRESET = "housecleaning";
const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dq0vmmeik/image/upload";

class PersonaInfoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedPicture: null,
      isUploadingPicture: false
    };
  }

  onImageDrop(files) {
    this.setState({
      isUploadingPicture: true
    });
    let upload = request
      .post(CLOUDINARY_UPLOAD_URL)
      .field("upload_preset", CLOUDINARY_UPLOAD_PRESET)
      .field("file", files[0]);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== "") {
        this.setState({
          uploadedPicture: response.body.secure_url,
          isUploadingPicture: false
        });
      }
      this.props.changePicFn(this.state.uploadedPicture);
    });
  }

  render() {
    const { values } = this.props;
    return (
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Identification
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <Field
              id="persona.accountType"
              name="persona.accountType"
              label="Type de compte"
              autoFocus
              required
              fullWidth
              options={[
                { label: "Client", value: "customer" },
                { label: "Professionnel", value: "professional" }
              ]}
              component={Select}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Grid item xs={12}>
              <Field
                id="persona.firstName"
                name="persona.firstName"
                label="Prénom"
                required
                fullWidth
                value={values.persona.firstName}
                component={TextField}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="persona.lastName"
                name="persona.lastName"
                label="Nom"
                required
                fullWidth
                value={values.persona.lastName}
                component={TextField}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Field
              name="persona.picture"
              value={
                this.state.uploadedPicture === null
                  ? values.persona.picture
                  : this.state.uploadedPicture
              }
              render={({ field, form }) => (
                <input
                  {...field}
                  value=""
                  type="hidden"
                  onChange={e => {
                    form.setFieldValue(
                      "picture",
                      this.state.uploadedPicture === null
                        ? values.persona.picture
                        : this.state.uploadedPicture
                    );
                  }}
                />
              )}
            />

            <Dropzone
              onDrop={this.onImageDrop.bind(this)}
              accept="image/*"
              multiple={false}
            >
              {({ getRootProps, getInputProps }) => {
                return (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {
                      <center>
                        {(values.persona.picture !== null ||
                          this.state.uploadedPicture !== null) && (
                          <div>
                            <img
                              width="100%"
                              src={
                                this.state.uploadedPicture === null
                                  ? values.persona.picture
                                  : this.state.uploadedPicture
                              }
                              alt={
                                values.persona.firstName +
                                " " +
                                values.persona.lastName
                              }
                            />
                          </div>
                        )}
                        {this.state.isUploadingPicture && <LinearProgress />}
                        <Typography variant="caption" gutterBottom>
                          Inserer votre photo
                        </Typography>
                      </center>
                    }
                  </div>
                );
              }}
            </Dropzone>
          </Grid>

          <Grid item xs={9}>
            <Field
              id="persona.address.streetName"
              name="persona.address.streetName"
              label="Nom de la rue"
              required
              fullWidth
              value={values.persona.address.streetName}
              component={TextField}
            />
          </Grid>
          <Grid item xs={3}>
            <Field
              id="persona.address.plotNumber"
              name="persona.address.plotNumber"
              label="Numéro"
              required
              fullWidth
              value={values.persona.address.plotNumber}
              component={TextField}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Field
              id="persona.address.city"
              name="persona.address.city"
              label="Ville"
              required
              fullWidth
              value={values.persona.address.city}
              component={TextField}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Field
              id="persona.address.postalCode"
              name="persona.address.postalCode"
              label="Code postal"
              required
              fullWidth
              type="number"
              value={values.persona.address.postalCode}
              component={TextField}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <Field
              id="persona.email"
              name="persona.email"
              label="Courriel"
              required
              fullWidth
              value={values.persona.email}
              component={TextField}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Field
              id="persona.phoneNumber"
              name="persona.phoneNumber"
              label="Numero de téléphone"
              required
              fullWidth
              value={values.persona.phoneNumber}
              component={TextField}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field
              id="password"
              name="password"
              label="Mot de passe"
              type="password"
              required
              fullWidth
              value={""}
              component={TextField}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Field
              id="passwordComfirm"
              name="passwordComfirm"
              label="Confirmation de mot de passe"
              type="password"
              required
              fullWidth
              value={""}
              component={TextField}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default PersonaInfoForm;
