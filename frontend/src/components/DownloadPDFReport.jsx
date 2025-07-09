import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function toSentenceCase(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const DownloadPDFReport = ({ results, drawType, drawNumber }) => {
  const drawLabel = toSentenceCase(drawType) || "PILGRIMAGE";

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    const logo = new Image();
    logo.src = "/ogdcl_logo_hd.png";

    const winners = results
      .filter((r) => r.status === "winner")
      .sort((a, b) => a.position - b.position);

    const waiting = results
      .filter((r) => r.status === "waiting")
      .sort((a, b) => a.position - b.position);

    logo.onload = () => {
      const addHeader = () => {
        doc.addImage(logo, "PNG", 10, 5, 25, 25);
        doc.setFontSize(14);
        doc.text("Oil & Gas Development Company Limited", 105, 15, {
          align: "center",
        });
        doc.setFontSize(12);
        doc.text(`${drawLabel} Draw No. ${drawNumber} (For the Year 2025-2026)`, 105, 22, { align: "center" });
        doc.text("List of Selected Employees", 105, 28, { align: "center" });

        doc.setFontSize(10);
        doc.setFont(undefined, "italic");
        doc.setTextColor(100);
        doc.text(
          `Dated: ${new Date().toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })}`,
          105,
          33,
          { align: "center" }
        );
        doc.setFont(undefined, "normal");
        doc.setTextColor(0);
      };

      const tableBody = [];

      winners.forEach((item) => {
        tableBody.push([
          item.position,
          item.number,
          item.name,
          item.designation,
          item.department,
          item.location,
        ]);
      });

      if (waiting.length > 0) {
        tableBody.push([{ isSectionBreak: true, label: "*** Waiting List ***" }]);

        waiting.forEach((item) => {
          tableBody.push([
            item.position,
            item.number,
            item.name,
            item.designation,
            item.department,
            item.location,
          ]);
        });
      }

      autoTable(doc, {
        startY: 50,
        margin: { top: 50 },
        head: [
          [
            "Sr. No.",
            "Emp. No",
            "Name",
            "Designation",
            "Department",
            "Location",
          ],
        ],
        body: tableBody,
        styles: { fontSize: 9, cellPadding: 2, textColor: 0, lineColor: 0 },
        headStyles: {
          fillColor: [230, 230, 230],
          textColor: 0,
          lineColor: 0,
          align: "left",
        },
        bodyStyles: { valign: "middle" },
        didParseCell: (data) => {
          const row = data.row.raw;
          if (Array.isArray(row) && row[0]?.isSectionBreak) {
            data.cell.colSpan = 6;
            data.cell.text = row[0].label;
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.halign = "center";
            data.cell.styles.fillColor = [230, 230, 230];
          }
        },
        didDrawPage: () => {
          addHeader();
        },
      });

      const totalPages = doc.internal.getNumberOfPages();

      // Apply footer and signature block after table rendering
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(9);
        doc.text(`${drawLabel} Draw No. ${drawNumber} - Held on ${today}`, 20, pageHeight - 15);
        doc.text(`Page ${i} of ${totalPages}`, 180, pageHeight - 15);

        // Signature block only on last page
        if (i === totalPages) {
          const finalY = doc.lastAutoTable.finalY + 30;

          doc.setFontSize(10);

          doc.text("________________", 20, finalY);
          doc.text("ED (HR)", 25, finalY + 5);

          doc.text("________________", 60, finalY);
          doc.text("GM (HR)", 65, finalY + 5);

          doc.text("________________", 110, finalY);
          doc.text("Manager (Policy)", 115, finalY + 5);

          doc.text("________________", 150, finalY);
          doc.text("GS (CBA)", 160, finalY + 5);

          doc.text("__________________", 85, finalY + 25);
          doc.text("MD/CEO", 95, finalY + 30);
        }
      }

      doc.save(`${drawLabel}_Draw_No_${drawNumber}_Final_Draw_Report.pdf`);
    };
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-green-700 text-white font-semibold px-6 py-2 rounded shadow-md mb-6 hover:cursor-pointer hover:bg-green-800 transition-colors duration-300 print:hidden"
    >
      📄 Download Final Draw Report
    </button>
  );
};

export default DownloadPDFReport;
