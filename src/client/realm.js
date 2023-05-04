import * as Realm from "realm-web";

const app = new Realm.App({ id: "supervisorapp-nlsbq" });
export function emailPasswordCredentials(email, password) {
  return Realm.Credentials.emailPassword(email, password);
}

export default app;
