import { StyAuthProvider } from "@strivacity/sdk-next";

const options = {
  mode: "native",
  issuer: process.env.STRIVACITY_ISSUER,
  clientId: process.env.STRIVACITY_CLIENT_ID,
  redirectUri: process.env.STRIVACITY_REDIRECT_URI,
  scopes: process.env.STRIVACITY_SCOPES.split(" "),
};

export default function AuthProvider({ children }) {
  return <StyAuthProvider options={options}>{children}</StyAuthProvider>;
}
