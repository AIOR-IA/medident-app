
import { variable64 } from "../../../assets/img";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export type ProductPDF = {
  name: string;
  price: number;
  quantity: number;
  total: number;
};

const generatePDF = (
  products: ProductPDF[],
  fecha: string,
) => {

  const tableBody = [
    [
      { text: "Nombre", style: "tableHeader" },
      { text: "Cantidad", style: "tableHeader" },
      { text: "Precio", style: "tableHeader" },
      { text: "Total", style: "tableHeader" },
    ],
    ...products.map((product) => [
      product.name,
      product.quantity.toString(),
      product.price.toString(),
      `${product.total}`,
    ]),
  ];

  const totalGeneral = products.reduce((sum, product) => sum + product.total, 0);

  const content: any[] = [];

  content.push({
    columns: [
      { image: variable64.myVar, width: 100 },
      {
        stack: [
          { text: `- PRESUPUESTO -`, style: "header" },
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
      widths: ["*","*","*","*"],
      body: tableBody,
      alignment: "center",
    },
    layout: "lightHorizontalLines",
    margin: [0, 10, 0, 10],
  });


  content.push({
    columns: [
      { text: "", width: "*" },
      {
        text: `Total: ${totalGeneral}Bs.`,
        style: "total",
        alignment: "right",
        margin: [0, 10, 0, 10],
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

export default generatePDF;
