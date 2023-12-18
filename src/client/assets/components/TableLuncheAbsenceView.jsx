import React from "react";
import {
  View,
  Page,
  Text,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { reverseString } from "../contexts/AppFunctions";
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
    width: "7%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColHeader: {
    width: "7%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#dddddd",
  },
  tableCell: {
    marginRight: 5,
    marginTop: 5,
    fontSize: 10,
    textAlign: "right",
  },
  header: {
    fontFamily: "arabic",
    fontSize: 16,
    textAlign: "right",
    marginTop: 15,
    marginRight: 35,
  },
  spacing: {
    height: 40,
    borderColor: "black",
    borderStyle: "solid",
    borderBottomWidth: 1,
  },
});
const TableLuncheAbsenceView = ({ data, date }) => {
  return (
    <Document>
      <Page>
        <Text style={styles.header}>
          {reverseString(new Date(date).toLocaleDateString("fr"), "/")} غيابات
          النصف داخلي ليوم
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "70px" }]}>
              <Text style={styles.tableCell}>رقم الطاولة</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "170px" }]}>
              <Text style={styles.tableCell}>القسم</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "120px" }]}>
              <Text style={styles.tableCell}>الاسم</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "110px" }]}>
              <Text style={styles.tableCell}>اللقب</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "50px" }]}>
              <Text style={styles.tableCell}>الرقم</Text>
            </View>
          </View>

          {data &&
            data.map((student, index) => {
              let spacing = 1;
              return (
                <>
                  <View key={index} style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: "70px" }]}>
                      <Text style={styles.tableCell}>
                        {student.tableNumber}
                      </Text>
                    </View>
                    <View style={[styles.tableCol, { width: "170px" }]}>
                      <Text style={styles.tableCell}>{student.class}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "120px" }]}>
                      <Text style={styles.tableCell}>{student.first_name}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "110px" }]}>
                      <Text style={styles.tableCell}>{student.last_name}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "50px" }]}>
                      <Text style={styles.tableCell}>
                        {data.indexOf(student) + 1}
                      </Text>
                    </View>
                  </View>
                  {index == 31 && <View style={styles.spacing} />}
                  {index == 31 + 34 && <View style={styles.spacing} />}
                  {index == 31 + 68 && <View style={styles.spacing} />}
                  {index == 31 + 102 && <View style={styles.spacing} />}
                  {index == 31 + 136 && <View style={styles.spacing} />}
                </>
              );
            })}
        </View>
      </Page>
    </Document>
  );
};

export default TableLuncheAbsenceView;
