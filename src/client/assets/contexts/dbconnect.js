import * as Realm from "realm-web";
import _ from "lodash";
const appID = "supervisorapp-nlsbq";
const dbAPI = `https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Student`;
const dbAPIAbsences = `https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Absence`;
const app = Realm.getApp(appID);
const accessToken = app.currentUser?.accessToken;
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
let data,
  wafidin,
  moghadirin,
  machtobin,
  nisfDakhili,
  students,
  otlaMaradiya,
  dataAbsences;
try {
  data = await getDataStudent();
  dataAbsences = await getDataAbsence();
  students = _.filter(data, (i) => !i.is_fired && !i.switched_school);
  wafidin = _.filter(data, (i) => i.is_new);
  moghadirin = _.filter(data, (i) => i.switched_school);
  machtobin = _.filter(data, (i) => i.is_fired);
  nisfDakhili = _.filter(data, (i) => i.student_status === "نصف داخلي");
  otlaMaradiya = _.filter(data, (i) => i.medical_leave);
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
};
