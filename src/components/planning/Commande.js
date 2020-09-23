import React, { Component } from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
// import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import MaterialTable from "material-table";

import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import "moment-timezone";
import "moment/locale/fr";

import PlanningData from "../../data/PlanningData";
import OrderFrmProps from "../../shared/OrderFrmProps";

import jsPDF from "jspdf";
import "jspdf-autotable";

const styles = theme => ({
  affected: {
    textAlign: "right"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 900,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  heroContent: {
    margin: "0 auto",
    padding: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 6}px`
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  paperRoot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  inline: {
    display: "inline"
  }
});

class Commande extends Component {
  constructor(props) {
    super(props);
    const auth_params = JSON.parse(localStorage.getItem("auth_params"));

    this.state = {
      professionalList: [],
      statuses: [],
      isAuthenticated: auth_params ? auth_params.isAuthenticated : false,

      snackBarOpen:
        props.location !== undefined &&
        props.location.state !== undefined &&
        props.location.state.snackBarOpen !== undefined
          ? props.location.state.snackBarOpen
          : false,
      snackBarContent:
        props.location !== undefined &&
        props.location.state !== undefined &&
        props.location.state.snackBarContent !== undefined
          ? props.location.state.snackBarContent
          : ""
    };

    this.getStatus("customerId");
  }

  async deleteReservation(id) {
    const rawStatus = await PlanningData.deletePlanning(id);
    if (rawStatus !== undefined && rawStatus.status === 200) {
      this.getStatus("customerId");
    }
    this.setState({
      snackBarOpen: true,
      snackBarContent: "Reservation annulée"
    });
  }

  makeInvoice(reservationId) {
    const reservation = this.state.rawStatus.find(
      reserv => reserv.id === reservationId
    );

    const professional = this.state.professionalList.find(
      prof => prof.id === reservation.expertise.professionalId
    );

    const invoiceName =
      professional.firstName +
      "_" +
      professional.lastName +
      "_" +
      reservation.startTime +
      ".pdf";

    const invoiceDoc = new jsPDF();
    const pageSize = invoiceDoc.internal.pageSize;
    const horizontalPos = pageSize.width / 2; //Page center position
    const verticalPos = pageSize.height - 6; //Page number position

    invoiceDoc.setFontSize(14);
    invoiceDoc.text("FACTURE", horizontalPos, 22, {
      align: "center"
    });
    invoiceDoc.setFontSize(12);
    invoiceDoc.text(
      professional.firstName + " " + professional.lastName,
      25,
      35
    );
    invoiceDoc.setFontSize(10);
    invoiceDoc.text(professional.email, 25, 40);
    invoiceDoc.text(professional.phoneNumber, 25, 45);

    invoiceDoc.text("DATE: " + reservation.startTime.substring(0, 10), 160, 35);

    invoiceDoc.text("Facturée à: ", 100, 55);
    invoiceDoc.setFontSize(12);
    invoiceDoc.text(
      reservation.customer.firstName + " " + reservation.customer.lastName,
      100,
      60
    );

    invoiceDoc.setFontSize(10);
    invoiceDoc.text(
      reservation.customer.address.streetName +
        " " +
        reservation.customer.address.plotNumber,
      100,
      65
    );
    invoiceDoc.text(
      reservation.customer.address.postalCode +
        " " +
        reservation.customer.address.city,
      100,
      70
    );
    invoiceDoc.text(reservation.customer.email, 100, 75);
    invoiceDoc.text(reservation.customer.phoneNumber, 100, 80);

    const headers = {
      id: "No",
      service: "Service",
      hours: "Heude de début et de fin",
      hourlyRate: "Prix par Heure",
      totalCost: "Total"
    };

    const body = [
      {
        id: "1",
        service: reservation.expertise.service.title,
        hours:
          reservation.startTime.substring(
            reservation.startTime.length - 8,
            reservation.startTime.length - 3
          ) +
          " - " +
          reservation.endTime.substring(
            reservation.startTime.length - 8,
            reservation.startTime.length - 3
          ),
        hourlyRate: reservation.expertise.hourlyRate,
        totalCost: reservation.totalCost
      },
      {
        id: {
          content: "TOTAL",
          colSpan: 4,
          styles: { fontStyle: "bold", halign: "center" }
        },
        totalCost: {
          content: reservation.totalCost,
          styles: { fontStyle: "bold", halign: "right" }
        }
      }
    ];

    invoiceDoc.autoTable({
      head: [headers],
      body: body,
      startY: 100,
      columnStyles: {
        id: { halign: "center", cellWidth: 9 },
        hours: { halign: "center", cellWidth: 45 },
        hourlyRate: { halign: "right", cellWidth: 30 },
        totalCost: { halign: "right", cellWidth: 25 }
      }
    });

    const totalPages = invoiceDoc.internal.getNumberOfPages();

    for (let j = 1; j < totalPages + 1; j++) {
      invoiceDoc.setPage(j);
      invoiceDoc.text(`${j} of ${totalPages}`, horizontalPos, verticalPos, {
        align: "center"
      });
    }

    return invoiceDoc.save(invoiceName);
  }

  async getStatus(personaType) {
    const professionalList = await OrderFrmProps.getProfessionals();
    // const services = await ServicesData.getServices();
    const rawStatus = await PlanningData.getStatus(personaType);
    if (rawStatus !== undefined && professionalList !== undefined) {
      const status = rawStatus.map(rawStat => {
        const persona = professionalList.professionalPersonas.find(
          prof => prof.id === rawStat.expertise.professionalId
        );

        return {
          id: rawStat.id,
          date: (
            <Moment format="DD/MMM/YYYY" locale="fr">
              {rawStat.startTime}
            </Moment>
          ),
          heures: (
            <div>
              <Moment format="HH:mm" locale="fr">
                {rawStat.startTime}
              </Moment>
              {" -> "}
              <Moment format="HH:mm" locale="fr">
                {rawStat.endTime}
              </Moment>
            </div>
          ),
          persona: (
            <div>
              {persona.firstName + " " + persona.lastName}
              <div>
                <Typography
                  color="textSecondary"
                  variant="caption"
                  component="i"
                >
                  {
                    persona.expertises.find(
                      exp => exp.serviceId === rawStat.expertise.serviceId
                    ).service.title
                  }
                </Typography>
              </div>
            </div>
          ),
          billed:
            rawStat.billingId !== undefined && rawStat.billingId !== null
              ? true
              : false,
          status:
            rawStat.billingId !== undefined && rawStat.billingId !== null
              ? "Facturée"
              : rawStat.status,
          cancel: rawStat.status
        };
      });
      this.setState({
        statuses: status,
        professionalList: professionalList.professionalPersonas,
        rawStatus: rawStatus
      });
    }
  }

  render() {
    const classes = this.props.classes;

    if (this.state.isAuthenticated !== true) {
      return (
        <Redirect
          push
          to={{
            pathname: "/login",
            state: {
              snackBarOpen: true,
              snackBarContent:
                "Vous devez vous connecter. Si vous n'avez pas de compte, vous devrez vous incrire."
            }
          }}
        />
      );
    }

    return (
      <React.Fragment>
        <CssBaseline />

        <main className={classes.layout}>
          <div className={classes.heroContent}>
            <React.Fragment>
              <Typography
                component="h1"
                variant="h4"
                align="left"
                color="textPrimary"
                gutterBottom
              >
                Mes commandes
              </Typography>
              <Grid
                container
                spacing={24}
                direction="row"
                justify="flex-end"
                alignItems="baseline"
              >
                <Grid item>
                  <Button
                    component={Link}
                    to={"/ajoutercommande/0"}
                    variant="outlined"
                    size="large"
                    color="primary"
                  >
                    Nouvelle commande
                  </Button>
                </Grid>
              </Grid>
              <br />
              <MaterialTable
                data={this.state.statuses}
                columns={[
                  {
                    title: "Date",
                    field: "date"
                  },
                  {
                    title: "Heures",
                    field: "heures"
                  },
                  {
                    title: "Professionel et service",
                    field: "persona"
                  },
                  {
                    title: "Status",
                    field: "status"
                  }
                ]}
                actions={[
                  {
                    icon: "delete",
                    tooltip: "Annuler",
                    onClick: (event, rowData) => {
                      if (rowData.billed) {
                        alert(
                          "Vous ne pouvez pas supprimer une résérvation facturée"
                        );
                      } else {
                        this.deleteReservation(rowData.id);
                      }
                    }
                  },
                  {
                    icon: "picture_as_pdf",
                    tooltip: "Imprimer Facture",
                    onClick: (event, rowData) => {
                      if (rowData.billed) {
                        this.makeInvoice(rowData.id);
                      } else {
                        alert(
                          "Vous ne pouvez pas imprimer une facture pour une résérvation non facturée ou réjetée"
                        );
                      }
                    }
                  }
                ]}
                localization={{
                  actions: ""
                }}
                options={{
                  columnsButton: false,
                  filtering: false,
                  toolbar: false,
                  pageSize: 10
                }}
              />
            </React.Fragment>
          </div>
          {
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={this.state.snackBarOpen}
              autoHideDuration={6000}
              message={
                <span id="message-id">{this.state.snackBarContent}</span>
              }
            />
          }
        </main>
      </React.Fragment>
    );
  }
}

Commande.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Commande);
