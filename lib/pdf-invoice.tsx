import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Define types
export interface InvoiceItem {
  id: number;
  name: string;
  vendor: string;
  price: number;
  qty: number;
  total: number;
  image?: string;
}

export interface InvoiceData {
  orderId: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
  },
  // Header Section
  header: {
    marginBottom: 30,
    borderBottom: "2 solid #10b981",
    paddingBottom: 20,
  },
  companyName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#10b981",
    marginBottom: 5,
  },
  companyTagline: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 10,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 10,
  },
  // Info Section
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  infoBox: {
    width: "48%",
  },
  infoLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 11,
    color: "#1f2937",
    marginBottom: 3,
  },
  infoBold: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 3,
  },
  orderIdBox: {
    backgroundColor: "#f0fdf4",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#10b981",
  },
  // Table Section
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 10,
    fontWeight: "bold",
    borderBottom: "1 solid #d1d5db",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottom: "1 solid #e5e7eb",
  },
  tableColItem: {
    width: "40%",
  },
  tableColVendor: {
    width: "20%",
  },
  tableColQty: {
    width: "10%",
    textAlign: "center",
  },
  tableColPrice: {
    width: "15%",
    textAlign: "right",
  },
  tableColTotal: {
    width: "15%",
    textAlign: "right",
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
  },
  tableText: {
    fontSize: 10,
    color: "#1f2937",
  },
  tableTextSmall: {
    fontSize: 9,
    color: "#6b7280",
  },
  // Summary Section
  summarySection: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryBox: {
    width: "40%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 11,
    color: "#1f2937",
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 8,
    borderTop: "2 solid #d1d5db",
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
  },
  // Footer Section
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: "1 solid #e5e7eb",
  },
  footerText: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 5,
  },
  footerBold: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
  },
  // Additional Sections
  noteSection: {
    marginTop: 20,
    backgroundColor: "#fef3c7",
    padding: 12,
    borderRadius: 4,
  },
  noteTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 5,
  },
  noteText: {
    fontSize: 9,
    color: "#78350f",
    lineHeight: 1.4,
  },
  deliverySection: {
    marginTop: 20,
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 4,
  },
  deliveryTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#166534",
    marginBottom: 5,
  },
  deliveryText: {
    fontSize: 10,
    color: "#14532d",
  },
});

// Invoice Document Component
export const InvoiceDocument = ({ data }: { data: InvoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.companyName}>🌾 AgriMart</Text>
        <Text style={styles.companyTagline}>
          Quality Agricultural Products for Modern Farmers
        </Text>
        <Text style={styles.invoiceTitle}>INVOICE</Text>
      </View>

      {/* Order Info and Customer Info */}
      <View style={styles.infoSection}>
        {/* Left: Order Details */}
        <View style={styles.infoBox}>
          <View style={styles.orderIdBox}>
            <Text style={styles.infoLabel}>ORDER ID</Text>
            <Text style={styles.orderId}>{data.orderId}</Text>
          </View>
          <Text style={styles.infoLabel}>ORDER DATE</Text>
          <Text style={styles.infoBold}>{data.orderDate}</Text>
          <Text style={styles.infoLabel}>PAYMENT METHOD</Text>
          <Text style={styles.infoText}>
            {data.paymentMethod === "card"
              ? "Credit/Debit Card"
              : data.paymentMethod === "upi"
              ? "UPI"
              : "Net Banking"}
          </Text>
        </View>

        {/* Right: Customer Details */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>BILL TO</Text>
          <Text style={styles.infoBold}>{data.customerName}</Text>
          <Text style={styles.infoText}>{data.customerEmail}</Text>
          <Text style={styles.infoText}>{data.customerPhone}</Text>
          <Text style={styles.infoLabel}>SHIPPING ADDRESS</Text>
          <Text style={styles.infoText}>{data.shippingAddress.street}</Text>
          <Text style={styles.infoText}>
            {data.shippingAddress.city}, {data.shippingAddress.state}
          </Text>
          <Text style={styles.infoText}>
            {data.shippingAddress.postalCode}
          </Text>
        </View>
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={styles.tableColItem}>
            <Text style={styles.tableHeaderText}>Product</Text>
          </View>
          <View style={styles.tableColVendor}>
            <Text style={styles.tableHeaderText}>Vendor</Text>
          </View>
          <View style={styles.tableColQty}>
            <Text style={styles.tableHeaderText}>Qty</Text>
          </View>
          <View style={styles.tableColPrice}>
            <Text style={styles.tableHeaderText}>Price</Text>
          </View>
          <View style={styles.tableColTotal}>
            <Text style={styles.tableHeaderText}>Total</Text>
          </View>
        </View>

        {/* Table Rows */}
        {data.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={styles.tableColItem}>
              <Text style={styles.tableText}>{item.name}</Text>
            </View>
            <View style={styles.tableColVendor}>
              <Text style={styles.tableTextSmall}>{item.vendor}</Text>
            </View>
            <View style={styles.tableColQty}>
              <Text style={styles.tableText}>{item.qty}</Text>
            </View>
            <View style={styles.tableColPrice}>
              <Text style={styles.tableText}>Rs {item.price}</Text>
            </View>
            <View style={styles.tableColTotal}>
              <Text style={styles.tableText}>Rs {item.total}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Summary Section */}
      <View style={styles.summarySection}>
        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>Rs {data.subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping:</Text>
            <Text style={styles.summaryValue}>
              {data.shipping === 0 ? "FREE" : `Rs ${data.shipping}`}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (5%):</Text>
            <Text style={styles.summaryValue}>Rs {data.tax}</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>TOTAL:</Text>
            <Text style={styles.summaryTotalValue}>Rs {data.total}</Text>
          </View>
        </View>
      </View>

      {/* Delivery Info */}
      <View style={styles.deliverySection}>
        <Text style={styles.deliveryTitle}>📦 Estimated Delivery</Text>
        <Text style={styles.deliveryText}>
          Your order will be delivered tomorrow by 5 PM
        </Text>
      </View>

      {/* Note Section */}
      <View style={styles.noteSection}>
        <Text style={styles.noteTitle}>⚠️ Important Note</Text>
        <Text style={styles.noteText}>
          Please keep this invoice for your records. For any queries or support,
          contact us at support@agrimart.com or call +91-1800-123-4567.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerBold}>Thank you for your business!</Text>
        <Text style={styles.footerText}>
          AgriMart - Empowering Farmers with Quality Products
        </Text>
        <Text style={styles.footerText}>
          www.agrimart.com | support@agrimart.com | +91-1800-123-4567
        </Text>
      </View>
    </Page>
  </Document>
);

// Helper function to generate invoice data from checkout
export const generateInvoiceData = (
  orderId: string,
  formData: any,
  cartItems: InvoiceItem[],
  subtotal: number,
  shipping: number,
  tax: number,
  total: number
): InvoiceData => {
  return {
    orderId,
    orderDate: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    customerName: formData.fullName,
    customerEmail: formData.email,
    customerPhone: formData.phone,
    shippingAddress: {
      street: formData.address,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
    },
    items: cartItems,
    subtotal,
    shipping,
    tax,
    total,
    paymentMethod: formData.paymentMethod,
  };
};
