import React from "react";
import {
  View,
  Page,
  Text,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import NotoNaskhArabic from "../fonts/Amiri-Bold.ttf";
Font.register({
  family: "arabic",
  fonts: [
    {
      src: NotoNaskhArabic,
    },
  ],
});
const styles = StyleSheet.create({
  table: {
    fontFamily: "arabic",
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRight: 0,
    borderBottom: 0,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 5,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "8%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColHeader: {
    width: "8%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#dddddd",
  },
  tableCell: {
    marginRight: 5,
    marginTop: 5,
    fontSize: 11,
    textAlign: "right",
  },
  header: {
    fontFamily: "arabic",
    fontSize: 16,
    textAlign: "right",
    marginTop: 15,
    marginRight: 35,
  },
});
const TableView = ({ data }) => {
  return (
    <Document>
      <Page>
        <Text style={styles.header}>
          {new Date().toLocaleDateString("fr")} غيابات التلاميذ ليوم
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>الإجراء</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "40px" }]}>
              <Text style={styles.tableCell}>الأيام</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>سا/غ</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "70px" }]}>
              <Text style={styles.tableCell}>ت/الغياب</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "110px" }]}>
              <Text style={styles.tableCell}>القسم</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "90px" }]}>
              <Text style={styles.tableCell}>الاسم</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "80px" }]}>
              <Text style={styles.tableCell}>اللقب</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "40px" }]}>
              <Text style={styles.tableCell}>الرقم</Text>
            </View>
          </View>

          {data &&
            data.map((student, index) => {
              return (
                <View key={index} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{student.noticeName}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "40px" }]}>
                    <Text style={styles.tableCell}>{student.absence_days}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{student.missed_hours}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "70px" }]}>
                    <Text style={styles.tableCell}>{student.absence_date}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "110px" }]}>
                    <Text style={styles.tableCell}>{student.class}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "90px" }]}>
                    <Text style={styles.tableCell}>{student.first_name}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "80px" }]}>
                    <Text style={styles.tableCell}>{student.last_name}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "40px" }]}>
                    <Text style={styles.tableCell}>
                      {data.indexOf(student) + 1}
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      </Page>
    </Document>
  );
};

export default TableView;
