"use client";

import { InvoiceListItem } from "@/lib/types";
import {
  Document,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { Button } from "../shadcnui/button";

type InvoicePdfProp = {
  invoice: InvoiceListItem;
  currentBusiness:
    | {
        address: string;
        name: string;
        id: string;
        contactInformation: string;
        userId: string;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      }
    | null
    | undefined;
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInvoiceNumber = (uuid: string) => {
  return `INV-${uuid.replace(/-/g, "").substring(0, 8).toUpperCase()}`;
};

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "✓ PAID";

    case "pending":
      return "○ PENDING";

    case "overdue":
      return "! OVERDUE";

    case "cancelled":
      return "✕ CANCELLED";

    case "draft":
      return "DRAFT";

    default:
      return status.toUpperCase();
  }
};

const calculateInvoice = (invoice: InvoiceListItem) => {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;

  invoice.invoiceItems.forEach((item) => {
    const itemSubtotal = item.price * item.quantity;

    subtotal += itemSubtotal;

    totalDiscount += (itemSubtotal * item.discount) / 100;

    const taxableAmount = itemSubtotal - (itemSubtotal * item.discount) / 100;

    totalTax += (taxableAmount * item.taxRate) / 100;
  });

  const grandTotal = subtotal - totalDiscount + totalTax;

  return {
    subtotal,
    totalDiscount,
    totalTax,
    grandTotal,
  };
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    paddingTop: 42,
    paddingBottom: 55,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111111",
    lineHeight: 1.5,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },

  companySection: {
    width: "58%",
  },

  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 0.4,
  },

  companyText: {
    color: "#555",
    lineHeight: 1.6,
  },

  invoiceSection: {
    width: "42%",
    alignItems: "flex-end",
  },

  invoiceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    letterSpacing: 1,
  },

  invoiceNumber: {
    fontSize: 11,
    marginBottom: 10,
  },

  statusBadge: {
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 9,
    fontWeight: "bold",
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    marginBottom: 28,
  },

  topInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  billTo: {
    width: "50%",
    paddingRight: 20,
  },

  invoiceInfo: {
    width: "42%",
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 0.5,
  },

  clientName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },

  muted: {
    color: "#666",
    lineHeight: 1.6,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ECECEC",
  },

  infoLabel: {
    color: "#666",
  },

  infoValue: {
    fontWeight: "bold",
    textAlign: "right",
    maxWidth: "60%",
  },

  table: {
    width: "100%",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderBottomWidth: 0,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#D8D8D8",
    paddingVertical: 9,
    paddingHorizontal: 10,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  itemColumn: {
    width: "32%",
    fontWeight: "bold",
  },

  qtyColumn: {
    width: "10%",
    textAlign: "center",
  },

  priceColumn: {
    width: "16%",
    textAlign: "right",
  },

  discountColumn: {
    width: "14%",
    textAlign: "right",
  },

  taxColumn: {
    width: "12%",
    textAlign: "right",
  },

  totalColumn: {
    width: "16%",
    textAlign: "right",
    fontWeight: "bold",
  },

  summaryWrapper: {
    marginTop: 28,
    alignItems: "flex-end",
  },

  summaryCard: {
    width: 260,
    borderWidth: 1,
    borderColor: "#D8D8D8",
    padding: 14,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  summaryLabel: {
    color: "#555",
  },

  summaryValue: {
    fontWeight: "bold",
  },

  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#111",
    paddingTop: 12,
    marginTop: 8,
  },

  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },

  grandTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },

  thankYou: {
    marginTop: 42,
  },

  thankTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },

  thankText: {
    color: "#666",
    lineHeight: 1.7,
  },

  footer: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#D8D8D8",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#666",
  },
});

const MyDoc = ({ invoice, currentBusiness }: InvoicePdfProp) => {
  const { subtotal, totalDiscount, totalTax, grandTotal } =
    calculateInvoice(invoice);

  const invoiceNumber = getInvoiceNumber(invoice.id);

  return (
    <Document>
      <Page
        size="A4"
        wrap
        style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companySection}>
            <Text style={styles.companyName}>
              {currentBusiness?.name ?? "RocketInvoice"}
            </Text>

            <Text style={styles.companyText}>
              {currentBusiness?.address ?? "Business Address"}
            </Text>

            <Text style={styles.companyText}>
              {currentBusiness?.contactInformation ??
                "contact@rocketinvoice.com"}
            </Text>
          </View>

          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>

            <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>

            <Text style={styles.statusBadge}>
              {getStatusLabel(invoice.status)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.topInfo}>
          <View style={styles.billTo}>
            <Text style={styles.sectionTitle}>BILL TO</Text>

            <Text style={styles.clientName}>{invoice.clientName}</Text>

            <Text style={styles.muted}>{invoice.clientAddress}</Text>

            <Text style={styles.muted}>{invoice.clientContactInformation}</Text>
          </View>

          <View style={styles.invoiceInfo}>
            <Text style={styles.sectionTitle}>INVOICE DETAILS</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Invoice No.</Text>

              <Text style={styles.infoValue}>{invoiceNumber}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Invoice Date</Text>

              <Text style={styles.infoValue}>
                {formatDate(invoice.invoiceDate)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created</Text>

              <Text style={styles.infoValue}>
                {formatDate(invoice.createdAt)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Method</Text>

              <Text style={styles.infoValue}>
                {capitalize(invoice.paymentMethod)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>

              <Text style={styles.infoValue}>{capitalize(invoice.status)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.table}>
          <View
            fixed
            style={styles.tableHeader}>
            <Text style={styles.itemColumn}>Item</Text>

            <Text style={styles.qtyColumn}>Qty</Text>

            <Text style={styles.priceColumn}>Unit</Text>

            <Text style={styles.discountColumn}>Discount</Text>

            <Text style={styles.taxColumn}>Tax</Text>

            <Text style={styles.totalColumn}>Total</Text>
          </View>

          {invoice.invoiceItems.map((item) => (
            <View
              key={item.id}
              wrap={false}
              style={styles.tableRow}>
              <Text style={styles.itemColumn}>{item.name}</Text>

              <Text style={styles.qtyColumn}>{item.quantity}</Text>

              <Text style={styles.priceColumn}>{item.price}</Text>

              <Text style={styles.discountColumn}>{item.discount}%</Text>

              <Text style={styles.taxColumn}>{item.taxRate}%</Text>

              <Text style={styles.totalColumn}>{item.lineTotal}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryWrapper}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>

              <Text style={styles.summaryValue}>{subtotal}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>

              <Text style={styles.summaryValue}>- {totalDiscount}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>

              <Text style={styles.summaryValue}>+ {totalTax}</Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>

              <Text style={styles.grandTotalValue}>{grandTotal}</Text>
            </View>
          </View>
        </View>

        <View style={styles.thankYou}>
          <Text style={styles.thankTitle}>Thank you for your business.</Text>

          <Text style={styles.thankText}>
            We sincerely appreciate your trust in{" "}
            {currentBusiness?.name ?? "our business"}.
          </Text>

          <Text style={styles.thankText}>
            If you have any questions regarding this invoice, please contact us
            using the information below.
          </Text>

          <Text style={styles.thankText}>
            {currentBusiness?.contactInformation ?? "support@rocketinvoice.com"}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const InvoicePdf = ({ invoice, currentBusiness }: InvoicePdfProp) => {
  const handleDownload = async () => {
    try {
      const blob = await pdf(
        <MyDoc
          invoice={invoice}
          currentBusiness={currentBusiness}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${getInvoiceNumber(invoice.id)}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate invoice PDF:", error);
    }
  };

  return <Button onClick={handleDownload}>Download PDF</Button>;
};
