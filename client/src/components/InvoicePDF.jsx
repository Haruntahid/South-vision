// components/invoice/InvoicePDF.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import NotoSansBengaliRegular from "../assets/fonts/NotoSansBengali-Regular.ttf";
import NotoSansBengaliBold from "../assets/fonts/NotoSansBengali-Bold.ttf";

// ✅ Use TTF instead of WOFF2 (react-pdf doesn't support woff2)
Font.register({
  family: "NotoBengali",
  fonts: [
    { src: NotoSansBengaliRegular, fontWeight: "normal" },
    { src: NotoSansBengaliBold, fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 16,
    fontFamily: "NotoBengali",
    fontSize: 10,
    lineHeight: 1.4,
  },
  headerWrap: {
    borderWidth: 1,
    borderColor: "#999",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  brandRow: { alignItems: "center", textAlign: "center" },
  brandName: { fontSize: 14, fontWeight: "bold" },
  brandSub: { fontSize: 9, marginTop: 2 },
  brandMeta: { fontSize: 8, marginTop: 2 },
  cashMemo: {
    marginTop: 4,
    fontSize: 11,
    paddingVertical: 2,
    textAlign: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },

  infoWrap: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  infoCell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#eee",
  },
  infoCellWide: {
    flex: 2,
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#eee",
  },
  infoLabel: { fontSize: 9, color: "#666" },
  infoValue: { fontSize: 10, marginTop: 1 },

  table: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    overflow: "hidden",
  },
  tr: { flexDirection: "row" },
  th: {
    fontWeight: "bold",
    backgroundColor: "#f2f2f2",
    borderRightWidth: 1,
    borderColor: "#ddd",
    padding: 6,
    textAlign: "center",
  },
  td: {
    padding: 6,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: "#eee",
    fontSize: 10,
  },
  colSl: { width: 28 },
  colName: { flex: 1 },
  colRate: { width: 70, textAlign: "right" },

  summaryWrap: {
    marginTop: 8,
    flexDirection: "row",
    gap: 8,
  },
  totalsBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 4,
    padding: 6,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 4,
  },
  grandTotal: { fontWeight: "bold", fontSize: 11 },

  signRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signBox: {
    width: "45%",
    borderTopWidth: 1,
    borderColor: "#999",
    paddingTop: 4,
    textAlign: "center",
    fontSize: 9,
  },
});

// Money formatter (৳)
const tk = (n) =>
  `৳${Number(n || 0)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

const InvoicePDF = ({
  clinic = {
    nameEn: "SOUTH VISION DIAGNOSTIC CENTER",
    nameBn: "সাউথ ভিশন ডায়াগনস্টিক সেন্টার",
    address: "উন্নততর স্বাস্থ্য সেবার লক্ষ্যে, হিজলা, বরিশাল",
    phones: ["01913-856578", "01720-871032"],
    refText: "Bismillahir Rahmanir Rahim",
  },
  patient = { name: "", age: "", gender: "", phone: "", refdBy: "" },
  meta = { invoiceNumber: "", date: new Date() },
  tests = [], // [{name, price}]
  totals = { total: 0, discount: 0, grandTotal: 0 },
}) => {
  return (
    <Document>
      {/* A5 size like a cash memo */}
      <Page size="A5" style={styles.page}>
        {/* Header */}
        <View style={styles.headerWrap}>
          <View style={styles.brandRow}>
            {clinic.logo ? (
              <Image
                src={clinic.logo}
                style={{ width: 40, height: 40, marginBottom: 4 }}
              />
            ) : null}
            <Text style={{ fontSize: 8, marginBottom: 2 }}>
              {clinic.refText}
            </Text>
            <Text style={styles.brandName}>{clinic.nameEn}</Text>
            <Text style={styles.brandSub}>{clinic.nameBn}</Text>
            <Text style={styles.brandMeta}>
              {clinic.address} · {clinic.phones.join(" / ")}
            </Text>
          </View>
          <Text style={styles.cashMemo}>Cash Memo</Text>
        </View>

        {/* Patient info */}
        <View style={styles.infoWrap}>
          <View style={styles.infoRow}>
            <View style={styles.infoCellWide}>
              <Text style={styles.infoLabel}>Patient Name</Text>
              <Text style={styles.infoValue}>{patient.name || "-"}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{patient.age || "-"}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{patient.gender || "-"}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoCellWide}>
              <Text style={styles.infoLabel}>Referred by Dr.</Text>
              <Text style={styles.infoValue}>{patient.refdBy || "-"}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{patient.phone || "-"}</Text>
            </View>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {meta?.date ? new Date(meta.date).toLocaleDateString() : "-"}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoCell}>
              <Text style={styles.infoLabel}>Memo No.</Text>
              <Text style={styles.infoValue}>{meta?.invoiceNumber || "-"}</Text>
            </View>
            <View style={{ ...styles.infoCell, borderRightWidth: 0 }}>
              <Text style={styles.infoLabel}>—</Text>
              <Text style={styles.infoValue}> </Text>
            </View>
          </View>
        </View>

        {/* Tests table */}
        <View style={styles.table}>
          <View style={styles.tr}>
            <Text style={[styles.th, styles.colSl]}>SL</Text>
            <Text style={[styles.th, styles.colName]}>Test Name</Text>
            <Text style={[styles.th, styles.colRate]}>Taka</Text>
          </View>

          {tests.map((t, i) => (
            <View style={styles.tr} key={i}>
              <Text style={[styles.td, styles.colSl]}>{i + 1}</Text>
              <Text style={[styles.td, styles.colName]}>{t.name}</Text>
              <Text style={[styles.td, styles.colRate]}>{tk(t.price)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.summaryWrap}>
          <View style={styles.totalsBox}>
            <View style={styles.totalsRow}>
              <Text>Total</Text>
              <Text>{tk(totals.total)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text>Discount</Text>
              <Text>{tk(totals.discount)}</Text>
            </View>
            <View style={[styles.totalsRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.grandTotal}>Grand Total</Text>
              <Text style={styles.grandTotal}>{tk(totals.grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signRow}>
          <Text style={styles.signBox}>Account's Signature</Text>
          <Text style={styles.signBox}>Receiver's Signature</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
