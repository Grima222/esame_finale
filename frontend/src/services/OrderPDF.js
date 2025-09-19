import { jsPDF } from 'jspdf';

export const generateOrderPDF = (username, items, quantities) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(`Ricevuta ordine - Utente: ${username}`, 10, 10);

  let y = 20;
  let total = 0;

  items.forEach(item => {
    const qty = quantities[item.id] || 0;
    if (qty > 0) {
      const lineTotal = qty * (item.price || 0);
      total += lineTotal;
      doc.text(`${item.name} x ${qty} = €${lineTotal.toFixed(2)}`, 10, y);
      y += 10;
    }
  });

  doc.text(`Totale: €${total.toFixed(2)}`, 10, y + 10);
  doc.save(`ricevuta_${username}.pdf`);
};
