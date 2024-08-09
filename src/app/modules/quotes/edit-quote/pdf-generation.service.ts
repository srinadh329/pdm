import { Injectable } from '@angular/core';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';

declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class PdfGenerationService {
  public clonequoteItems: any;
  public td: any;
  constructor() { }


  pdfGeneration() {

    $('#hide-from-pdf').hide();
    $('#hide-from-pdf1').hide();
    var doc = new jsPDF('l');
    (doc as any).autoTable({
      columnStyles: { 0: { fontStyle: 'bold', fontSize: '11' } }, // Cells in first column centered and green
      body: [
        ['Quote Information']
      ],
    });
    (doc as any).autoTable({
      html: '#userInfoTable',
      bodyStyles: { minCellHeight: 8 },
      theme: 'grid',
      styles: { lineWidth: 0 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { fontStyle: 'bold', fontSize: 11 }
      },
      didDrawCell: function (data) {
        if (data.column.index === 1 && data.cell.section === 'body') {
          //  var td = data.cell.raw;
          //  var img = td.getElementsByTagName('img')[0];
          //  var dim = data.cell.height - data.cell.padding('vertical');
          //  var textPos = data.cell.textPos;
          //  doc.addImage(img.src, textPos.x,  textPos.y, dim, dim);
        }
      }
    });
    doc.addPage();

    (doc as any).autoTable({
      columnStyles: { 0: { fontStyle: 'bold', fontSize: '11' } }, // Cells in first column centered and green
      body: [
        ['Quote Information']
      ],
    });
 
    (doc as any).autoTable({
      html: '#printImage',
      bodyStyles: { minCellHeight: 80, minCellWidth: 40,maxCellWidth:'25%' },
      theme: 'plain',
      showHead: 'firstPage',
      styles: { valign: 'middle' },
      headStyles: { fillColor: '#f2f2f2', textColor: '#000', fontStyle: 'bold', lineWidth: 0.5, lineColor: '#ccc' },
      didDrawCell: async  (data) =>{
        if (data.cell.section === 'body') {
          let td = data.cell.raw;
          if (td) {
            let img = td.firstElementChild;
            data.cell.textPos = null;
            
            if (img?.src) {
               doc.addImage(img.src, data.cell.x + 1, data.cell.y + 1, 40, 30);
            }
          }
        }
      },
    });

    doc.addPage();
    
    (doc as any).autoTable({
      columnStyles: { 0: { fontStyle: 'bold', fontSize: '11' } }, // Cells in first column centered and green
      body: [
        ['Summary']
      ],
    });

    (doc as any).autoTable({
      html: '#mainTable',
      bodyStyles: { minCellHeight: 10 },
      theme: 'grid',
      showHead: 'firstPage',
      styles: { valign: 'middle' },
      // pageBreak: 'avoid',
      // rowPageBreak: false,
      columnStyles: {
        0: { halign: 'right', fontStyle: 'bold' },
        2: { cellWidth: 22, minCellHeight: 20 },
        13: { cellWidth: 25, minCellHeight: 20 },
      },
      headStyles: { fillColor: '#f2f2f2', textColor: '#000', fontStyle: 'bold', lineWidth: 0.5, lineColor: '#ccc' },
      didDrawCell: function (data) {
        let index = data.table.body.length;
        if (data.row.index = index) {
          delete data.table.body[index]
        }

        data.table.body.forEach((element:any,index:number)=>{
          if(element?.raw?.['id']== 'hide-from-pdf1'){
              delete data.table.body[index];
          }
        })
        if (data.column.index === 2 && data.cell.section === 'body') {
          let td = data.cell.raw;
          let img = td.getElementsByTagName('img')[0];
          if (img?.src && img?.src) {
            doc?.addImage(img?.src, data.cell.x + 1, data.cell.y + 1, 19, 19);
          }
        }
      }
    });
    doc.setTextColor(255, 0, 0);

    doc.save('quote' + '.pdf');
    $('#hide-from-pdf').show();
    $('#hide-from-pdf1').show();
  }

}
