import { google } from "googleapis";
import serviceAccountKey from "../../service-account-key.json";

const auth = new google.auth.GoogleAuth({
	credentials: serviceAccountKey,
	scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheetsClient = google.sheets({ version: "v4", auth });
