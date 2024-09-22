import * as Realm from "realm-web";

// const app = new Realm.App({ id: "supervisorapp-nlsbq" });
const app = new Realm.App({ id: "2024-2025-hfwvfab" });
export function emailPasswordCredentials(email, password) {
  return Realm.Credentials.emailPassword(email, password);
}

export default app;
