import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Field } from "formik";
import { TextField } from "formik-material-ui";

function LoginInfoForm(props) {
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        Information de connexion
      </Typography>
      <Grid container spacing={24}>
        {props.values.id !== "" && props.values.id !== undefined ? (
          <Grid item xs={12} md={12}>
            <Field
              id="current_password"
              name="current_password"
              label="Mot de passe actuel"
              type="password"
              autoFocus
              required
              fullWidth
              value={""}
              component={TextField}
            />
          </Grid>
        ) : (
          ""
        )}
        <Grid item xs={12} md={12}>
          <Field
            id="password"
            name="password"
            label="Mot de passe"
            type="password"
            autoFocus
            required
            fullWidth
            value={""}
            component={TextField}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Field
            id="password_confirmation"
            name="password_confirmation"
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

export default LoginInfoForm;
