import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function toSentenceCase(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const DownloadPDFReport = ({ results, drawType, drawNumber, buttonLabel, className = "bg-green-700 text-white font-semibold px-6 py-2 rounded shadow-md mb-6 hover:cursor-pointer hover:bg-green-800 transition-colors duration-300 print:hidden" }) => {
  const drawLabel = toSentenceCase(drawType) || "PILGRIMAGE";

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  const getEmployeeValue = (item, key) => {
    const employee = item.employee || item.Employee || {};
    return employee[key] ?? item[key] ?? "";
  };

  const getEmployeeNumber = (item) => {
    const employee = item.employee || item.Employee || {};
    return employee.employee_number || employee.employeeNumber || item.number || "";
  };

  const truncateText = (text, maxLength = 26) => {
    const value = String(text ?? "");
    if (value.length <= maxLength) return value;
    return `${value.slice(0, maxLength - 1).trimEnd()}…`;
  };

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
      let logoWidth = 40;
      let logoHeight = (logo.height / logo.width) * logoWidth;

      const addHeader = () => {
        doc.addImage(logo, "PNG", 15, 10, logoWidth, logoHeight);
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
          getEmployeeValue(item, "position") || item.position,
          getEmployeeNumber(item),
          getEmployeeValue(item, "name"),
          truncateText(getEmployeeValue(item, "designation"), 24),
          truncateText(getEmployeeValue(item, "department"), 24),
          truncateText(getEmployeeValue(item, "location"), 24),
        ]);
      });

      if (waiting.length > 0) {
        tableBody.push([{ isSectionBreak: true, label: "*** Waiting List ***" }]);

        waiting.forEach((item) => {
          tableBody.push([
            getEmployeeValue(item, "position") || item.position,
            getEmployeeNumber(item),
            getEmployeeValue(item, "name"),
            truncateText(getEmployeeValue(item, "designation"), 24),
            truncateText(getEmployeeValue(item, "department"), 24),
            truncateText(getEmployeeValue(item, "location"), 24),
          ]);
        });
      }

      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const signatureBlockHeight = 5;
      const footerMargin = 15;
      const reservedBottom = signatureBlockHeight + footerMargin + 15;

      autoTable(doc, {
        startY: 40,
        margin: { top: 50, bottom: reservedBottom },
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
        styles: {
          fontSize: 9,
          cellPadding: 2,
          textColor: 0,
          lineColor: 0,
          overflow: "ellipsize",
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 22 },
          2: { cellWidth: 40 },
          3: { cellWidth: 35 },
          4: { cellWidth: 35 },
          5: { cellWidth: 35 },
        },
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

      const pageCountBeforeSignatures = doc.internal.getNumberOfPages();
      const lastTableY = doc.lastAutoTable?.finalY || 0;
      let signaturePage = pageCountBeforeSignatures;
      let signatureStartY = lastTableY + 20;
      const maxFooterY = pageHeight - footerMargin;

      if (signatureStartY + signatureBlockHeight > maxFooterY) {
        doc.addPage();
        signaturePage = doc.internal.getNumberOfPages();
        signatureStartY = 25;
      }

      const totalPages = doc.internal.getNumberOfPages();

      const addFooter = (pageNumber) => {
        doc.setFontSize(9);
        doc.text(`${drawLabel} Draw No. ${drawNumber} - Held on ${today}`, 20, pageHeight - footerMargin);
        doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 30, pageHeight - footerMargin, {
          align: "right",
        });
      };

      const addSignatures = (y) => {
        doc.setFontSize(10);

        doc.text("________________", 20, y);
        doc.text("ED (HR)", 25, y + 5);

        doc.text("________________", 60, y);
        doc.text("GM (HR)", 65, y + 5);

        doc.text("________________", 110, y);
        doc.text("Manager (Policy)", 115, y + 5);

        doc.text("________________", 150, y);
        doc.text("GS (CBA)", 160, y + 5);

        doc.text("__________________", 85, y + 25);
        doc.text("MD/CEO", 95, y + 30);
      };

      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addFooter(i);
      }

      doc.setPage(signaturePage);
      addSignatures(signatureStartY);

      doc.save(`${drawLabel}_Draw_No_${drawNumber}_Final_Draw_Report.pdf`);
    };
  };

  return (
    <button
      onClick={generatePDF}
      className={`${className} print:hidden`}
    >
      {buttonLabel || `📄 Download ${drawLabel} Draw Report`}
    </button>
  );
};

export default DownloadPDFReport;
