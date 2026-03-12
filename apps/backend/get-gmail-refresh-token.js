import "dotenv/config";
import { google } from "googleapis";
import readline from "readline";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent"
});

console.log("\nAuthorize this app by visiting this URL:\n");
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("\nEnter the code from that page here: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("\nYour Refresh Token:\n");
    console.log(tokens.refresh_token);
  } catch (err) {
    console.error("Error retrieving access token", err);
  }
  rl.close();
});
