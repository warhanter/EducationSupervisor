import * as Realm from "realm-web";
import _ from "lodash";
// const appID = "supervisorapp-nlsbq";
// const dbAPI = `https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Student`;
// const dbAPIAbsences = `https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Absence`;
// const dbAPILunchAbsences = `https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=LunchAbsence`;
const appID = "2024-2025-hfwvfab";
const dbAPI = `https://eu-central-1.aws.data.mongodb-api.com/app/2024-2025-hfwvfab/endpoint/get?arg1=Student`;
const dbAPIAbsences = `https://eu-central-1.aws.data.mongodb-api.com/app/2024-2025-hfwvfab/endpoint/get?arg1=Absence`;
const dbAPILunchAbsences = `https://eu-central-1.aws.data.mongodb-api.com/app/2024-2025-hfwvfab/endpoint/get?arg1=LunchAbsence`;
const app = Realm.getApp(appID);
const accessToken = app.currentUser?.accessToken;

const getCollectionData = async (collection) => {
  const user = app.currentUser;
  const data = user?.functions["hello"]({
    query: { arg1: collection },
  });
  return data;
};
const aaaa = await getCollectionData("LunchAbsence");
// console.log(aaaa);
let headers = new Headers({
  "Content-Type": "application/json",
  Authorization: "Bearer " + accessToken,
});
const getDataStudent = async () => {
  return fetch(dbAPI, {
    method: "GET",
    headers: headers,
  }).then((res) => (res.ok ? res.json() : undefined));
};
const getDataAbsence = async () => {
  return fetch(dbAPIAbsences, {
    method: "GET",
    headers: headers,
  }).then((res) => (res.ok ? res.json() : undefined));
};
const getDataLunchAbsence = async () => {
  return fetch(dbAPILunchAbsences, {
    method: "GET",
    headers: headers,
  }).then((res) => (res.ok ? res.json() : undefined));
};
let data,
  wafidin,
  moghadirin,
  machtobin,
  nisfDakhili,
  students,
  otlaMaradiya,
  dataAbsences,
  maafiyin,
  lunchAbsences;
try {
  data = await getDataStudent();
  dataAbsences = await getDataAbsence();
  lunchAbsences = await getDataLunchAbsence();
  students = _.filter(data, (i) => !i.is_fired && !i.switched_school);
  wafidin = _.filter(data, (i) => i.is_new);
  moghadirin = _.filter(data, (i) => i.switched_school);
  machtobin = _.filter(data, (i) => i.is_fired);
  nisfDakhili = _.filter(students, (i) => i.student_status === "نصف داخلي");
  otlaMaradiya = _.filter(students, (i) => i.medical_leave);
  maafiyin = _.filter(students, (i) => i.sport_inapt);
} catch (error) {
  console.log(error);
}

export {
  data,
  students,
  wafidin,
  moghadirin,
  machtobin,
  nisfDakhili,
  otlaMaradiya,
  dataAbsences,
  lunchAbsences,
  maafiyin,
};
