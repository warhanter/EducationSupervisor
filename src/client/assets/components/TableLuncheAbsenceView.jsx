import React, { Fragment, useState } from "react";
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
  paging: {
    // alignSelf: "center",
    fontSize: 12,
    // textAlign: "center",
    borderStyle: "solid",
    borderTopWidth: 1,
    width: "100%",
  },
  table: {
    fontFamily: "arabic",
    display: "table",
    width: "auto",
    // borderStyle: "solid",
    // borderWidth: 1,
    // borderRight: 0,
    // borderBottom: 0,
    // borderColor: "white",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 5,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    borderStyle: "solid",
    borderWidth: 1,
    borderBottom: 0,
    borderRight: 0,
  },
  tableCol: {
    width: "7%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottom: 0,
  },
  tableColHeader: {
    width: "7%",
    borderStyle: "solid",
    borderRight: 1,
    backgroundColor: "#dddddd",
  },
  tableCell: {
    marginRight: 5,
    marginTop: 5,
    fontSize: 8,
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
    // borderColor: "black",
    // borderStyle: "solid",
    // borderBottomWidth: 1,
  },
  footer: {
    fontFamily: "arabic",
    fontSize: 16,
    textAlign: "left",
    marginTop: 20,
    marginLeft: 70,
  },
});
const TableLuncheAbsenceView = ({ data, date }) => {
  const [paging, setPaging] = useState(data.length);
  const spacingMargin = (index, page) => {
    if (index === 36 + 40) {
      return (
        <View style={styles.spacing}>
          <Text style={styles.paging}>الصفحة 1</Text>
        </View>
      );
    } else {
      return null;
    }
  };
  return (
    <Document>
      <Page>
        <Text style={styles.header}>
          {reverseString(new Date(date).toLocaleDateString("fr"), "/")} غيابات
          النصف داخلي ليوم
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "100px" }]}>
              <Text style={styles.tableCell}>المبرر</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "50px" }]}>
              <Text style={styles.tableCell}>رقم الطاولة</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "150px" }]}>
              <Text style={styles.tableCell}>القسم</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "90px" }]}>
              <Text style={styles.tableCell}>الاسم</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "90px" }]}>
              <Text style={styles.tableCell}>اللقب</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "40px" }]}>
              <Text style={styles.tableCell}>الرقم</Text>
            </View>
          </View>

          {data &&
            data.map((student, index) => {
              let spacing = 1;
              return (
                <Fragment key={index}>
                  <View style={styles.tableRow}>
                    <View style={[styles.tableCol, { width: "100px" }]}>
                      <Text style={styles.tableCell}>
                        {student.justification}
                      </Text>
                    </View>
                    <View style={[styles.tableCol, { width: "50px" }]}>
                      <Text style={styles.tableCell}>
                        {student.tableNumber}
                      </Text>
                    </View>
                    <View style={[styles.tableCol, { width: "150px" }]}>
                      <Text style={styles.tableCell}>{student.class}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "90px" }]}>
                      <Text style={styles.tableCell}>{student.first_name}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "90px" }]}>
                      <Text style={styles.tableCell}>{student.last_name}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "40px" }]}>
                      <Text style={styles.tableCell}>
                        {data.indexOf(student) + 1}
                      </Text>
                    </View>
                  </View>
                  {index == 36 && (
                    <View style={styles.spacing}>
                      <Text style={styles.paging}>الصفحة 1</Text>
                    </View>
                  )}
                  {index == 36 + 40 && (
                    <View style={styles.spacing}>
                      <Text style={styles.paging}>الصفحة 2</Text>
                    </View>
                  )}
                  {index == 36 + 80 && (
                    <View style={styles.spacing}>
                      <Text style={styles.paging}>الصفحة 3</Text>
                    </View>
                  )}
                  {index == 36 + 108 && (
                    <View style={styles.spacing}>
                      <Text style={styles.paging}>الصفحة 4</Text>
                    </View>
                  )}
                  {index == 36 + 176 && (
                    <View style={styles.spacing}>
                      <Text style={styles.paging}>الصفحة 5</Text>
                    </View>
                  )}
                  {index == 36 + 210 && (
                    <View style={styles.spacing}>
                      <Text style={styles.paging}>الصفحة 6</Text>
                    </View>
                  )}
                  {index == 36 + 244 && (
                    <View style={styles.spacing}>
                      <Text style={styles.paging}>الصفحة 7</Text>
                    </View>
                  )}
                  {index == 36 + 278 && (
                    <View style={styles.spacing}>
                      <Text style={styles.paging}>الصفحة 8</Text>
                    </View>
                  )}
                  {index == 36 + 312 && (
                    <View style={styles.spacing}>
                      <Text style={styles.paging}>الصفحة 9</Text>
                    </View>
                  )}
                  {index == 36 + 346 && (
                    <View style={styles.spacing}>
                      <Text style={styles.paging}>الصفحة 10</Text>
                    </View>
                  )}
                </Fragment>
              );
            })}
        </View>
        <Text style={styles.footer}>{"مستشار التربيـــــة"}</Text>
      </Page>
    </Document>
  );
};

export default TableLuncheAbsenceView;
