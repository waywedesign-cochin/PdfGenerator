// PdfDocument.jsx;
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#f7fafc",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1px solid #e2e8f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
  },
  section: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 5,
    border: "1px solid #e2e8f0",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 100,
    fontSize: 12,
    color: "#718096",
  },
  value: {
    fontSize: 12,
    color: "#2d3748",
    flex: 1,
  },
});

export const PdfDocument = ({ userData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>User Profile Report</Text>
        <Text>Generated from JSONPlaceholder API</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{userData.id}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{userData.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
      </View>

      {/* Add other sections as needed */}
    </Page>
  </Document>
);
