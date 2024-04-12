import React, { Fragment } from "react";
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
  footer: {
    fontFamily: "arabic",
    fontSize: 16,
    textAlign: "left",
    marginTop: 20,
    marginLeft: 70,
  },
  spacing: {
    height: 40,
    borderColor: "black",
    borderStyle: "solid",
    borderBottomWidth: 1,
  },
});
const TableView = ({ data, date }) => {
  return (
    <Document>
      <Page>
        <Text style={styles.header}>
          {reverseString(new Date(date).toLocaleDateString("fr"), "/")} غيابات
          التلاميذ ليوم
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>المبرر</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>الإجراء</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "30px" }]}>
              <Text style={styles.tableCell}>الأيام</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCell}>سا/غ</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "65px" }]}>
              <Text style={styles.tableCell}>غائب منذ</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "130px" }]}>
              <Text style={styles.tableCell}>القسم</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "80px" }]}>
              <Text style={styles.tableCell}>الاسم</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "70px" }]}>
              <Text style={styles.tableCell}>اللقب</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "30px" }]}>
              <Text style={styles.tableCell}>الرقم</Text>
            </View>
          </View>
          {data &&
            data.map((student, index) => {
              let spacing = 1;
              return (
                <Fragment key={index}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {student.medical_leave}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{student.noticeName}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "30px" }]}>
                      <Text style={styles.tableCell}>
                        {student.absence_days}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {reverseString(student.missed_hours)}
                      </Text>
                    </View>
                    <View style={[styles.tableCol, { width: "65px" }]}>
                      <Text style={styles.tableCell}>
                        {reverseString(student.absence_date, "/")}
                      </Text>
                    </View>
                    <View style={[styles.tableCol, { width: "130px" }]}>
                      <Text style={styles.tableCell}>{student.class}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "80px" }]}>
                      <Text style={styles.tableCell}>{student.first_name}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "70px" }]}>
                      <Text style={styles.tableCell}>{student.last_name}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "30px" }]}>
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
                  {index == 31 + 136 + 34 && <View style={styles.spacing} />}
                  {index == 31 + 136 + 34 * 2 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 3 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 4 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 5 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 6 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 7 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 8 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 9 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 10 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 11 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 12 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 13 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 14 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 15 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 16 && (
                    <View style={styles.spacing} />
                  )}
                  {index == 31 + 136 + 34 * 17 && (
                    <View style={styles.spacing} />
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

export default TableView;
