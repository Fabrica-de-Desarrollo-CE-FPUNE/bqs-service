
import { applicationDefault, initializeApp } from "firebase-admin/app";
import path from "path";

const GOOGLE_APPLICATION_CREDENTIALS =  path.join(__dirname,'../../consultor-test.json');
process.env.GOOGLE_APPLICATION_CREDENTIALS = GOOGLE_APPLICATION_CREDENTIALS;

initializeApp({
    credential: applicationDefault()
});