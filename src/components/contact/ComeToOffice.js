import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const styles = {
  media: {
    height: 160
  }
};

function ComeToOffice(props) {
  const { classes } = props;
  return (
    <Card>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image="house_cleaning_bureau.png"
          title="Photo de nos bureau à Bruxelles"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Passez à nos bureaux
          </Typography>
          <Typography component="p">
            Avenue Cleaning, 101
            <br />
            10XX
            <br />
            La Ville
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

ComeToOffice.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ComeToOffice);
