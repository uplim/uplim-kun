import GoogleAuth, { type GoogleKey } from 'cloudflare-workers-and-google-oauth';
import serviceAccountKey from '../../service-account-key.json';

// googleapis sdkはNode.js依存のため、型のみ使用しfetchベースで実装する
export async function getSheetsClient() {
  const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
  const googleAuth: GoogleKey = serviceAccountKey;

  const oauth = new GoogleAuth(googleAuth, scopes);
  const token = await oauth.getGoogleAuthToken();

  return token;
}
