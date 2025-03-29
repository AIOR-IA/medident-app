
import { variable64 } from "../../../assets/img";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export type ReportPayPDF = {
  budget: string;
  onAccount: number;
  debt: number;
};

const generateBuyTreatmentPDF = (
  report: ReportPayPDF,
  fecha: string,
  detail: string,
) => {

  const tableBody = [
    [
      { text: "Total Presupuesto", style: "tableHeader" },
      { text: "A Cuenta", style: "tableHeader" },
      { text: "Deuda", style: "tableHeader" },
    ],
     [
      report.budget,
      report.onAccount,
      report.debt,
    ],
  ];

  const content: any[] = [];

  content.push({
    columns: [
      { image: variable64.myVar, width: 100 },
      {
        stack: [
          { text: `- RECIBO PAGO -`, style: "header" },
          { text: `${detail}`, style: "subheader" 	},
          { text: `Fecha: ${fecha}`, style: "subheader" },
        ],
        alignment: "right",
      },
    ],
  });


  content.push({
    qr: 'https://www.medidentsalud.com/',
    fit: 120,
    alignment: "right",
    margin: [0, 10, 0, 10],
  });


  content.push({ text: "\n" });


  content.push({
    table: {
      headerRows: 1,
      widths: ["*","*","*"],
      body: tableBody,
      alignment: "center",
    },
    layout: "lightHorizontalLines",
    margin: [0, 10, 0, 10],
  });


  content.push({
    columns: [
      {
        text: "Firma Paciente.",
        style: "total",
        alignment: "left",  // Alineado a la izquierda
        margin: [100, 200, 0, 10],
      },
      {
        text: "Firma Doctor.",
        style: "total",
        alignment: "right", // Alineado a la derecha
        margin: [0, 200, 100, 10],
      },
    ],
  });
  // content.push({
  //   columns: [
  //     { text: "Paciente", width: "*" },
  //     {
  //       text: `Total: Pepito Perez Tapia.`,
  //       style: "total",
  //       alignment: "right",
  //       margin: [0, 10, 0, 10],
  //     },
  //   ],
  // });

  const styles = {
    header: {
      fontSize: 14,
      bold: true,
    },
    subheader: {
      fontSize: 12,
      margin: [0, 5, 0, 5],
    },
    tableHeader: {
      bold: true,
      fontSize: 12,
      color: "black",
    },
    total: {
      fontSize: 12,
      bold: true,
    },
  };


  const docDefinition: any = {
    content,
    styles,
  };

  pdfMake.createPdf(docDefinition).open();
};

export default generateBuyTreatmentPDF;
