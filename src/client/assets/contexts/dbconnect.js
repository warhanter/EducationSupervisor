import * as Realm from "realm-web";
import _ from "lodash";
const appID = "supervisorapp-nlsbq";
const dbAPI = `https://eu-central-1.aws.data.mongodb-api.com/app/supervisorapp-nlsbq/endpoint/get?arg1=Student`;
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
let data,
  wafidin,
  moghadirin,
  machtobin,
  nisfDakhili,
  absents,
  students,
  otlaMaradiya;
try {
  data = await getDataStudent();
  students = _.filter(data, (i) => !i.is_fired && !i.switched_school);
  wafidin = _.filter(data, (i) => i.is_new);
  moghadirin = _.filter(data, (i) => i.switched_school);
  machtobin = _.filter(data, (i) => i.is_fired);
  nisfDakhili = _.filter(data, (i) => i.student_status === "نصف داخلي");
  absents = _.filter(data, (i) => i.is_absent);
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
  absents,
  otlaMaradiya,
};
